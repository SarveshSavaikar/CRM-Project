from app.schemas.task import TaskCreate, TaskUpdate
from sqlalchemy import Table, Column, Integer, String, MetaData, and_, select, insert, update
from databases import Database
from sqlalchemy.exc import IntegrityError
from app.database.models import Task
from typing import Any

# Get task by ID
async def get_task_by_id(db: Database, task_id: int):
    query = select(Task).where(Task.c.id == task_id)
    return await db.fetch_one(query)

async def get_tasks(db: Database, **filters: dict[str, Any]) -> list[dict[str, Any]]:
    query = select(Task)
    conditions = []

    for attr, value in filters.items():
        if value is None:
            continue
        if attr == "due_date__lt":
            print(value)
            conditions.append(Task.c.due_date <= value)
        elif attr == "due_date__gt":
            conditions.append(Task.c.due_date >= value)
        elif hasattr(Task.c, attr):
            conditions.append(getattr(Task.c, attr) == value)

    if conditions:
        query = query.where(and_(*conditions))
    rows = await db.fetch_all(query)
    return [dict(row) for row in rows]
    


# Create task
async def create_task(db: Database, task_data: TaskCreate):
    query = (
        insert(Task)
        .values(
            title=task_data.title,
            description=task_data.description,
            due_date=task_data.due_date,
            status=task_data.status,
            priority=task_data.priority,
            user_id=task_data.user_id,
            opportunity_id=task_data.opportunity_id
        )
        .returning(Task)
    )

    try:
        return await db.fetch_one(query)
    except IntegrityError as e:
        raise e

# Update task
async def update_task(db: Database, task_id: int, update_data: dict):
    update_query = (
        Task
        .update()
        .where(Task.c.id == task_id)
        .values(**update_data)
        .returning(Task)
    )
    updated_task = await db.fetch_one(update_query)
    
    return updated_task

async def update_tasks_by_filters(db: Database, update_data: dict, **filters: dict[str, Any]):
    query = (
        Task
        .update()
        .values(**update_data)
        .returning(Task)
    )
    conditions = []

    for attr, value in filters.items():
        if hasattr(Task.c, attr):
            conditions.append(getattr(Task.c, attr) == value)

    if conditions:
        query = query.where(and_(*conditions))
    return [dict(row) for row in await db.fetch_all(query)]

async def delete_task(db: Database, task_id: int):
    query = (
        Task
        .delete()
        .where(Task.c.id == task_id)
        .returning(Task)
    )
    
    
    return await db.fetch_one(query)