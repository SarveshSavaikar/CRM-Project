from pydantic import BaseModel ,EmailStr
from typing import List


# ==========================
# Pydantic model for email
# ==========================
class Email(BaseModel):
    sender: str
    subject: str
    body: str
    date: str

class EmailRequest(BaseModel):
    to: List[str]      # multiple recipients
    subject: str
    message: str