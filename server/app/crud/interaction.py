from app.schemas.interaction import InteractionCreate, InteractionUpdate
from sqlalchemy import Table, Column, Integer, String, MetaData, and_, select, insert, update
from databases import Database
from sqlalchemy.exc import IntegrityError
from app.database.models import Interaction
from typing import Any

# Get interaction by ID
async def get_interaction_by_id(db: Database, interaction_id: int):
    query = select(Interaction).where(Interaction.c.id == interaction_id)
    return await db.fetch_one(query)

async def get_interactions(db: Database, **filters: dict[str, Any]) -> list[dict[str, Any]]:
    query = select(Interaction)
    conditions = []

    for attr, value in filters.items():
        if value is None:
            continue
        if attr == "date__lt":
            conditions.append(Interaction.c.timestamp <= value)
        elif attr == "date__gt":
            conditions.append(Interaction.c.timestamp >= value)
        elif hasattr(Interaction.c, attr):
            conditions.append(getattr(Interaction.c, attr) == value)

    if conditions:
        query = query.where(and_(*conditions))
    rows = await db.fetch_all(query)
    return [dict(row) for row in rows]
    


# Create interaction
async def create_interaction(db: Database, interaction_data: InteractionCreate):
    query = (
        insert(Interaction)
        .values(
            type=interaction_data.type,
            content=interaction_data.content,
            timestamp=interaction_data.timestamp,
            is_automated=interaction_data.is_automated,
            lead_id=interaction_data.lead_id,
            customer_id=interaction_data.customer_id,
        )
        .returning(Interaction)
    )

    try:
        return await db.fetch_one(query)
    except IntegrityError as e:
        raise e

# Update interaction
async def update_interaction(db: Database, interaction_id: int, update_data: dict):
    update_query = (
        Interaction
        .update()
        .where(Interaction.c.id == interaction_id)
        .values(**update_data)
        .returning(Interaction)
    )
    updated_interaction = await db.fetch_one(update_query)

    return updated_interaction

async def delete_interaction(db: Database, interaction_id: int):
    query = (
        Interaction
        .delete()
        .where(Interaction.c.id == interaction_id)
    )
    
    
    return await db.execute(query)