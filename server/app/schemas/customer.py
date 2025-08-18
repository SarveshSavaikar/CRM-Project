from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr

class CustomerBase(BaseModel):
    name: str = Field(..., max_length=255)
    email: EmailStr = Field(..., max_length=255)
    phone: Optional[str] = Field(None, max_length=20)
    company: str = Field(..., max_length=255)
    industry: str = Field(..., max_length=255)
    lead_id: Optional[int] = None

class CustomerCreate(CustomerBase):
    created_at: Optional[datetime] = Field(default=datetime.now())
    updated_at: Optional[datetime] = Field(default=datetime.now())
    pass
    
        

class CustomerUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=20)
    company: Optional[str] = Field(None, max_length=255)
    industry: Optional[str] = Field(None, max_length=255)
    lead_id: Optional[int] = None
    updated_at: Optional[datetime] = Field(default=datetime.now())  

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
