from app.crud import user
from app.schemas.user import  UserCreate
from app.schemas.auth import SignUp, LogIn, AuthResponse
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.security import decode_token , hash_password, verify_password , pwd_context
from app.database.connection import database
from app.core.config import settings
# from app.core.config import settings
from app.database.connection import get_db
from app.database.models.user import User
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

# ---------------- JWT ----------------
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.access_token_expire_minutes))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.algorithm)
    return encoded_jwt

# ---------------- Password hashing ----------------
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# ---------------- Authentication ----------------
def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

# ---------------- Create new user ----------------
async def create_user(user: UserCreate):
    hashed_password = hash_password(user.password)
    query = 'INSERT INTO "User" (name, email, password_hash, role) VALUES (:name, :email, :password_hash, :role) RETURNING id, name, email, role'
    values = {
        "name": user.name,
        "email": user.email,
        "password_hash": hashed_password,
        "role": user.role
    }
    row = await database.fetch_one(query, values)
    return row 
