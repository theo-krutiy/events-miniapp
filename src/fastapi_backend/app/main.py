from fastapi.exceptions import RequestValidationError
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware

from .handlers import router, HandlerException
from .exception_handlers import exception_handlers


def init_app():
    _app = FastAPI()
    _app.include_router(router)
    for exception_type, handler in exception_handlers.items():
        _app.add_exception_handler(exception_type, handler)

    origins = [
        "http://localhost:80",
        "https://localhost:80",
        "http://localhost",
        "https://localhost",
        "localhost"
    ]
    _app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    return _app


app = init_app()
