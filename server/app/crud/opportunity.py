import calendar
from datetime import datetime
import json
from app.schemas.opportunity import OpportunityCreate, OpportunityUpdate
from sqlalchemy import Table, Column, Integer, String, MetaData, and_, func, select, insert, update
from databases import Database
from sqlalchemy.exc import IntegrityError
from app.database.models import Opportunity, PipelineStage
from typing import Any
from . import crud_utils

prefix_columns = crud_utils.prefix_columns
# Get opportunity by ID
async def get_opportunity_by_id(db: Database, opportunity_id: int):
    query = select(Opportunity).where(Opportunity.c.id == opportunity_id)
    return await db.fetch_one(query)

async def get_opportunities(db: Database, count=False, **filters: dict[str, Any]) -> list[dict[str, Any]]:
    query = select(func.count()) if count else select(Opportunity, PipelineStage.c.stage)
    if not count:
        query = query.select_from(
            Opportunity
            .join(PipelineStage, Opportunity.c.pipeline_stage_id == PipelineStage.c.id, isouter=True)
        )
    conditions = []

    for attr, value in filters.items():
        if value is None:
            continue
        if attr == "min_value":
            conditions.append(Opportunity.c.value >= value)
        if attr == "max_value":
            conditions.append(Opportunity.c.value <= value)
        if attr == "not_pipeline_stage_id":
            for pipeline_stage_id in value:
                conditions.append(Opportunity.c.pipeline_stage_id != pipeline_stage_id)
        if attr == "close_date__lt":
            conditions.append(Opportunity.c.close_date <= value)
        elif attr == "close_date__gt":
            conditions.append(Opportunity.c.close_date >= value)
        if attr == "created__lt":
            conditions.append(Opportunity.c.created_at <= value)
        elif attr == "created__gt":
            conditions.append(Opportunity.c.created_at >= value)
            
        elif hasattr(Opportunity.c, attr):
            conditions.append(getattr(Opportunity.c, attr) == value)

    if conditions:
        query = query.where(and_(*conditions))
        
    if count:
        result = await db.execute(query)
        return result
    else:
        rows = await db.fetch_all(query)
        return [dict(row) for row in rows]
    


# Create opportunity
async def create_opportunity(db: Database, opportunity_data: OpportunityCreate):
    query = (
        insert(Opportunity)
        .values(
            name=opportunity_data.name,
            value=opportunity_data.value,
            close_date=opportunity_data.close_date,
            created_at=opportunity_data.created_at,
            lead_id=opportunity_data.lead_id,
            pipeline_stage_id=opportunity_data.pipeline_stage_id
        )
        .returning(Opportunity)
    )

    try:
        return await db.fetch_one(query)
    except IntegrityError as e:
        raise e

# Update opportunity
async def update_opportunity(db: Database, opportunity_id: int, update_data: dict):
    update_query = (
        Opportunity
        .update()
        .where(Opportunity.c.id == opportunity_id)
        .values(**update_data)
        .returning(Opportunity)
    )
    updated_opportunity = await db.fetch_one(update_query)

    return updated_opportunity

async def delete_opportunity(db: Database, opportunity_id: int):
    query = (
        Opportunity
        .delete()
        .where(Opportunity.c.id == opportunity_id)
        .returning(Opportunity)
    )
    
    
    return await db.fetch_one(query)

async def update_opportunity_by_lead_id(db: Database, lead_id: int, pipeline_stage_id: int):
    query = (
        Opportunity
        .update()
        .where(Opportunity.c.lead_id == lead_id)
        .values({Opportunity.c.pipeline_stage_id: pipeline_stage_id})
        .returning(Opportunity)
    )
    return await db.fetch_one(query)

async def update_opportunity_by_filters(db: Database, update_data: dict, **filters: dict[str, Any]):
    query = (
        Opportunity
        .update()
        .values(**update_data)
        .returning(Opportunity)
    )
    
    conditions = []
    for attr, val in filters.items():
        if hasattr(Opportunity.c, attr):
            conditions.append(getattr(Opportunity.c, attr) == val)
    
    if conditions:
        query = query.where(and_(*conditions))
        
    updated_opps = await db.fetch_all(query)
    
    return updated_opps

async def get_total_opportunity_value(db: Database, **filters):
    query = select(func.sum(Opportunity.c.value))
    conditions = []
    for attr, value in filters.items():
        if value is None:
            continue
        if attr == "min_value":
            conditions.append(Opportunity.c.value >= value)
        if attr == "max_value":
            conditions.append(Opportunity.c.value <= value)
        if attr == "not_pipeline_stage_id":
            for pipeline_stage_id in value:
                conditions.append(Opportunity.c.pipeline_stage_id != pipeline_stage_id)
        if attr == "close_date__lt":
            conditions.append(Opportunity.c.close_date <= value)
        elif attr == "close_date__gt":
            conditions.append(Opportunity.c.close_date >= value)
        if attr == "created__lt":
            conditions.append(Opportunity.c.created_at <= value)
        elif attr == "created__gt":
            conditions.append(Opportunity.c.created_at >= value)
            
        elif hasattr(Opportunity.c, attr):
            conditions.append(getattr(Opportunity.c, attr) == value)
        
    if conditions:
        query = query.where(and_(*conditions))
    return await db.execute(query)

async def get_opportunities_grouped(db: Database, group_by: str, count: bool):
    query = crud_utils.build_group_by_query(Opportunity, group_by, count)
    
    rows = await db.fetch_all(query)
    if count:
        rows = {f"{row[0]}":row[1] for row in rows}
    else:
        rows = {f"{row[0]}":json.loads(row[1]) for row in rows}
    print(rows)
    if group_by == "month":
        result = {}
        for key, value in rows.items():
            month = calendar.month_name[datetime.fromisoformat(key).month]
            result[month] = value
    return result
    
async def get_opportunities_by_month(db: Database, month: int, count: bool):
    query = select(func.count(Opportunity.c.id)) if count else select(Opportunity)
    
    query = query.where(and_(
        func.extract("month", Opportunity.c.created_at) == month,
        func.extract("year", Opportunity.c.created_at) == datetime.now().year
    ))
    
    if count:
        return await db.execute(query)
    
    rows = await db.fetch_all(query)
    return [dict(row) for row in rows]