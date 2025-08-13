from app.crud import user
from app.schemas.user import UserCreate
from sqlalchemy.orm import Session

def create_user(db: Session, user_data: UserCreate):
    # Example business logic: check email availability
    if user.get_user_by_email(db, user_data.email):
        raise ValueError("Email already registered")
    
    # Hash password, send welcome email, etc.
    return user.create_user(db, user_data)
