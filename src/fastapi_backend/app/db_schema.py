from sqlalchemy import (MetaData, Table, Column,
                        Integer, String,
                        TIMESTAMP, BigInteger, ForeignKey,
                        PrimaryKeyConstraint, CheckConstraint)


metadata = MetaData()


events_table = Table(
    "events",
    metadata,
    Column("event_id", BigInteger, primary_key=True),
    Column("event_name", String(256), nullable=False, unique=True),
    Column("description", String(1024)),
    Column("curr_participants", Integer, CheckConstraint("curr_participants <= max_participants", name="no overflow"), default=1,),
    Column("max_participants", Integer, nullable=False),
    Column("owner_id", BigInteger, nullable=False),
    Column("event_time", TIMESTAMP(timezone=True), nullable=False),
    Column("category", String, nullable=False),
    Column("event_location", String, nullable=False),
    Column("chat_link", String, nullable=False),

)

event_participants = Table(
    "event_participants",
    metadata,
    Column("event_id", BigInteger, ForeignKey("events.event_id", ondelete="CASCADE")),
    Column("participant_id", BigInteger, nullable=False),
    PrimaryKeyConstraint("event_id", "participant_id")
)

event_hashtags = Table(
    "event_hashtags",
    metadata,
    Column("event_id", BigInteger, ForeignKey("events.event_id", ondelete="CASCADE")),
    Column("hashtag", String(256), nullable=False),
    PrimaryKeyConstraint("event_id", "hashtag")
)
