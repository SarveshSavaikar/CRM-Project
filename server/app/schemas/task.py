from typing import Optional
from datetime import datetime, date
from pydantic import BaseModel, Field, EmailStr

class TaskBase(BaseModel):
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    due_date: datetime
    status: Optional[str] = Field(None, max_length=50)
    priority: str = Field(..., max_length=50)
    user_id: Optional[int] = None
    opportunity_id: Optional[int] = None

class TaskCreate(TaskBase):
    status: str = Field(default="Pending", max_length=50)
    
    
        

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    user_id: Optional[int] = None
    opportunity_id: Optional[int] = None

class TaskResponse(TaskBase):
    id: Optional[int] = None
    lead_id: Optional[int] = None
    class Config:
        from_attributes = True


class TaskInDB(TaskBase):
    id: int

    class Config:
        from_attributes = True
