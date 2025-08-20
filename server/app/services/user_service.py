from typing import Optional
from fastapi import HTTPException
from app.crud import user
from app.schemas.user import UserCreate, UserUpdate
from databases import Database

from app.schemas.lead import LeadUpdate
from . import lead_service

async def get_user(db: Database, user_id: int):
    result = await user.get_user_by_id(db, user_id)
    
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    
    return result

async def get_users(
    db: Database,
    name: str,
    email: str,
    role: Optional[str] = None,
    team_id: Optional[int] = None
):
    filters = {}

    if name is not None:
        filters["name"] = name
    if email is not None:
        filters["email"] = email
    if role is not None:
        filters["role"] = role
    if team_id is not None:
        filters["team_id"] = team_id

    return await user.get_users(db, **filters)
    
async def create_user(db: Database, userObj: UserCreate):
    userObj.team_id = None if userObj.team_id==0 else userObj.team_id
    return await user.create_user(db, userObj)    

async def update_user(db: Database, user_id: str, userObj: UserUpdate):
    result = await user.get_user_by_id(db, user_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Task not found")

    update_data = userObj.model_dump(exclude_unset=True)
    
    return await user.update_user(db, user_id, update_data)

async def delete_user(db: Database, user_id: int):
    await lead_service.update_lead(db, leadObj=LeadUpdate(user_id=None, status="Unassigned"), user_id=user_id)
    result = await user.delete_user(db, user_id)
    if not result:
        raise HTTPException(status_code=404, detail=f"User(id:{user_id}) not found. Failed to delete.")
    return result