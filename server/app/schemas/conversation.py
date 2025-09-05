from typing import Optional
from datetime import datetime, date
from pydantic import BaseModel, Field, EmailStr

class ConversationBase(BaseModel):
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    due_date: datetime
    status: Optional[str] = Field(None, max_length=50)
    priority: str = Field(..., max_length=50)
    user_id: Optional[int] = None
    opportunity_id: Optional[int] = None

class ConversationCreate(ConversationBase):
    status: Optional[str] = Field(default="Pending", max_length=50)


    
        

class ConversationUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    user_id: Optional[int] = None
    opportunity_id: Optional[int] = None

class ConversationResponse(ConversationBase):
    id: Optional[int] = None
    lead_id: Optional[int] = None
    class Config:
        from_attributes = True


class ConversationInDB(ConversationBase):
    id: int

    class Config:
        from_attributes = True
