from fastapi import HTTPException
from app.crud import campaign
from app.schemas.campaign import CampaignCreate, CampaignUpdate
from datetime import date
from databases import Database


async def get_campaign(db: Database, campaign_id: int):
    return await campaign.get_campaign_by_id(db, campaign_id)

from typing import Optional
from datetime import date

async def get_campaigns(
    db: Database,
    name: str,
    channel: str,
    start: date, 
    end: date
):
    filters = {}

    if name is not None:
        filters["name"] = name
    if channel is not None:
        filters["channel"] = channel
    if start is not None:
        filters["start"] = start
    if end is not None:
        filters["end"] = end

    return await campaign.get_campaigns(db, **filters)

async def update_campaign(db: Database, campaign_id: str, campaignObj: CampaignUpdate):
    result = await campaign.get_campaign_by_id(db, campaign_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Campaign not found")

    db_data = dict(result)

    update_data = campaignObj.model_dump(exclude_unset=True)
    
    campaign.update_campaign(db, update_data)
    