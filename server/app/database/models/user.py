# models/relationname.py

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.database.base import Base  # Import your project's declarative base


class User(Base):
    """
    Represents the 'User' table in the database.
    """
    __tablename__ = "User"

    # Columns
    id = Column(Integer, primary_key=True, index=True)
    # user_id = Column(String(12), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    role = Column(String(20), nullable=False, default="Unassigned")
    email = Column(String(100), unique=True, nullable=True)
    team_id = Column(Integer)
    # department = Column(Integer, nullable=False, default="Unassigned")
    # status = Column(String(20), nullable=False, default="Idle")
    # phone = Column(String(20), unique=True, nullable=True)
    # start = Column(DateTime(timezone=True), server_default=func.now())
    # updated = Column(
    #     DateTime(timezone=True),
    #     server_default=func.now(),
    #     onupdate=func.now()
    # )

    # Relationships
    # -- -- 
    
    
    # Helper methods
    def to_dict(self):
        return {
            "id": self.id,
            # "user_id": self.user_id,
            "name": self.name,
            "role": self.role,
            # "department": self.department,
            # "status": self.status,
            "email": self.email
            # "phone": self.phone,
            # "start": self.created_at.isoformat() if self.created_at else None,
            # "updated": self.updated_at.isoformat() if self.updated_at else None
        }
    
