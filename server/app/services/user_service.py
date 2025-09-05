from collections import defaultdict
from typing import Optional
from fastapi import HTTPException
from app.crud import user
from app.schemas.user import UserCreate, UserResponse, UserUpdate
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
    # update_data = {}
    # if(userObj.email.replace(" ","") != ""):
    #     update_data["email"] = userObj.email
    # if(userObj.role.replace(" ","") != ""):
    #     update_data["role"] = userObj.role
    # if(userObj.name.replace(" ","") != ""):
    #     update_data["name"] = userObj.name
    # if(userObj.team_id != 0):
    #     update_data["team_id"] = userObj.team_id
    
    return await user.update_user(db, user_id, update_data)

async def delete_user(db: Database, user_id: int):
    await lead_service.update_lead(db, leadObj=LeadUpdate(user_id=None, status="Unassigned"), user_id=user_id)
    result = await user.delete_user(db, user_id)
    if not result:
        raise HTTPException(status_code=404, detail=f"User(id:{user_id}) not found. Failed to delete.")
    return result

async def get_user_performance(db, order_by_lead: bool, id: int = None):
    result = await user.get_user_performance(db, id)
    result = [dict(row) for row in result]
    users = defaultdict(lambda: {
        "user": None,
        "total_leads": 0,
        "total_value": 0.0
    })

    for record in result:
        if users[record["id"]]["user"] is None:
            users[record["id"]]["user"] = UserResponse(**record)
        
        users[record["id"]]["total_leads"] += 1
        users[record["id"]]["total_value"] += float(record["opp_value"])

    users = dict(users)
    users = list(users.values())

    if order_by_lead:
        users.sort(key=lambda u: u["total_leads"], reverse=True)
    else:    
        users.sort(key=lambda u: u["total_value"], reverse=True)
    return users
        