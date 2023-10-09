import os
from typing import Optional, List
from datetime import datetime
import hmac
import hashlib

from fastapi import APIRouter, status
from sqlalchemy import select, insert, update, delete, desc, join
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.exc import DBAPIError
from pydantic import BaseModel, Field

from .db_schema import events_table, event_participants
from .utils import parse_validate_init_data


BOT_TOKEN = "6457589571:AAFjAPcwUrrySkEVzaWsbszMn3zdjSqI-IY"

class HandlerException(Exception):
    def __init__(self, message: str, http_code: int):
        self.message = message
        self.http_code = http_code


DB_URL = os.environ.get("DB_URL")
engine = create_async_engine(DB_URL)
router = APIRouter()


@router.get("/events", status_code=status.HTTP_200_OK)
async def get_events(
        category: str,
        event_location: str,
        order_by: str = "",
        descending: bool = False,
        search_query: str = None,
        page_size: int = 100,
        page_offset: int = 0,
):
    stmt = select(events_table).where(
        events_table.c.category == category and
        events_table.c.location == event_location
    )
    if search_query is not None:
        stmt = stmt.where(
            events_table.c.event_name.icontains(search_query)
        )
    if order_by != "":
        col = events_table.c[order_by]
        if descending:
            col = desc(col)
        stmt = stmt.order_by(col)
    stmt = stmt.offset(page_offset).limit(page_size)

    async with engine.begin() as conn:
        res = await conn.execute(stmt)
    events = res.mappings().fetchall()
    return {"events": events}


@router.get("/users/{user_id}/events_joined", status_code=status.HTTP_200_OK)
async def get_events_user_joined(user_id: int):
    stmt = join(
        events_table,
        event_participants,
        events_table.c.event_id == event_participants.c.event_id
    )
    stmt = (
        select(events_table)
        .where(event_participants.c.participant_id == user_id)
        .select_from(stmt)
    )
    # stmt = (select(events_table)
    #         .join(event_participants, event_participants.c.participant_id == user_id))
    async with engine.begin() as conn:
        res = await conn.execute(stmt)
    events_joined = res.mappings().fetchall()
    return {"events_joined": events_joined}


@router.get("/users/{user_id}/events_created", status_code=status.HTTP_200_OK)
async def get_events_user_created(user_id: int):
    stmt = select(events_table).where(events_table.c.owner_id == user_id)
    async with engine.begin() as conn:
        res = await conn.execute(stmt)
    events_created = res.mappings().fetchall()
    return {"events_created": events_created}


class NewEvent(BaseModel):
    event_name: str = Field(max_length=256)
    description: str = Field(max_length=1024, default="")
    max_participants: int
    owner_id: int
    event_time: datetime
    event_location: str
    category: str
    chat_link: str = "abcd"


@router.post("/events", status_code=status.HTTP_201_CREATED)
async def create_event(new_event: NewEvent):
    async with engine.begin() as conn:
        stmt = insert(events_table).values(**new_event.model_dump(exclude={"hashtags"}))
        try:
            res = await conn.execute(stmt)
            new_event_id = res.inserted_primary_key[0]
        except DBAPIError as e:
            # This method of parsing an error message isn't good,
            # the best way to avoid it is to use asyncpg connection pool
            # without sa wrapper. That way asyncpg error types
            # will be available for inspection.
            if "UniqueViolation" in str(e.orig):
                raise HandlerException(
                    "event_name_not_unique",
                    status.HTTP_400_BAD_REQUEST
                )
            else:
                raise e
        stmt = insert(event_participants).values(
            event_id=new_event_id,
            participant_id=new_event.owner_id
        )
        await conn.execute(stmt)

    new_event_id = res.inserted_primary_key[0]

    return {"event_id": new_event_id}


class UpdatedEvent(BaseModel):
    event_name: str = Field(max_length=256, default=None)
    description: str = Field(max_length=1024, default=None)
    max_participants: Optional[int] = None
    event_time: Optional[datetime] = None
    event_location: Optional[str] = None


