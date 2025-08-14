from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr

class UserBase(BaseModel):
    name: str = Field(..., max_length=100)
    role: str = Field(default="Unassigned", max_length=20)
    email: EmailStr
    team_id: Optional[int] = None
    # phone: Optional[str] = Field(None, max_length=20)
    # user_id: str = Field(..., max_length=12)
    # department: int = Field(default=0)
    # status: str = Field(default="Idle", max_length=10)

class UserCreate(UserBase):
    pass
    
        

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    role: Optional[str] = Field(None, max_length=20)
    department: Optional[int] = None  # Or str if needed
    status: Optional[str] = Field(None, max_length=10)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=20)

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    
    class Config:
        from_attributes = True


class UserInDB(UserBase):
    id: int
    start: datetime
    updated: datetime

    class Config:
        from_attributes = True
