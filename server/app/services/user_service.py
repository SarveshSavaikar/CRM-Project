from app.crud import user
from app.schemas.user import UserCreate
from sqlalchemy.orm import Session


def get_user(db: Session, user_id: int):
    return user.get_user_by_id(db, user_id)

def get_user(db: Session, role: str, team_id: int):
    if role and team_id:
        return user.get_user_by_role_team(db, role, team_id)
    elif role:
        return user.get_user_by_role(db, role)
    elif team_id:
        return user.get_user_by_role(db, team_id)
    else:
        return user.get_all_users(db)