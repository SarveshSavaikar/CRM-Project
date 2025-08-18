from fastapi import HTTPException
from app.crud import team
from app.schemas.team import TeamCreate, TeamUpdate
from datetime import date
from databases import Database


async def get_team(db: Database, team_id: int):
    result = await team.get_team_by_id(db, team_id)
    
    if not result:
        raise HTTPException(status_code=404, detail="Team not found")
    
    return result

from typing import Optional
from datetime import date

async def get_teams(db: Database, name: Optional[str] = None):
    if name:
        return await team.get_teams_by_name(db, name)
    else:
        return await team.get_teams(db)

async def update_team(db: Database, team_id: str, teamObj: TeamUpdate):
    result = await team.get_team_by_id(db, team_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Team not found")

    db_data = dict(result)

    update_data = teamObj.model_dump(exclude_unset=True)
    
    team.update_team(db, update_data)
    