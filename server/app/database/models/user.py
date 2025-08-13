# app/database/models/user.py
import sqlalchemy
from sqlalchemy import ForeignKey, Table, Column, Integer, String, MetaData

metadata = MetaData()

User = Table(
    "User",
    metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("name", String(100), nullable=False),
    Column("role", String(20), nullable=False, default="Unassigned"),
    Column("email", String(100), unique=True, nullable=True),
    Column("team_id", Integer, ForeignKey("team.id"))
)