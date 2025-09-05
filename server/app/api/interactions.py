from fastapi import APIRouter, Depends
from databases import Database
from app.database.connection import get_db
from app.schemas.interaction import InteractionCreate, InteractionUpdate, InteractionResponse
from app.services import interaction_service
from datetime import date, datetime

router = APIRouter(prefix="/interactions", tags=["Interactions"])

@router.post("/create-interaction", response_model=InteractionResponse)
async def create_interaction(interaction: InteractionCreate, db: Database = Depends(get_db)):
    return await interaction_service.create_interaction(db, interaction)

@router.get("/", response_model=list[InteractionResponse])
async def get_interaction(
    type: str = None,
    date: date = None,
    is_automated: bool = None,
    lead_id: int = None,
    customer_id: int = None,
    before: bool = True, 
    db: Database = Depends(get_db)
):
    return await interaction_service.get_interactions(db, type, date, is_automated, lead_id, customer_id, before)


@router.get("/interaction-{interaction_id}", response_model=InteractionResponse)
async def get_interaction(interaction_id: int, db: Database = Depends(get_db)):
    return await interaction_service.get_interaction(db, interaction_id)


@router.put("/{interaction_id}", response_model=InteractionResponse)
async def update_interaction(interaction_id: int, interaction: InteractionUpdate, db: Database = Depends(get_db)):    
    return await interaction_service.update_interaction(db, interaction_id, interaction)  # service function to be implemented

@router.put("/{interaction_id}", response_model=InteractionResponse)
async def update_interaction(interaction_id: int, interaction: InteractionUpdate, db: Database = Depends(get_db)):    
    return await interaction_service.update_interaction(db, interaction_id, interaction)  # service function to be implemented

@router.delete("/{interaction_id}", response_model=InteractionResponse)
async def delete_interaction(interaction_id: int, db: Database = Depends(get_db)):
    return await interaction_service.delete_interaction(db, interaction_id)

