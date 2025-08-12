# from fastapi.responses import JSONResponse #type: ignore
# from crud import get_all_users, create_user
# from server_utils import User, UserPydantic
# import json
from fastapi import FastAPI # type: ignore
from app.api import users


app = FastAPI(
    title="CRM-API",
    version="1.0.0",
    description="API server for CRM Application"
)

app.include_router(users.router)