from typing import Optional
from app.crud import user
from app.schemas.user import UserCreate, UserUpdate
from databases import Database

async def get_user(db: Database, user_id: int):
    return await user.get_user_by_id(db, user_id)

async def get_users(
    db: Database,
    role: Optional[str] = None,
    team_id: Optional[int] = None
):
    filters = {}

    if role is not None:
        filters["role"] = role
    if team_id is not None:
        filters["team_id"] = team_id

    return await user.get_users(db, **filters)
    
async def update_user(db: Database, user_id: str, userObj: UserUpdate):
    return await user.update_user()