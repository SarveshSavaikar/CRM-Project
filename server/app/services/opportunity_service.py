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
from asyncpg.exceptions import UniqueViolationError
from calendar import month_name

async def get_opportunity(db: Database, opportunity_id: int):
    result = await opportunity.get_opportunity_by_id(db, opportunity_id)
    
    if not result:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    return result


async def get_opportunities(
    db: Database,
    close_date: date = None,
    created: date = None,
    min_value: float = None,
    max_value: float = None,
    lead_id: int = None,
    pipeline_stage_id: int = None,
    before: bool = True,
    count: bool = False,
    active_only: bool = False
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
    if active_only:
        filters["not_pipeline_stage_id"] = [5, 6]
    if before is True and close_date is not None:
        filters["close_date__lt"] = datetime.combine(close_date, time.max)
    elif before is False and close_date is not None:
        filters["close_date__gt"] = datetime.combine(close_date, time.max)
    if before is True and created is not None:
        filters["created__lt"] = datetime.combine(created, time.max)
    elif before is False and created is not None:
        filters["created__gt"] = datetime.combine(created, time.max)

    return await opportunity.get_opportunities(db, count, **filters)

async def update_opportunity(db: Database, opportunity_id: int=None, opportunityObj: OpportunityUpdate=None, **filters: dict[str, Any]):
    if opportunity_id is not None:
        result = await opportunity.get_opportunity_by_id(db, opportunity_id)
        if result is None:
            raise HTTPException(status_code=404, detail="Opportunity not found")

    update_data = opportunityObj.model_dump(exclude_unset=True)
    try:
        if opportunity_id is not None:
            return await opportunity.update_opportunity(db, opportunity_id, update_data)
        else:
            return await opportunity.update_opportunity_by_filters(db, update_data, **filters)
    except UniqueViolationError as e:
        raise HTTPException(status_code=409, detail="Opportunity linked to specified Lead ID already exists.")
    
async def create_opportunity(db: Database, opportunityObj: OpportunityCreate):
    opportunityObj.lead_id = None if opportunityObj.lead_id == 0 else opportunityObj.lead_id
    opportunityObj.pipeline_stage_id = None if opportunityObj.pipeline_stage_id==0 else opportunityObj.pipeline_stage_id
    try:
        return await opportunity.create_opportunity(db, opportunityObj)
    except UniqueViolationError as e:
        raise HTTPException(status_code=409, detail="Opportunity linked to specified Lead ID already exists.")

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

async def get_total_opportunity_value(db: Database, active_only:bool = False, won: bool = None, with_count: bool = False):
    if active_only:
        total = await opportunity.get_total_opportunity_value(db, not_pipeline_stage_id=[5, 6])
        if with_count:
            count = await opportunity.get_opportunities(db, with_count, not_pipeline_stage_id=[5, 6])
            return {"total":total, "count":count}
        else:
            return total
        
    elif won == True:
        total = await opportunity.get_total_opportunity_value(db, pipeline_stage_id=5)
        if with_count:
            count = await opportunity.get_opportunities(db, with_count, pipeline_stage_id=5)
            return {"total":total, "count":count}
        else:
            return total
    elif won == False:
        total = await opportunity.get_total_opportunity_value(db, pipeline_stage_id=6)
        if with_count:
            count = await opportunity.get_opportunities(db, pipeline_stage_id=6)
            return {"total":total, "count":count}
        else:
            return total
    else:
        total = await opportunity.get_total_opportunity_value(db)
        if with_count:
            count = await opportunity.get_opportunities(db, with_count=True)
            return {"total":total, "count":count}
        else:
            return total

async def get_opportunities_grouped(db: Database, group_by="id", count: bool = False):
    return await opportunity.get_opportunities_grouped(db, group_by, count)

async def get_deals_by_month(db: Database, month: int = None, count: bool = False):
    if month:
        result = await opportunity.get_opportunities_by_month(db, month, count)
        mstr = month_name[month]
        if count:
            return result
        else:
            return {"month":mstr, "int_month":month, "deals": result}
    else:
        result = await opportunity.get_opportunities_by_month_all(db, count)
        return result

async def get_deals_by_stage(db: Database, stage: int = None, count: bool = False):
    if stage:
        result = await opportunity.get_opportunities_by_stage(db, stage, count)
        if count:
            return result
        else:
            return {"stage":mstr, "int_stage":stage, "deals": result}
    else:
        result = await opportunity.get_opportunities_by_stage_all(db, count)
        return result

    