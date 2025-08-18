from fastapi import APIRouter, Depends
from databases import Database
from app.database.connection import get_db
from app.schemas.team import TeamCreate, TeamUpdate, TeamResponse
from app.services import team_service
from datetime import date

router = APIRouter(prefix="/teams", tags=["Teams"])

@router.get("/", response_model=list[TeamResponse])
async def get_teams(name: str = None, db: Database = Depends(get_db)):
    return await team_service.get_teams(db, name)


@router.get("/team-{team_id}", response_model=TeamResponse)
async def get_team(team_id: int, db: Database = Depends(get_db)):
    return await team_service.get_team(db, team_id)


@router.post("/create-team", response_model=TeamResponse)
async def create_team(team: TeamCreate, db: Database = Depends(get_db)):
    return await team_service.create_team(db, team)

@router.put("/team-{team_id}", response_model=TeamResponse)
async def update_team(team_id: int, team: TeamUpdate, db: Database = Depends(get_db)):    
    return await team_service.update_team(db, team_id, team)

@router.delete("/{team_id}")
async def delete_team(team_id: int, db: Database = Depends(get_db)):
    return await team_service.delete_team(db, team_id)

