from fastapi import APIRouter, Depends
from databases import Database
from app.database.connection import get_db
from app.schemas.analytics import KPIMetricsResponse, EntityByAttributeResponse
from app.services import analytics_service
from datetime import date, datetime

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/dashboard", response_model=KPIMetricsResponse)
async def get_kpi_metrics(db: Database = Depends(get_db)):
    return await analytics_service.get_kpi_metrics(db)

@router.get("/leads-by-source", response_model=EntityByAttributeResponse)
async def get_leads_by_source(db: Database = Depends(get_db)):
    return await analytics_service.get_leads_by_source(db)

@router.get("/deals-by-stage", response_model=EntityByAttributeResponse)
async def get_leads_by_source(db: Database = Depends(get_db)):
    return await analytics_service.get_deals_by_stage(db)