from asyncpg import UniqueViolationError
from fastapi import HTTPException
from psycopg2 import IntegrityError
from app.crud import lead
from app.schemas.lead import LeadCreate, LeadStageUpdate, LeadUpdate
from datetime import date
from databases import Database
from app.schemas.opportunity import OpportunityUpdate
from . import opportunity_service


async def get_lead(db: Database, lead_id: int):
    result = await lead.get_lead_by_id(db, lead_id)
    
    if not result:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    return result

from typing import Any, Optional
from datetime import date

async def get_leads(
    db: Database,
    source: Optional[str] = None,
    status: Optional[str] = None,
    min_score: Optional[float] = None,
    team_id: Optional[int] = None,
    user_id: Optional[int] = None,
    team_name: Optional[str] = None,
    user_name: Optional[str] = None,
    created: Optional[date] = None,
    last_updated: Optional[date] = None,
    before: Optional[bool] = None,
    count:bool = False
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
    if team_name is not None:
        filters["team_name"] = team_name
    if user_name is not None:
        filters["user_name"] = user_name
    if created is not None:
        filters["created"] = created
    if last_updated is not None:
        filters["last_updated"] = last_updated
    if before is True and last_updated is not None:
        filters["last_updated__lt"] = last_updated
    elif before is False and last_updated is not None:
        filters["last_updated__gt"] = last_updated
    
    return await lead.get_leads(db, count, **filters)

async def create_lead(db: Database, leadObj: LeadCreate):
    leadObj.team_id = None if leadObj.team_id==0 else leadObj.team_id
    leadObj.user_id = None if leadObj.user_id==0 else leadObj.user_id
    return await lead.create_lead(db, leadObj)   

async def update_lead(db: Database, lead_id: int = None, leadObj: LeadUpdate = None, **filters: dict[str, Any]):
    status_values = ['active', 'inactive', 'converted', 'lost', 'archived', 'unassigned']
    if leadObj.status is not None:
        leadObj.status = leadObj.status.lower()
        if leadObj.status not in status_values:
            raise HTTPException(status_code=400, detail="Invalid status field value")
    update_data = leadObj.model_dump(exclude_unset=True)
    # if(leadObj.name.replace(" ","") != ""):
    #     update_data["name"] = leadObj.name
    # if(leadObj.email.replace(" ","") != ""):
    #     update_data["email"] = leadObj.email
    # if(leadObj.status.replace(" ","") != ""):
    #     update_data["status"] = leadObj.status
    # if(leadObj.source.replace(" ","") != ""):
    #     update_data["source"] = leadObj.source
    # if(leadObj.phone.replace(" ","") != ""):
    #     update_data["phone"] = leadObj.phone
    # if(leadObj.score != -1):
    #     update_data["score"] = leadObj.score
    # if(leadObj.team_id != 0):
    #     update_data["team_id"] = leadObj.team_id
    # if(leadObj.user_id != 0):
    #     update_data["user_id"] = leadObj.user_id

    
    if lead_id is not None:
        return await lead.update_lead(db, lead_id, update_data)
    else:
        return await lead.update_leads_by_filters(db, update_data, **filters)
    
async def delete_lead(db: Database, lead_id: int):
    result = await opportunity_service.update_opportunity(db, opportunityObj=OpportunityUpdate(lead_id=None), lead_id=lead_id)
    result = await lead.delete_lead(db, lead_id)
    if not result:
        raise HTTPException(status_code=404, detail=f"Lead(id:{lead_id}) not found. Failes to delete.")
    return result
    
async def create_leads_from_list(db: Database, leads: list[LeadCreate]):
    success_count = fail_count = 0
    failed_inserts = []
    successful_inserts = []
    total = len(leads)
    for l in leads:
        try:
            response = await lead.create_lead(db, l)
            success_count+=1
            successful_inserts.append(l)
        except UniqueViolationError as e:
            print("[lead_service(create_leads_from_list)]Unique Violation Error:")
            fail_count+=1
            failed_inserts.append(l)
            
    
    return successful_inserts
        
async def update_lead_stage(db: Database, lead_id: int, update: LeadStageUpdate):
    return await opportunity_service.update_opportunity_by_lead(db, lead_id, update)
    
async def get_leads_grouped(db, group_by="id"):
    return await lead.get_leads_grouped(db, group_by)