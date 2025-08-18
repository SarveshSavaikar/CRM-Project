# app/database/models/user.py
import sqlalchemy
from sqlalchemy import Date, Float, ForeignKey, Table, Column, Integer, String, MetaData, Text, DateTime

metadata = MetaData()



Team = Table(
    "Team",
    metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("name", String(100), nullable=False),
    Column("description", Text, nullable=True)
)

Campaign = Table(
    "Campaign",
    metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("name", String(100), nullable=False),
    Column("description", Text, nullable=True),
    Column("channel", String(50), nullable=False),
    Column("start_date", Date, nullable=True),
    Column("end_date", Date, nullable=True)
)

PipelineStage = Table(
    "PipelineStage",
    metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("name", String(50), nullable=False),
    Column("order", Integer, nullable=False)
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
    Column("team_id", Integer, ForeignKey(Team.c.id)),
    Column("user_id", Integer, ForeignKey(User.c.id))
)


LeadCampaign = Table(
    "LeadCampaign",
    metadata,
    Column("lead_id", Integer, ForeignKey(Lead.c.id), nullable=False),
    Column("campaign_id", Integer, ForeignKey(Campaign.c.id), nullable=False)
)


Opportunity = Table(
    "Opportunity",
    metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("name", String(100), nullable=False),
    Column("value", Float, nullable=True, default=0.0),
    Column("close_date", Date, nullable=False),
    Column("created_at", Date, nullable=False),
    Column("lead_id", Integer, ForeignKey(Lead.c.id)),
    Column("pipeline_stage_id", Integer, ForeignKey(PipelineStage.c.id))
)

Task = Table(
    "Task",
    metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("title", String(100), nullable=False),
    Column("description", String, nullable=False),
    Column("due_date", DateTime, nullable=False),
    Column("priority", String(50), nullable=False, default="Low"),
    Column("status", String(50), nullable=False, default="Pending"),
    Column("user_id", Integer, ForeignKey(Lead.c.id)),
    Column("opportunity_id", Integer, ForeignKey(PipelineStage.c.id))
)

Customer = Table(
    "Customer",
    metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("name", String(100), nullable=False),
    Column("email", String(100), unique=True, nullable=True),
    Column("phone", Integer, unique=False, nullable=True),
    Column("company", String(255), nullable=True, default="UNKNOWN"),
    Column("industry", String(50), nullable=True, default="UNKNOWN"),
    Column("created_at", DateTime, nullable=False),
    Column("updated_at", DateTime, nullable=False),
    Column("lead_id", Integer, ForeignKey(Lead.c.id))
)