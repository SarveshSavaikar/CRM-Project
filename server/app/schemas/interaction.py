from typing import Optional
from datetime import datetime, date
from pydantic import BaseModel, Field, EmailStr

class InteractionBase(BaseModel):
    type: str = Field(..., max_length=255)
    content: Optional[str] = None
    is_automated: Optional[bool] = Field(default=False)
    lead_id: Optional[int] = None
    customer_id: Optional[int] = None

class InteractionCreate(InteractionBase):
    timestamp: datetime = Field(default_factory=datetime.now)


class InteractionUpdate(BaseModel):
    type: Optional[str] = None
    content: Optional[str] = None

class InteractionResponse(InteractionBase):
    id: int
    timestamp: datetime
    class Config:
        from_attributes = True


class InteractionInDB(InteractionBase):
    id: int

    class Config:
        from_attributes = True
