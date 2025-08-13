# app/database/models/user.py
import sqlalchemy
from sqlalchemy import ForeignKey, Table, Column, Integer, String, MetaData

metadata = MetaData()

Team = Table(
    "Team",
    metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("name", String(100), nullable=False),
    Column("description", Text, nullable=True)
)



Lead = Table(
    "Lead",
    metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("name", String(100), nullable=False),
    Column("email", String(100), unique=True, nullable=True),
    Column("phone", Integer, unique=False, nullable=True),
    Column("source", String(100), nullable=True, default="UNKNOWN"),
    Column("status", String(50), nullable=True, default="--"),
    Column("score", Float, nullable=True, default=0.0),
    Column("created_at", Date, nullable=False),
    Column("updated_at", Date, nullable=False),
    Column("team_id", Integer, ForeignKey("team.id")),
    Column("user_id", Integer, ForeignKey("user.id"))
)

User = Table(
    "User",
    metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("name", String(100), nullable=False),
    Column("role", String(20), nullable=False, default="Unassigned"),
    Column("email", String(100), unique=True, nullable=True),
    Column("team_id", Integer, ForeignKey("team.id"))
)
