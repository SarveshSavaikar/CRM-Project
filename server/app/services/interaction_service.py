from fastapi import HTTPException
from app.crud import interaction
from app.schemas.interaction import InteractionCreate, InteractionUpdate
from datetime import date, datetime, time
from databases import Database
from typing import Optional
from datetime import date

async def get_interaction(db: Database, interaction_id: int):
    result = await interaction.get_interaction_by_id(db, interaction_id)
    
    if not result:
        raise HTTPException(status_code=404, detail="Interaction not found")
    
    return result

async def get_interactions(
    db: Database,
    type: str,
    date: date,
    is_automated: bool,
    lead_id: int,
    customer_id: int,
    before: bool
):
    filters = {}

    if type is not None:
        filters["type"] = type
    if is_automated is not None:
        filters["is_automated"] = is_automated
    if lead_id is not None:
        filters["lead_id"] = lead_id
    if customer_id is not None:
        filters["customer_id"] = customer_id
    if before is True and date is not None:
        filters["date__lt"] = datetime.combine(date, time.max)
    elif before is False and date is not None:
        filters["date__gt"] = datetime.combine(date, time.max)

    return await interaction.get_interactions(db, **filters)

async def update_interaction(db: Database, interaction_id: str, interactionObj: InteractionUpdate):
    result = await interaction.get_interaction_by_id(db, interaction_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Interaction not found")

    update_data = interactionObj.model_dump(exclude_unset=True)
    
    return await interaction.update_interaction(db, interaction_id, update_data)
    
async def create_interaction(db: Database, interactionObj: InteractionCreate):
    return await interaction.create_interaction(db, interactionObj)

async def delete_interaction(db: Database, interaction_id: int):
    return await interaction.delete_interaction(db, interaction_id)