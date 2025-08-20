from typing import Optional
from datetime import datetime, date
from pydantic import BaseModel, Field, EmailStr

class CampaignBase(BaseModel):
    name: str = Field(..., max_length=255)
    description: Optional[str] = None
    channel: Optional[str] = None

class CampaignCreate(CampaignBase):
    start_date: date
    end_date: date
    
        

class CampaignUpdate(BaseModel):
    name: Optional[str] = Field(default=None, max_length=255)
    description: Optional[str] = None
    channel: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class CampaignResponse(CampaignBase):
    id: int
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    class Config:
        from_attributes = True


class CampaignInDB(CampaignBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