@router.patch("/events/{event_id}", status_code=status.HTTP_200_OK)
async def update_event(event_id: int, event_for_update: UpdatedEvent):
    stmt = (
        update(events_table)
        .where(events_table.c.event_id == event_id)
        .values(**event_for_update.model_dump(exclude_none=True))
    )
    async with engine.begin() as conn:
        try:
            res = await conn.execute(stmt)
        except DBAPIError as e:
            # This method of parsing an error message isn't good,
            # the best way to avoid it is to use asyncpg connection pool
            # without sa wrapper. That way asyncpg error types
            # will be available for inspection.
            if "UniqueViolation" in str(e.orig):
                raise HandlerException(
                    "event_name_not_unique",
                    status.HTTP_400_BAD_REQUEST
                )
            else:
                raise e

    if res.rowcount == 0:
        raise HandlerException(
            "event_doesnt_exist",
            status.HTTP_404_NOT_FOUND
        )


@router.delete("/events/{event_id}", status_code=status.HTTP_200_OK)
async def delete_event(event_id: int):
    stmt = (
        delete(events_table)
        .where(events_table.c.event_id == event_id)
    )
    async with engine.begin() as conn:
        await conn.execute(stmt)


class AddParticipant(BaseModel):
    participant_id: int
    max_participants: int


@router.post("/events/{event_id}/participants", status_code=status.HTTP_200_OK)
async def add_participant(event_id: int, new_participant: AddParticipant):
    participant_id, max_participants = (new_participant.participant_id,
                                        new_participant.max_participants)
    async with engine.begin() as conn:
        stmt = (
            select(event_participants.c.participant_id)
            .where(event_participants.c.event_id == event_id)
        )
        res = await conn.execute(stmt)
        res = res.mappings().fetchall()
        if len(res) == max_participants:
            raise HandlerException(
                "event_is_full",
                status.HTTP_400_BAD_REQUEST
            )
        if participant_id in set(x["participant_id"] for x in res):
            raise HandlerException(
                "participant_already_in_event",
                status.HTTP_400_BAD_REQUEST
            )

        stmt = (
            insert(event_participants)
            .values(
                event_id=event_id,
                participant_id=new_participant.participant_id
            )
        )
        try:
            await conn.execute(stmt)
        except DBAPIError as e:
            if "ForeignKeyViolationError" in str(e.orig):
                raise HandlerException(
                    "event_doesnt_exist",
                    status.HTTP_404_NOT_FOUND
                )
            else:
                raise e


@router.delete("/events/{event_id}/participants/{participant_id}", status_code=status.HTTP_200_OK)
async def delete_participant(event_id: int, participant_id: int):
    stmt = (
            delete(event_participants)
            .where(
                event_participants.c.event_id == event_id and
                event_participants.c.participant_id == participant_id
            )
    )
    async with engine.begin() as conn:
        await conn.execute(stmt)


@router.get("/events/{event_id}/participants", status_code=status.HTTP_200_OK)
async def get_participants(event_id: int):
    stmt = (
        select(event_participants.c.participant_id)
        .where(event_participants.c.event_id == event_id)
    )
    async with engine.begin() as conn:
        res = await conn.execute(stmt)

    participant_ids = res.scalars().fetchall()

    return {"participant_ids": participant_ids}


@router.get("/utils/valid_data", status_code=status.HTTP_200_OK)
async def validate_data(init_data: str):
    data_is_valid = False
    parsed_data = {}
    try:
        data_is_valid, parsed_data = parse_validate_init_data(init_data)
    except:
        pass

    if not data_is_valid:
        raise HandlerException(
            message="tg_init_data_is_invalid",
            http_code=403
        )

    return {
        "data_is_valid": data_is_valid,
        "parsed_data": parsed_data
    }

class UpdatedHashtags(BaseModel):
    hashtags: List[str]


