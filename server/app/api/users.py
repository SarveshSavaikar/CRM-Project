from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.services import user_service
from databases import Database

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/", response_model=list[UserResponse])
async def get_users(role: str = None, team_id: int = None, db: Database = Depends(get_db)):
    print("get:/users/")
    return await user_service.get_users(db, role, team_id)


@router.get("/user-{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: Database = Depends(get_db)):
    return await user_service.get_user(db, user_id)

@router.put("/user-{user_id}", response_model=UserResponse)
async def update_user(user_id: str, user: UserUpdate, db: Database = Depends(get_db)):    
    return await user_service.update_user(user_id, user)

@router.delete("/{user_id}")
async def delete_user(user_id: int, db: Database = Depends(get_db)):
    return await user_service.delete_user(db, user_id)

