import json
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
# from sqlalchemy.orm import Session
from databases import Database
from app.database.connection import get_db
from app.schemas.lead import LeadCreate, LeadStageUpdate, LeadUpdate, LeadResponse
from app.services import lead_service
from datetime import date
import csv
import io
from fastapi.responses import StreamingResponse

router = APIRouter(prefix="/leads", tags=["Leads"])

@router.get("/", response_model=list[LeadResponse])
async def get_leads(
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
    return await lead_service.get_leads(db, source, status, min_score, team_id, user_id, team_name, user_name, created, last_updated, before)


@router.get("/lead-{lead_id}", response_model=LeadResponse)
async def get_lead(lead_id: int, db: Database = Depends(get_db)):
    return await lead_service.get_lead(db, lead_id)


@router.post("/create-lead", response_model=LeadResponse)
async def create_lead(lead: LeadCreate, db: Database = Depends(get_db)):
    return await lead_service.create_lead(db, lead)

@router.put("/lead-{lead_id}", response_model=LeadUpdate)
async def update_lead(lead_id: int, lead: LeadUpdate, db: Database = Depends(get_db)):    
    return await lead_service.update_lead(db, lead_id, lead)

@router.delete("/{lead_id}", response_model=LeadResponse)
async def delete_lead(lead_id: int, db: Database = Depends(get_db)):
    return await lead_service.delete_lead(db, lead_id)

@router.post("leads/import", response_model=list[LeadResponse])
async def import_leads_from_csv(leadCSV: UploadFile = File(...), db: Database = Depends(get_db)):
    if not leadCSV.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Invalid file type! Only CSV files accepted.")

    expected_headers = ["name", "email", "phone", "source", "status", "score", "team_id", "user_id"]

    content = await leadCSV.read()
    text = content.decode('utf-8')
    file_io = io.StringIO(text)

    first_line = file_io.readline().strip().split(",")

    file_io.seek(0)

    if set(first_line) == set(expected_headers):
        reader = csv.DictReader(file_io)
    else:
        reader = csv.DictReader(file_io, fieldnames=expected_headers)

    leads = [LeadCreate(**row) for row in reader]

    return await lead_service.create_leads_from_list(db, leads)

@router.patch("/{lead_id}/stage")
async def update_lead_stage(lead_id: int, update: LeadStageUpdate, db: Database = Depends(get_db)):
    result = await lead_service.update_lead_stage(db, lead_id, update)
    return json.dumps({"lead_id": lead_id, "stage": result.pipeline_stage_id})

@router.get("/export/csv")
async def export_leads_to_csv(db: Database = Depends(get_db)):
    leads = await lead_service.get_leads(db)

    output = io.StringIO()
    writer = csv.writer(output)

    headers = ["id", "name", "email", "phone", "source", "status", "score", "team_id", "user_id", "created_at", "updated_at"]
    writer.writerow(headers)

    for lead in leads:
        writer.writerow([
            lead["id"], lead["name"], lead["email"], lead["phone"], lead["source"],
            lead["status"], lead["score"], lead["team_id"], lead["user_id"],
            lead["created_at"], lead["updated_at"]
        ])

    output.seek(0)
    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=leads_export.csv"}
    )