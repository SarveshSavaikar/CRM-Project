from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr

class UserBase(BaseModel):
    name: str = Field(..., max_length=100)
    role: str = Field(default="Unassigned", max_length=20)
    email: str
    team_id: Optional[int] = None

class UserCreate(UserBase):
    pass
    
        

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    role: Optional[str] = Field(None, max_length=20)
    email: Optional[str] = None
    team_id: Optional[int] = None

class UserResponse(UserBase):
    id: int
    
    class Config:
        from_attributes = True


class UserInDB(UserBase):
    id: int

    class Config:
        from_attributes = True
