# app/database/models/user.py
import sqlalchemy
from sqlalchemy import Date, Float, ForeignKey, Table, Column, Integer, String, MetaData, Text

metadata = MetaData()

Team = Table(
    "Team",
    metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("name", String(100), nullable=False),
    Column("description", Text, nullable=True)
)
