# from fastapi.responses import JSONResponse #type: ignore
# from crud import get_all_users, create_user
# from server_utils import User, UserPydantic
# import json
from fastapi import FastAPI , File, UploadFile# type: ignore


from app.api import users, leads, auth, teams, campaigns, tasks, admin, customers, opportunities, interactions , email , linkedin, analytics , taskStages ,products, upload


from app.api import test_db
from app.database.connection import database
from app.middlewares.jwt_middleware import JWTMiddleware
from fastapi.middleware.cors import CORSMiddleware
import uuid
import os
from app.s3_bucket.s3_utlities import upload_file_to_s3

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

app.add_middleware(JWTMiddleware)
origins = [
    "http://localhost:5173",   # Vite/React dev server
    "http://localhost:3000",   # CRA/Next.js dev server (if used)
    "http://127.0.0.1:5173",
    # add your deployed frontend domain here later
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # allow POST, GET, OPTIONS, etc.
    allow_headers=["*"],  # allow all headers (Authorization, Content-Type, etc.)
)

@app.get("/")
async def root():
    return {"message": "CRM API is running."}
app.include_router(auth.router)
app.include_router(test_db.router, prefix="/debug", tags=["Debug"])
app.include_router(users.router)
app.include_router(leads.router)
app.include_router(teams.router)
app.include_router(admin.router)
app.include_router(campaigns.router)
app.include_router(tasks.router)
app.include_router(customers.router)
app.include_router(opportunities.router)
app.include_router(interactions.router)
app.include_router(products.router)

app.include_router(email.router)
app.include_router(linkedin.router)

app.include_router(analytics.router)
app.include_router(taskStages.router)
app.include_router(upload.router)


@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    temp_file = f"/tmp/{uuid.uuid4()}_{file.filename}"
    with open(temp_file, "wb") as f:
        f.write(await file.read())

    # Upload to S3
    s3_url = upload_file_to_s3(temp_file, f"uploads/{file.filename}")
    
    os.remove(temp_file)  # cleanup

    return {"file_url": s3_url}