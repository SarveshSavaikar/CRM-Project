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
    to: EmailStr  # only one recipient per request
    subject: str
    message: str