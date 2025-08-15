from warnings import filters
from app.schemas.campaign import CampaignCreate, CampaignUpdate
from sqlalchemy import Table, Column, Integer, String, MetaData, and_, select, insert, update
from databases import Database
from sqlalchemy.exc import IntegrityError
from app.database.models import Campaign
from typing import Any

# Get campaign by ID
async def get_campaign_by_id(db: Database, campaign_id: int):
    query = select(Campaign).where(Campaign.c.id == campaign_id)
    return await db.fetch_one(query)


async def get_campaigns(db: Database, **filters: dict[str, Any]) -> list[dict[str, Any]]:
    query = select(Campaign)
    conditions = []

    for attr, value in filters.items():
        if value is None:
            continue

        if attr == "start":
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

    rows = await db.fetch_all(query)
    return [dict(row) for row in rows]


# Create campaign
async def create_campaign(db: Database, campaign_data: CampaignCreate):
    query = (
        insert(Campaign)
        .values(
            name=campaign_data.name,
            description=campaign_data.description
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
    updated_campaign = await db.execute(update_query)

    return updated_campaign