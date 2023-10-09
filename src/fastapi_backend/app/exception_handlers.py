from fastapi import status
from fastapi.responses import PlainTextResponse, JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError

from .handlers import HandlerException


async def validation_exception_handler(request, exc: RequestValidationError):
    return JSONResponse(
        content={
            "error_code": "validation_error",
            "original_error": str(exc)
        },
        status_code=status.HTTP_400_BAD_REQUEST
    )


async def db_exception_handler(request, exc: SQLAlchemyError):
    return JSONResponse(
        content={"error_code": "db_unavailable"},
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE
    )


async def handler_exception_handler(request, exc: HandlerException):
    return JSONResponse(
        content={"error_code": exc.message},
        status_code=exc.http_code
    )


async def unknown_exception_handler(request, exc: Exception):
    return JSONResponse(
        content={"error_code": "unknown_error"},
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
    )


exception_handlers = {
    RequestValidationError: validation_exception_handler,
    SQLAlchemyError: db_exception_handler,
    HandlerException: handler_exception_handler,
    Exception: unknown_exception_handler
}
