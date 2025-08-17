from fastapi import HTTPException
from app.crud import task
from app.schemas.task import TaskCreate, TaskUpdate
from datetime import date, datetime, time
from databases import Database
from typing import Optional
from datetime import date

async def get_task(db: Database, task_id: int):
    return await task.get_task_by_id(db, task_id)


async def get_tasks(
    db: Database,
    due_date: Optional[datetime] = None,
    status: Optional[str] = None,
    priority: Optional[float] = None,
    user_id: Optional[int] = None,
    opportunity_id: Optional[int] = None,
    before: Optional[bool] = True
):
    filters = {}

    if status is not None:
        filters["status"] = status
    if priority is not None:
        filters["priority"] = priority
    if user_id is not None:
        filters["user_id"] = user_id
    if opportunity_id is not None:
        filters["opportunity_id"] = opportunity_id
    if before is True and due_date is not None:
        filters["due_date__lt"] = datetime.combine(due_date, time.max)
    elif before is False and due_date is not None:
        filters["due_date__gt"] = datetime.combine(due_date, time.max)

    return await task.get_tasks(db, **filters)

async def update_task(db: Database, task_id: str, taskObj: TaskUpdate):
    result = await task.get_task_by_id(db, task_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Task not found")

    update_data = taskObj.model_dump(exclude_unset=True)
    
    return await task.update_task(db, task_id, update_data)
    
async def create_task(db: Database, taskObj: TaskCreate):
    return await task.create_task(db, taskObj)

async def delete_task(db: Database, task_id: int):
    return await task.delete_task(db, task_id)