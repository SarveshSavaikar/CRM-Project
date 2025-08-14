from app.schemas.lead import LeadCreate, LeadUpdate
from sqlalchemy import Table, Column, Integer, String, MetaData, and_, select, insert, update
from databases import Database
from sqlalchemy.exc import IntegrityError
from app.database.models import Lead
from typing import Any

# Get lead by ID
async def get_lead_by_id(db: Database, lead_id: int):
    query = select(Lead).where(Lead.c.id == lead_id)
    return await db.fetch_one(query)

async def get_leads(db: Database, **filters: dict[str, Any]) -> list[dict[str, Any]]:
    query = select(Lead)
    conditions = []

    for attr, value in filters.items():
        if value is None:
            continue

        if attr == "before":
            last_updated = filters.get("last_updated")
            if last_updated:
                if value:  # before = True
                    conditions.append(Lead.c.last_updated < last_updated)
                else:      # before = False
                    conditions.append(Lead.c.last_updated > last_updated)
        elif hasattr(Lead.c, attr):
            conditions.append(getattr(Lead.c, attr) == value)

    if conditions:
        query = query.where(and_(*conditions))

    rows = await db.fetch_all(query)
    return [dict(row) for row in rows]


# Create lead
async def create_lead(db: Database, lead_data: LeadCreate):
    query = (
        insert(Lead)
        .values(
            name=lead_data.name,
            role=lead_data.role,
            status="Idle",
            email=lead_data.email
        )
        .returning(Lead)

    )

    try:
        return await db.fetch_one(query)
    except IntegrityError as e:
        raise e

# Update lead
async def update_lead(db: Database, lead_id: int, update_data: dict):
    update_query = (
        Lead
        .update()
        .where(Lead.c.id == lead_id)
        .values(**update_data)
        .returning(Lead)
    )
    updated_lead = await db.execute(update_query)

    return updated_lead