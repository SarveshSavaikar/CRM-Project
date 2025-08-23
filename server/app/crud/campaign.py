from datetime import datetime
from warnings import filters
from app.schemas.campaign import CampaignCreate, CampaignUpdate
from sqlalchemy import Table, Column, Integer, String, MetaData, and_, func, select, insert, update
from databases import Database
from sqlalchemy.exc import IntegrityError
from app.database.models import Campaign, Lead, LeadCampaign
from typing import Any

from . import crud_utils
prefix_columns = crud_utils.prefix_columns

# Get campaign by ID
async def get_campaign_by_id(db: Database, campaign_id: int):
    query = select(Campaign).where(Campaign.c.id == campaign_id)
    return await db.fetch_one(query)


async def get_campaigns(db: Database, count: bool = False, **filters: dict[str, Any]) -> list[dict[str, Any]]:
    query = select(func.count(Campaign.c.id)) if count else select(Campaign)
    conditions = []

    for attr, value in filters.items():
        if value is None:
            continue
        
        if attr == "active_only":
            today = datetime.now()
            conditions.append(Campaign.c.start_date <= today)
            conditions.append(Campaign.c.end_date >= today)
        elif attr == "start":
            start = filters.get("start")
            if start:
                conditions.append(Campaign.c.start_date >= start)
        elif attr == "end":
            end = filters.get("end")
            if end:
                conditions.append(Campaign.c.end_date <= end)
        elif hasattr(Campaign.c, attr):
            conditions.append(getattr(Campaign.c, attr) == value)

    if conditions:
        query = query.where(and_(*conditions))

    if count:
        return await db.execute(query)
    else:
        rows = await db.fetch_all(query)
        return [dict(row) for row in rows]


# Create campaign
async def create_campaign(db: Database, campaign_data: CampaignCreate):
    query = (
        insert(Campaign)
        .values(
            name=campaign_data.name,
            description=campaign_data.description,
            start_date=campaign_data.start_date,
            end_date=campaign_data.end_date
        )
        .returning(Campaign)
    )

    try:
        return await db.fetch_one(query)
    except IntegrityError as e:
        raise e

# Update campaign
async def update_campaign(db: Database, campaign_id: int, update_data: dict):
    update_query = (
        Campaign
        .update()
        .where(Campaign.c.id == campaign_id)
        .values(**update_data)
        .returning(Campaign)
    )
    updated_campaign = await db.fetch_one(update_query)

    return updated_campaign


async def delete_campaign(db: Database, campaign_id: int):
    query = (
        Campaign
        .delete()
        .where(Campaign.c.id == campaign_id)
        .returning(Campaign)
    )
    
    
    return await db.fetch_one(query)

async def get_lead_campaigns(db: Database, count: bool = False):
    query = select(func.count(LeadCampaign.c.lead_id)) if count else select(
        Lead.c.id.label("lead_id"),
        Lead.c.name.label("lead_name"),
        Lead.c.email.label("lead_email"),
        Campaign.c.id.label("campaign_id"),
        Campaign.c.name.label("campaign_name"),
        Campaign.c.channel.label("campaign_channel"),
        Campaign.c.start_date.label("campaign_start_date"),
        Campaign.c.end_date.label("campaign_end_date")
    )
    if not count:
        query = query.select_from(
            LeadCampaign
            .join(Lead, LeadCampaign.c.lead_id == Lead.c.id)
            .join(Campaign, LeadCampaign.c.campaign_id == Campaign.c.id)
        )
        result = await db.fetch_all(query)
        print([dict(row) for row in result])
        return result
    else:
        return await db.execute(query)
        