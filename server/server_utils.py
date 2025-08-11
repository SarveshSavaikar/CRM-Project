import string
import random
from pydantic import BaseModel # type: ignore

class User:
    def __init__(self, user_id=None, name=None, role=None, department=None, status=None, email=None, phone=None, start=None):
        self.id = None
        self.user_id = user_id
        self.name = name
        self.email = email
        self.phone = phone
        self.start = start
        self.status = status
        self.role = role
        self.department = department
    
    def show(self):
        print(f"Name: {self.name}\tUser ID: {self.user_id}")
        print(f"Department: {self.department}\tRole: {self.role}")

class UserResponse(BaseModel):
    success: bool
    message: str

def generate_user_id():
    user_id = ""
    alphabets = string.ascii_uppercase
    for i in range(11):
        user_id += random.choices([random.choices(alphabets, k=1)[0], str(random.randint(0, 10))], k=1)[0]
    return len(user_id)
    return user_id

def get_user_from_row(row):
    return User(row["user_id"], row["name"], row["role"], row["department"], row["email"], row["phone"], row["status"])