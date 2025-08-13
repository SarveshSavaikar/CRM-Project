from app.crud import user
from app.schemas.user import UserCreate, UserUpdate
from databases import Database

async def get_user(db: Database, user_id: int):
    return await user.get_user_by_id(db, user_id)

async def get_users(db: Database, role: str, team_id: int):
    if role and team_id:
        return await user.get_user_by_role_team(db, role, team_id)
    elif role:
        return await user.get_user_by_role(db, role)
    elif team_id:
        return await user.get_user_by_role(db, team_id)
    else:
        print("calling get_all_users()")
        return await user.get_all_users(db)
    
async def update_user(db: Database, user_id: str, userObj: UserUpdate):
    return await user.update_user()