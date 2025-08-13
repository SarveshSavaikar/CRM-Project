from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.user import UserSignUp, UserLogIn, UserResponse
from app.schemas.auth import SignUp, LogIn, SignUpResponse, LogInResponse
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup", response_model=UserSignUp)
def create_user(user: UserSignUp, db: Session = Depends(get_db)) -> UserResponse:
    return auth_service.sign_up(user)

@router.post("/login", response_model=UserLogIn)
def create_user(user: UserLogIn, db: Session = Depends(get_db)) -> UserResponse:
    return auth_service.log_in(user)



