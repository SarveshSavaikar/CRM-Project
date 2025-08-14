from app.crud import user
from app.schemas.user import  UserCreate
from app.schemas.auth import SignUp, LogIn, AuthResponse , SignUpResponse
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
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

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
async def authenticate_user(email: str, password: str):
    query = 'SELECT id, email, password_hash, role FROM "User" WHERE email = :email'
    user = await database.fetch_one(query, {"email": email})
    if not user:
        print("Usen not found")
        return None
    if not verify_password(password, user["password_hash"]):
        print("Incorrect Password")
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

async def check_user(email: str):
    query = 'SELECT id FROM "User" WHERE email = :email'
    existing = await database.fetch_one(query, {"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
        return True
    return False


async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.algorithm])
        email = payload.get("sub")
        role = payload.get("role")
        if email is None or role is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"email": email, "role": role}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")