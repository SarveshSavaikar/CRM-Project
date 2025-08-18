from fastapi import HTTPException
from app.crud import lead
from app.schemas.lead import LeadCreate, LeadUpdate
from datetime import date
from databases import Database


async def get_lead(db: Database, lead_id: int):
    return await lead.get_lead_by_id(db, lead_id)

from typing import Optional
from datetime import date

async def get_leads(
    db: Database,
    source: Optional[str] = None,
    status: Optional[str] = None,
    min_score: Optional[float] = None,
    team_id: Optional[int] = None,
    user_id: Optional[int] = None,
    created: Optional[date] = None,
    last_updated: Optional[date] = None,
    before: Optional[bool] = None
):
    filters = {}

    if source is not None:
        filters["source"] = source
    if status is not None:
        filters["status"] = status
    if min_score is not None:
        filters["score__gte"] = min_score
    if team_id is not None:
        filters["team_id"] = team_id
    if user_id is not None:
        filters["user_id"] = user_id
    if created is not None:
        filters["created"] = created
    if last_updated is not None:
        filters["last_updated"] = last_updated
    if before is True and last_updated is not None:
        filters["last_updated__lt"] = last_updated
    elif before is False and last_updated is not None:
        filters["last_updated__gt"] = last_updated

    return await lead.get_leads(db, **filters)

async def update_lead(db: Database, lead_id: str, leadObj: LeadUpdate):
    result = await lead.get_lead_by_id(db, lead_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Lead not found")

    db_data = dict(result)

    update_data = leadObj.model_dump(exclude_unset=True)
    
    lead.update_lead(db, update_data)
    