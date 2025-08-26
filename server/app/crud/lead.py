from app.schemas.lead import LeadCreate, LeadUpdate
from sqlalchemy import Table, Column, Integer, String, MetaData, and_, func, select, insert, update
from databases import Database
from sqlalchemy.exc import IntegrityError
from app.database.models import Lead, Team, User, LeadCampaign, Campaign
from typing import Any

from datetime import datetime
from . import crud_utils


prefix_columns = crud_utils.prefix_columns
# Get lead by ID
async def get_lead_by_id(db: Database, lead_id: int):
    query = select(Lead).where(Lead.c.id == lead_id)
    return await db.fetch_one(query)

async def get_leads(db: Database, count=False, **filters: dict[str, Any]) -> list[dict[str, Any]]:
    if count:
        query = select(func.count()).select_from(Lead)
    else:
        query = (
            select(
                *prefix_columns(User, "user"),
                *prefix_columns(Team, "team"),
                *prefix_columns(Lead, "")
            )   
            .select_from(
                Lead
                .outerjoin(User, Lead.c.user_id == User.c.id)
                .outerjoin(Team, Lead.c.team_id == Team.c.id)
            )
        )
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
        elif attr == "user_name":
            conditions.append(User.c.name.ilike(f"%{value}%"))
        elif attr == "team_name":
            conditions.append(Team.c.name.ilike(f"%{value}%"))
        elif hasattr(Lead.c, attr):
            conditions.append(getattr(Lead.c, attr) == value)

    if conditions:
        query = query.where(and_(*conditions))

    if count:
        result = await db.execute(query)
        return result#.scalar_one() 
    else:
        rows = await db.fetch_all(query)
        returning = [dict(row) for row in rows]
        return returning


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
    update_data["updated_at"] = datetime.utcnow()
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
        .returning(Lead)
    )
    
    
    return await db.fetch_one(query)

async def get_lead_count(db: Database):
    query = select(func.count()).select_from(Lead)
    result = await db.execute(query)
    return result.scalar_one()

async def get_leads_grouped(db: Database, group_by: str):
    query = crud_utils.build_group_by_query(Lead, group_by)
    
    rows = await db.fetch_all(query)
    return {row[0]:row[1] for row in rows}

async def associate_lead_with_campaign(db: Database, lead_id: int, campaign_id: int):
    query = (
        LeadCampaign
        .insert()
        .values(campaign_id=campaign_id, lead_id=lead_id)
        .returning(LeadCampaign)
    )
    try:
        await db.fetch_one(query)
    except IntegrityError as e:
        raise e
    
    return await get_lead_campaign(db, lead_id, campaign_id)

async def get_lead_campaign(db: Database, lead_id: int = None, campaign_id: int = None):

    query = (
        select(*prefix_columns(LeadCampaign, ""),
                *prefix_columns(Lead, "lead"),
                *prefix_columns(Campaign, "campaign")
        ).select_from(
            LeadCampaign
            .join(Lead, LeadCampaign.c.lead_id == Lead.c.id)
            .join(Campaign, LeadCampaign.c.campaign_id == Campaign.c.id)
        )
    )
    conditions = []
    if lead_id:
        conditions.append(LeadCampaign.c.lead_id == lead_id)
    if campaign_id:
        conditions.append(LeadCampaign.c.campaign_id == campaign_id)
    if conditions:    
        query = query.where(and_(*conditions))
    
    lead_campaign = await db.fetch_all(query)
        
    if len(lead_campaign) == 1:
        return dict(lead_campaign[0])
    else:
        return [dict(lc) for lc in lead_campaign]