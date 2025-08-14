from warnings import filters
from app.schemas.team import TeamCreate, TeamUpdate
from sqlalchemy import Table, Column, Integer, String, MetaData, and_, select, insert, update
from databases import Database
from sqlalchemy.exc import IntegrityError
from app.database.models import Team
from typing import Any

# Get team by ID
async def get_team_by_id(db: Database, team_id: int):
    query = select(Team).where(Team.c.id == team_id)
    return await db.fetch_one(query)

async def get_teams_by_name(db: Database, name: str) -> list[dict[str, Any]]:
    query = select(Team).where(Team.c.name == name)
    
    rows = await db.fetch_all(query)
    
    return [dict(row) for row in rows]

async def get_teams(db: Database) -> list[dict[str, Any]]:
    query = select(Team)

    rows = await db.fetch_all(query)
    return [dict(row) for row in rows]


# Create team
async def create_team(db: Database, team_data: TeamCreate):
    query = (
        insert(Team)
        .values(
            name=team_data.name,
            description=team_data.description
        )
        .returning(Team)
    )

    try:
        return await db.fetch_one(query)
    except IntegrityError as e:
        raise e

# Update team
async def update_team(db: Database, team_id: int, update_data: dict):
    update_query = (
        Team
        .update()
        .where(Team.c.id == team_id)
        .values(**update_data)
        .returning(Team)
    )
    updated_team = await db.execute(update_query)

    return updated_team