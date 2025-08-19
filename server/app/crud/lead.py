from app.schemas.lead import LeadCreate, LeadUpdate
from sqlalchemy import Table, Column, Integer, String, MetaData, and_, func, select, insert, update
from databases import Database
from sqlalchemy.exc import IntegrityError
from app.database.models import Lead
from typing import Any

# Get lead by ID
async def get_lead_by_id(db: Database, lead_id: int):
    query = select(Lead).where(Lead.c.id == lead_id)
    return await db.fetch_one(query)

async def get_leads(db: Database, count=False, **filters: dict[str, Any]) -> list[dict[str, Any]]:
    query = select(func.count()).select_from(Lead) if count else select(Lead)
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

    if count:
        result = await db.execute(query)
        return result#.scalar_one() 
    else:
        rows = await db.fetch_all(query)
        return [dict(row) for row in rows]


# Create lead
async def create_lead(db: Database, lead_data: LeadCreate):
    query = (
        insert(Lead)
        .values(
            name=lead_data.name,
            email = lead_data.email,
            phone = lead_data.phone,
            source = lead_data.source,
            status = lead_data.status,
            score = lead_data.score,
            team_id = lead_data.team_id,
            user_id = lead_data.user_id
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
    updated_lead = await db.fetch_one(update_query)

    return updated_lead

async def update_leads_by_filters(db: Database, update_data: dict, **filters: dict[str, Any]):
    query = (
        Lead
        .update()
        .values(**update_data)
        .returning(Lead)
    )
    
    conditions = []
    for attr, val in filters.items():
        if hasattr(Lead.c, attr):
            conditions.append(getattr(Lead.c, attr) == val)
    
    if conditions:
        query = query.where(and_(*conditions))
        
    updated_leads = await db.fetch_all(query)
    
    return updated_leads

async def delete_lead(db: Database, lead_id: int):
    query = (
        Lead
        .delete()
        .where(Lead.c.id == lead_id)
    )
    
    
    return await db.execute(query)

async def get_lead_count(db: Database):
    query = select(func.count()).select_from(Lead)
    result = await db.execute(query)
    return result.scalar_one()

async def get_leads_grouped(db: Database, group_by: str):
    if group_by == "source":
        query = (
            select(Lead.c.source, func.count().label("count"))
            .group_by(Lead.c.source)
        )
    
    rows = await db.fetch_all(query)
    return {"group": [row[0] for row in rows], "count": [row[1] for row in rows]}