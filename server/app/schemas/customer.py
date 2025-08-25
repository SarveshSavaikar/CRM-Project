from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr, field_validator

class CustomerBase(BaseModel):
    name: str = Field(..., max_length=255)
    email: EmailStr = Field(..., max_length=255)
    phone: Optional[str] = Field(None, max_length=20)
    description: Optional[str] = Field(None, max_length=255)
    industry: Optional[str] = Field(None, max_length=255)
    lead_id: Optional[int] = None

class CustomerCreate(CustomerBase):
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    
    @field_validator("created_at", "updated_at", mode="before")
    @classmethod
    def always_now(cls, v):
        return datetime.now()
    
        

class CustomerUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=20)
    description: Optional[str] = Field(None, max_length=255)
    industry: Optional[str] = Field(None, max_length=255)
    lead_id: Optional[int] = None
    updated_at: datetime = Field(default_factory=datetime.now)  

class CustomerResponse(CustomerBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True


class CustomerInDB(CustomerBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
