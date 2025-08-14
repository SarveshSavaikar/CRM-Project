from fastapi import APIRouter, Depends
from databases import Database
from app.database.connection import get_db
from app.schemas.lead import LeadCreate, LeadUpdate, LeadResponse
from app.services import lead_service
from datetime import date

router = APIRouter(prefix="/leads", tags=["Leads"])

@router.get("/", response_model=list[LeadResponse])
async def get_lead(
    source: str = None,
    status: str = None, 
    min_score: float = None, 
    team_id: int = None, 
    user_id: int = None, 
    created: date = None, 
    last_updated: date = None, 
    before: bool = False, 
    db: Database = Depends(get_db)
):
    return await lead_service.get_leads(db, source, status, min_score, team_id, user_id, created, last_updated, before)


@router.get("/lead-{lead_id}", response_model=LeadResponse)
async def get_lead(lead_id: int, db: Database = Depends(get_db)):
    return await lead_service.get_lead(db, lead_id)


@router.put("/{lead_id}", response_model=LeadResponse)
async def update_lead(lead_id: str, lead: LeadUpdate):    
    return await lead_service.update_lead(lead_id, lead)  # service function to be implemented


# @router.delete("/{lead_id}")
# def delete_lead(lead_id: str):
#     return lead_service.delete_lead(lead_id)  # service function to be implemented
