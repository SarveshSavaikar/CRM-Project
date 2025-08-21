from fastapi import APIRouter, Depends
from databases import Database
from app.database.connection import get_db
from app.schemas.analytics import KPIMetricsResponse, EntityByAttributeResponse
from app.services import analytics_service, lead_service, customer_service, opportunity_service, task_service
from datetime import date, datetime

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/dashboard", response_model=KPIMetricsResponse)
async def get_kpi_metrics(db: Database = Depends(get_db)):
    return await analytics_service.get_kpi_metrics(db)

@router.get("/leads-by-source", response_model=EntityByAttributeResponse)
async def get_leads_by_source(db: Database = Depends(get_db)):
    return await analytics_service.get_leads_by_source(db)

@router.get("/deals-by-stage/count", response_model=EntityByAttributeResponse)
async def get_deals_count_by_stage(db: Database = Depends(get_db)):
    return await analytics_service.get_deals_by_stage(db, count=True)

# @router.get("/deals-by-stage/", response_model=EntityByAttributeResponse)
# async def get_deals_by_stage(db: Database = Depends(get_db)):
#     return await analytics_service.get_deals_by_stage(db, count=False)

@router.get("/leads/count")
async def get_leads_count(
    source: str = None,
    status: str = None, 
    min_score: float = None, 
    team_id: int = None, 
    user_id: int = None,
    team_name: str = None, 
    user_name: str = None,
    created: date = None, 
    last_updated: date = None, 
    before: bool = False, 
    db: Database = Depends(get_db)
):
    return await lead_service.get_leads(db, source, status, min_score, team_id, user_id, team_name, user_name, created, last_updated, before, count=True)

@router.get('/customers/count')
async def get_customer_count(
    description: str = None,
    industry: str = None, 
    lead_id: int = None, 
    created: date = None, 
    last_updated: date = None, 
    before: bool = True,
    db: Database = Depends(get_db)
):
    return await customer_service.get_customers(db, description, industry, lead_id, created, last_updated, before, count=True)

@router.get('/opportunity/count')
async def get_opportunity_count(
    close_date: date = None,
    created: date = None,
    min_value: float = None,
    max_value: float = None,
    lead_id: int = None,
    pipeline_stage_id: int = None,
    before: bool = True,
    db: Database = Depends(get_db)
):
    return await opportunity_service.get_opportunities(db, close_date, created, min_value, max_value, lead_id, pipeline_stage_id, before, count=True)

@router.get("/revenue")
async def get_revenue(with_count: bool = False, db: Database = Depends(get_db)):
    return await opportunity_service.get_total_opportunity_value(db, won=True, with_count=with_count)

@router.get("/tasks/count")
async def get_task_count(
    title: str = None,
    due_date: datetime = None,
    status: str = None,
    priority: str = None,
    user_id: int = None,
    opportunity_id: int = None,
    before: bool = True, 
    db: Database = Depends(get_db)
):
    return await task_service.get_tasks(db,title ,  due_date, status, priority, user_id, opportunity_id, before, count=True)

@router.get("/activities")
async def get_activity_stats(db: Database = Depends(get_db)):
    total_tasks = await get_task_count(db=db)
    pending_tasks = await get_task_count(status="Pending", db=db)
    in_progress_tasks = await get_task_count(status="In Progress", db=db)
    completed_tasks = await get_task_count(status="Completed", db=db)
    return {
        "total":total_tasks,
        "pending":pending_tasks,
        "in_progress":in_progress_tasks,
        "completed_tasks": completed_tasks
    }