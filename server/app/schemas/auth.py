from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr
from app.schemas.user import UserCreate

class SignUp(BaseModel):
    name: str = Field(..., max_length=100)
    email: EmailStr
    role: str = Field(default="Unassigned", max_length=20)
    password: str
    team_id: Optional[int] = None
    
    def sign_up_to_create(self)->UserCreate:
        return UserCreate(name=self.name, email=self.email, role=self.role, team_id=self.team_id)
    
class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    name: Optional[str] = None
    email: EmailStr
    password: str
    role: Optional[str] = "viewer"  # restrict on server side too

class UserOut(BaseModel):
    id: int
    name: Optional[str]
    email: EmailStr
    role: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class LogIn(BaseModel):
    email: EmailStr
    password: str
# JWT signup response model
class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"