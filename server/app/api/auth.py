from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.auth import SignUp, LogIn, AuthResponse
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup", response_model=AuthResponse)
def create_user(user: SignUp, db: Session = Depends(get_db)):
    return auth_service.sign_up(user)

@router.post("/login", response_model=AuthResponse)
def create_user(user: LogIn, db: Session = Depends(get_db)):
    return auth_service.log_in(user)



