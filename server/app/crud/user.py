from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database.models.user import User
from app.schemas.user import UserCreate  # Pydantic model for input
import datetime


def get_all_users(db: Session):
    return db.query(User).all()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()
    
def create_user(db: Session, user_data: UserCreate):
    # Convert UserCreate to SQLAlchemy User model instance
    new_user = User(
        name=user_data.name,
        role=user_data.role,
        status="Idle",
        email=user_data.email
        # department=user_data.department,
        # user_id=generate_user_id(),  # keep your existing helper function
        # phone=user_data.phone,
        # start=datetime.date.today()
    )

    db.add(new_user)
    try:
        db.commit()
        db.refresh(new_user)
        return new_user
    except IntegrityError as e:
        db.rollback()
        # You can inspect `e` for unique constraint violations and re-raise or return None
        raise e
