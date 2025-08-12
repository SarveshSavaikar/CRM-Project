from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.services import user_service

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    return user_service.create_user(user)

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: str):
    return user_service.get_user(user_id)  # service function to be implemented

@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: str, user: UserUpdate):
    return user_service.update_user(user_id, user)  # service function to be implemented

@router.delete("/{user_id}")
def delete_user(user_id: str):
    return user_service.delete_user(user_id)  # service function to be implemented
