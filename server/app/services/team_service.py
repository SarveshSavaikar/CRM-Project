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

async def create_team(db: Database, teamObj: TeamCreate):
    return await team.create_team(db, teamObj)   

async def update_team(db: Database, teamObj: TeamUpdate ,team_name: str = "", team_id: int = -1):
    
    result = None
    if(team_id != -1):
        result = await team.get_team_by_id(db, team_id)
        print(result)
    elif(team_name!=""):
        result = await team.get_teams_by_name(db, team_name)
        print("THe fetched record :- ",result)
    if result is None:
        raise HTTPException(status_code=404, detail="Team not found")

    update_data = teamObj.model_dump(exclude_unset=True)
    
    return await team.update_team(db, team_id=result[0]['id'], update_data=update_data )
    
async def delete_team(db: Database, team_id: int):
    return await team.delete_team(db, team_id)
    