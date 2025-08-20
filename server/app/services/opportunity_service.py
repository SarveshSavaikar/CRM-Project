from fastapi import HTTPException
from app.crud import opportunity
from app.schemas.opportunity import OpportunityCreate, OpportunityUpdate
from app.schemas.lead import LeadStageUpdate
from datetime import date, datetime, time
from databases import Database
from typing import Any, Optional
from datetime import date
from app.schemas.task import TaskUpdate
from . import task_service

async def get_opportunity(db: Database, opportunity_id: int):
    result = await opportunity.get_opportunity_by_id(db, opportunity_id)
    
    if not result:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    return result


async def get_opportunities(
    db: Database,
    close_date: date,
    created: date,
    min_value: float,
    max_value: float,
    lead_id: int,
    pipeline_stage_id: int,
    before: bool
):
    filters = {}

    if min_value is not None:
        filters["min_value"] = min_value
    if max_value is not None:
        filters["max_value"] = max_value
    if lead_id is not None:
        filters["lead_id"] = lead_id
    if pipeline_stage_id is not None:
        filters["pipeline_stage_id"] = pipeline_stage_id
    if before is True and close_date is not None:
        filters["close_date__lt"] = datetime.combine(close_date, time.max)
    elif before is False and close_date is not None:
        filters["close_date__gt"] = datetime.combine(close_date, time.max)
    if before is True and created is not None:
        filters["created__lt"] = datetime.combine(created, time.max)
    elif before is False and created is not None:
        filters["created__gt"] = datetime.combine(created, time.max)

    return await opportunity.get_opportunities(db, **filters)

async def update_opportunity(db: Database, opportunity_id: int=None, opportunityObj: OpportunityUpdate=None, **filters: dict[str, Any]):
    if opportunity_id is not None:
        result = await opportunity.get_opportunity_by_id(db, opportunity_id)
        if result is None:
            raise HTTPException(status_code=404, detail="Opportunity not found")

    update_data = opportunityObj.model_dump(exclude_unset=True)
    
    if opportunity_id is not None:
        return await opportunity.update_opportunity(db, opportunity_id, update_data)
    else:
        return await opportunity.update_opportunity_by_filters(db, update_data, **filters)
    
async def create_opportunity(db: Database, opportunityObj: OpportunityCreate):
    opportunityObj.lead_id = None if opportunityObj.lead_id == 0 else opportunityObj.lead_id
    opportunityObj.pipeline_stage_id = None if opportunityObj.pipeline_stage_id==0 else opportunityObj.pipeline_stage_id
    return await opportunity.create_opportunity(db, opportunityObj)

async def delete_opportunity(db: Database, opportunity_id: int):
    await task_service.update_task(db, taskObj=TaskUpdate(opportunity_id=None), opportunity_id=opportunity_id)
    result = await opportunity.delete_opportunity(db, opportunity_id)
    if not result:
        raise HTTPException(status_code=404, detail=f"Opportunity(id:{opportunity_id}) not found. Failed to delete.")
    return result

async def update_opportunity_by_lead(db: Database, lead_id: int, update: LeadStageUpdate):
    result = await opportunity.update_opportunity_by_lead_id(db, lead_id, update.pipeline_stage_id)
    
    if not result:
        raise HTTPException(status_code=404, detail="Record(Opportunity) not found")
    
    return result