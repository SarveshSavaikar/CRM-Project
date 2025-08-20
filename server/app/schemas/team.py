from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr

class TeamBase(BaseModel):
    name: str = Field(..., max_length=255)
    description: Optional[str] = None

class TeamCreate(TeamBase):
    pass
    
        

class TeamUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class TeamResponse(TeamBase):
    id: int
    class Config:
        from_attributes = True


class TeamInDB(BaseModel):
    id: int
    name: str
    description: str

    class Config:
        from_attributes = True
