# from fastapi.responses import JSONResponse #type: ignore
# from crud import get_all_users, create_user
# from server_utils import User, UserPydantic
# import json
from fastapi import FastAPI # type: ignore
from app.api import users, leads, auth, teams
from app.api import test_db
from app.database.connection import database

app = FastAPI(
    title="CRM-API",
    version="1.0.0",
    description="API server for CRM Application"
)

# Startup event → connect to DB
@app.on_event("startup")
async def startup():
    await database.connect()

# Shutdown event → disconnect from DB
@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


app.include_router(auth.router)
app.include_router(test_db.router, prefix="/debug", tags=["Debug"])
app.include_router(users.router)
app.include_router(leads.router)
app.include_router(teams.router)