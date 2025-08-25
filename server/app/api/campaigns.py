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
    active_only: bool = False,
    db: Database = Depends(get_db)
):
    return await campaign_service.get_campaigns(db, name, channel, start, end, active_only)


@router.get("/campaign-{campaign_id}", response_model=CampaignResponse)
async def get_campaign(campaign_id: int, db: Database = Depends(get_db)):
    return await campaign_service.get_campaign(db, campaign_id)


@router.post("/create-campaign", response_model=CampaignResponse)
async def create_campaign(campaign: CampaignCreate, db: Database = Depends(get_db)):
    return await campaign_service.create_campaign(db, campaign)

@router.put("/campaign-{campaign_id}", response_model=CampaignResponse)
async def update_campaign(campaign_id: int, campaign: CampaignUpdate, db: Database = Depends(get_db)):    
    return await campaign_service.update_campaign(db, campaign_id, campaign)

@router.delete("/{campaign_id}", response_model=CampaignResponse)
async def delete_campaign(campaign_id: int, db: Database = Depends(get_db)):
    return await campaign_service.delete_campaign(db, campaign_id)

@router.get("/lead-campaigns")
async def get_lead_campaigns(db: Database = Depends(get_db)):
    return await campaign_service.get_lead_campaigns(db)