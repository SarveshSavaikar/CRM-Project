from app.crud import user
from app.schemas.user import UserSignUp, UserCreate
from sqlalchemy.orm import Session

def sign_up(db: Session, user_sign_up: UserSignUp):
    if user.get_user_by_email(db, user_sign_up.email):
        raise ValueError("Email already registered")
    else:
        pass
    
    """
        Insert Firebase API call here:
        check for firebase response validity then proceed or return error
        
    """
    user_data = user_sign_up.sign_up_to_create()

    return user.create_user(db, user_data)
