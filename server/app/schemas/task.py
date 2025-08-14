from typing import Optional
from datetime import datetime, date
from pydantic import BaseModel, Field, EmailStr

class TaskBase(BaseModel):
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    due_date: datetime
    status: str = Field(..., max_length=50)
    priority: str = Field(..., max_length=50)
    user_id: Optional[int] = None
    opportunity_id: Optional[int] = None

class TaskCreate(TaskBase):
    pass
    
        

class TaskUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    due_date: Optional[datetime]
    status: Optional[str]
    priority: Optional[str]
    user_id: Optional[int]
    opportunity_id: Optional[int]

class TaskResponse(TaskBase):
    id: Optional[int] = None
    lead_id: Optional[int] = None
    class Config:
        from_attributes = True


class TaskInDB(TaskBase):
    id: int

    class Config:
        from_attributes = True
