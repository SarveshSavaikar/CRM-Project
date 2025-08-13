from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.auth import SignUp, LogIn, SignUpResponse, LogInResponse
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup", response_model=SignUp)
def create_user(user: SignUp, db: Session = Depends(get_db)) -> SignUpResponse:
    return auth_service.sign_up(user)

@router.post("/login", response_model=LogIn)
def create_user(user: LogIn, db: Session = Depends(get_db)) -> LogInResponse:
    return auth_service.log_in(user)



