from typing import Any
from app.schemas.user import UserCreate  # Pydantic model
from sqlalchemy import Table, Column, Integer, String, MetaData, and_, select, insert, update
from databases import Database
from sqlalchemy.exc import IntegrityError
from app.database.models import User

# Get all users
async def get_all_users(db: Database):
    print("executing get_all_users()")
    query = select(User)
    data = await db.fetch_all(query)
    print(f"type: {type(data)}")
    return data


# Get User by ID
async def get_user_by_id(db: Database, User_id: int):
    query = select(User).where(User.c.id == User_id)
    return await db.fetch_one(query)

# Get User by email
async def get_user_by_email(db: Database, email: str):
    query = select(User).where(User.c.email == email)
    return await db.fetch_one(query)


# Get Users by filters
async def get_users(db: Database, **filters: dict[str, Any]) -> list[dict[str, Any]]:
    query = select(User)
    conditions = []

    for attr, value in filters.items():
        if value is None:
            continue
        elif attr == "name" or attr == "email":
            conditions.append(getattr(User.c, attr).ilike(f"%{value}%"))
        elif hasattr(User.c, attr):
            conditions.append(getattr(User.c, attr) == value)

    if conditions:
        query = query.where(and_(*conditions))

    rows = await db.fetch_all(query)
    return [dict(row) for row in rows]



# Create User
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

# Update User
async def update_user(db: Database, User_id: int, update_data: dict):
    query = (
        update(User)
        .where(User.c.id == User_id)
        .values(**update_data)
        .returning(User)
    )
    return await db.fetch_one(query)

async def delete_user(db: Database, user_id: int):
    query = (
        User
        .delete()
        .where(User.c.id == user_id)
        .returning(User)
    )
    
    
    return await db.fetch_one(query)