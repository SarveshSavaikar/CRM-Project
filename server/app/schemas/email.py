
from pydantic import BaseModel


# ==========================
# Pydantic model for email
# ==========================
class Email(BaseModel):
    sender: str
    subject: str
    body: str
    date: str
