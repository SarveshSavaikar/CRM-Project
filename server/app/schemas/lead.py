from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr

class LeadBase(BaseModel):
    name: str = Field(..., max_length=255)
    email: EmailStr = Field(..., max_length=255)
    phone: Optional[str] = Field(None, max_length=20)
    source: str = Field(..., max_length=100)
    status: str = Field(..., max_length=50)
    score: int = Field(default=0)
    team_id: Optional[int] = None
    user_id: Optional[int] = None

class LeadCreate(LeadBase):
    pass
    
        

class LeadUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    role: Optional[str] = Field(None, max_length=20)
    department: Optional[int] = None  # Or str if needed
    status: Optional[str] = Field(None, max_length=10)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=20)

class LeadResponse(LeadBase):
    pass
    class Config:
        from_attributes = True


class LeadInDB(LeadBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
