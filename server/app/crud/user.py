from app.schemas.user import UserCreate  # Pydantic model
from sqlalchemy import Table, Column, Integer, String, MetaData, select, insert, update
from databases import Database
from sqlalchemy.exc import IntegrityError
from app.database.models import User

# Get all users
async def get_all_users(db: Database):
    query = select(User)
    return await db.fetch_all(query)

# Get user by ID
async def get_user_by_id(db: Database, user_id: int):
    query = select(User).where(User.c.id == user_id)
    return await db.fetch_one(query)

# Get user by email
async def get_user_by_email(db: Database, email: str):
    query = select(User).where(User.c.email == email)
    return await db.fetch_one(query)

# Get users by role & team
async def get_user_by_role_team(db: Database, role: str, team_id: int):
    query = (
        select(User)
        .where(User.c.team_id == team_id)
        .where(User.c.role == role)
    )
    return await db.fetch_all(query)

# Get users by team
async def get_user_by_team(db: Database, team_id: int):
    query = select(User).where(User.c.team_id == team_id)
    return await db.fetch_all(query)

# Get users by role
async def get_user_by_role(db: Database, role: str):
    query = select(User).where(User.c.role == role)
    return await db.fetch_all(query)

# Create user
async def create_user(db: Database, user_data: UserCreate):
    query = (
        insert(User)
        .values(
            name=user_data.name,
            role=user_data.role,
            status="Idle",
            email=user_data.email
        )
        .returning(User)
    )

    try:
        return await db.fetch_one(query)
    except IntegrityError as e:
        raise e

# Update user
async def update_user(db: Database, user_id: int, update_data: dict):
    query = (
        update(User)
        .where(User.c.id == user_id)
        .values(**update_data)
        .returning(User)
    )
    return await db.fetch_one(query)