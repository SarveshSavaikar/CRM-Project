from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr
from user import UserCreate

class SignUp(BaseModel):
    name: str = Field(..., max_length=100)
    email: EmailStr
    role: str = Field(default="Unassigned", max_length=20)
    password: str
    team_id: Optional[int] = None
    
    def sign_up_to_create(self)->UserCreate:
        return UserCreate(name=self.name, email=self.email, role=self.role, team_id=self.team_id)
    

class LogIn(BaseModel):
    email: EmailStr
    password: str

class SignUpResponse(BaseModel):
    pass

class LogInResponse(BaseModel):
    pass