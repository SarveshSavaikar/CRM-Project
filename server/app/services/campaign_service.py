from fastapi import HTTPException
from app.crud import campaign
from app.schemas.campaign import CampaignCreate, CampaignUpdate
from datetime import date, datetime, time
from databases import Database


async def get_campaign(db: Database, campaign_id: int):
    result = await campaign.get_campaign_by_id(db, campaign_id)
    
    if not result:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    return result

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


    update_data = campaignObj.model_dump(exclude_unset=True)
    
    return await campaign.update_campaign(db, campaign_id, update_data)

async def create_campaign(db: Database, campaignObj: CampaignCreate):
    campaignObj.start_date = datetime.combine(campaignObj.start_date, time.min)
    campaignObj.end_date = datetime.combine(campaignObj.end_date, time.max)
    print(campaignObj)
    return await campaign.create_campaign(db, campaignObj)

async def delete_campaign(db: Database, campaign_id: int):
    result = await campaign.delete_campaign(db, campaign_id)
    if not result:
        raise HTTPException(status_code=404, detail=f"Campaign(id:{campaign_id}) not found. Failed to delete.")
    return result