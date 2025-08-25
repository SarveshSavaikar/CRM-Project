from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr

class OpportunityBase(BaseModel):
    name: str = Field(..., max_length=255)
    value: float = Field(default=0.0)
    lead_id: Optional[int] = None
    pipeline_stage_id: Optional[int] = None
    close_date: Optional[datetime] = None


class OpportunityCreate(OpportunityBase):
    created_at: datetime = Field(default_factory=datetime.now)
    
        

class OpportunityUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    value: Optional[float] = Field(None)
    lead_id: Optional[int] = Field(None)
    pipeline_stage_id: Optional[int] = Field(None)
    close_date: Optional[datetime] = None
    


class OpportunityResponse(OpportunityBase):
    id: int
    created_at: datetime
    stage: Optional[str] = None
    class Config:
        from_attributes = True


class OpportunityInDB(OpportunityBase):
    id: int
    created_at: datetime
    close_date: datetime

    class Config:
        from_attributes = True
