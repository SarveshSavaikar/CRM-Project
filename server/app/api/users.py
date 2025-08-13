from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.services import user_service
from databases import Database

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/", response_model=list[UserResponse])
def get_users(role: str = None, team_id: int = None, db: Database = Depends(get_db)):
    return user_service.get_user(db, role, team_id)


@router.get("/user-{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Database = Depends(get_db)):
    return user_service.get_user(db, user_id)


@router.put("/user-{user_id}", response_model=UserResponse)
def update_user(user_id: str, user: UserUpdate, db: Database = Depends(get_db)):    
    return user_service.update_user(user_id, user)  # service function to be implemented


# @router.delete("/{user_id}")
# def delete_user(user_id: str):
#     return user_service.delete_user(user_id)  # service function to be implemented
