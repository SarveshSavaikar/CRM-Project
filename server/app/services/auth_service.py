from app.crud import user
from app.schemas.user import  UserCreate
from app.schemas.auth import SignUp, LogIn, SignUpResponse, LogInResponse
from sqlalchemy.orm import Session

def sign_up(db: Session, user_sign_up: SignUp) -> SignUpResponse:
    if user.get_user_by_email(db, user_sign_up.email):
        raise ValueError("Email already registered")
    else:
        pass
    
    """
        Insert User auth here:
        check for response validity then proceed or return error
        
    """
    user_data = user_sign_up.sign_up_to_create()

    return user.create_user(db, user_data)
