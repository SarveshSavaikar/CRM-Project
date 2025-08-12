from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr

class UserBase(BaseModel):
    # user_id: str = Field(..., max_length=12)
    name: str = Field(..., max_length=100)
    role: str = Field(default="Unassigned", max_length=20)
    department: int = Field(default=0)
    status: str = Field(default="Idle", max_length=10)
    email: Optional[EmailStr] = None
    # phone: Optional[str] = Field(None, max_length=20)

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
    email: str
    
    class Config:
        orm_mode = True
    

class UserInDB(UserBase):
    id: int
    start: datetime
    updated: datetime

    class Config:
        from_attributes = True
