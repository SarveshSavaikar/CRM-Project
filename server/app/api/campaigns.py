from fastapi import APIRouter, Depends
from databases import Database
from app.database.connection import get_db
from app.schemas.campaign import CampaignCreate, CampaignUpdate, CampaignResponse
from app.services import campaign_service
from datetime import date

router = APIRouter(prefix="/campaigns", tags=["Campaigns"])

@router.get("/", response_model=list[CampaignResponse])
async def get_campaigns(
    name: str = None,
    channel: str = None,
    start: date = None, 
    end: date = None, 
    db: Database = Depends(get_db)
):
    return await campaign_service.get_campaigns(db, name, channel, start, end)


@router.get("/campaign-{campaign_id}", response_model=CampaignResponse)
async def get_campaign(campaign_id: int, db: Database = Depends(get_db)):
    return await campaign_service.get_campaign(db, campaign_id)


@router.put("/{campaign_id}", response_model=CampaignResponse)
async def update_campaign(campaign_id: str, campaign: CampaignUpdate):    
    return await campaign_service.update_campaign(campaign_id, campaign)  # service function to be implemented


