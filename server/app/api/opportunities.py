import csv
import io
from fastapi import APIRouter, Depends
from databases import Database
from fastapi.responses import StreamingResponse
from app.database.connection import get_db
from app.schemas.opportunity import OpportunityCreate, OpportunityUpdate, OpportunityResponse
from app.services import opportunity_service
from datetime import date, datetime

router = APIRouter(prefix="/opportunities", tags=["Opportunities"])

@router.post("/create-opportunity", response_model=OpportunityResponse)
async def create_opportunity(opportunity: OpportunityCreate, db: Database = Depends(get_db)):
    return await opportunity_service.create_opportunity(db, opportunity)

@router.get("/", response_model=list[OpportunityResponse])
async def get_opportunity(
    close_date: date = None,
    created: date = None,
    min_value: float = None,
    max_value: float = None,
    lead_id: int = None,
    pipeline_stage_id: int = None,
    before: bool = True,
    db: Database = Depends(get_db)
):
    return await opportunity_service.get_opportunities(db, close_date, created, min_value, max_value, lead_id, pipeline_stage_id, before)


@router.get("/opportunity-{opportunity_id}", response_model=OpportunityResponse)
async def get_opportunity(opportunity_id: int, db: Database = Depends(get_db)):
    return await opportunity_service.get_opportunity(db, opportunity_id)


@router.put("/{opportunity_id}", response_model=OpportunityResponse)
async def update_opportunity(opportunity_id: int, opportunity: OpportunityUpdate, db: Database = Depends(get_db)):    
    return await opportunity_service.update_opportunity(db, opportunity_id, opportunity)  # service function to be implemented

@router.put("/{opportunity_id}", response_model=OpportunityResponse)
async def update_opportunity(opportunity_id: int, opportunity: OpportunityUpdate, db: Database = Depends(get_db)):    
    return await opportunity_service.update_opportunity(db, opportunity_id, opportunity)  # service function to be implemented

@router.delete("/{opportunity_id}", response_model=OpportunityResponse)
async def delete_opportunity(opportunity_id: int, db: Database = Depends(get_db)):
    return await opportunity_service.delete_opportunity(db, opportunity_id)

@router.get("/by-month")
async def get_deals_by_month_all(count: bool = False, db: Database = Depends(get_db)):
    return await opportunity_service.get_deals_by_month(db, count=count)

@router.get("/by-month/")
async def get_deals_by_month(month: int = datetime.now().month, count: bool = False, db: Database = Depends(get_db)):
    return await opportunity_service.get_deals_by_month(db, month, count)

@router.get("/by-stage")
async def get_deals_by_stage_all(count: bool = False, db: Database = Depends(get_db)):
    return await opportunity_service.get_deals_by_stage(db, count)

@router.get("/export/csv")
async def export_opportunities_to_csv(db: Database = Depends(get_db)):
    opportunities = await opportunity_service.get_opportunities(db)

    output = io.StringIO()
    writer = csv.writer(output)

    headers = [
        "id", "name", "value", "close_date", "created_at", "updated_at",
        "lead_id", "pipeline_stage_id"
    ]
    writer.writerow(headers)

    for opportunity in opportunities:
        writer.writerow([
            opportunity["id"], opportunity["name"], opportunity["value"], opportunity["close_date"],
            opportunity["created_at"],
            opportunity["lead_id"], opportunity["pipeline_stage_id"]
        ])

    output.seek(0)
    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=opportunities_export.csv"}
    )