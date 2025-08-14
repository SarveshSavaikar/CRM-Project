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
    before: Optional[bool] = None
):
    filters = {}

    if due_date is not None:
        due_date = datetime.combine(due_date, time.max)
        print(due_date)
        filters["due_date"] = due_date
    if status is not None:
        filters["status"] = status
    if priority is not None:
        filters["priority"] = priority
    if user_id is not None:
        filters["user_id"] = user_id
    if opportunity_id is not None:
        filters["opportunity_id"] = opportunity_id
    if before is True and due_date is not None:
        filters["due_date__lt"] = due_date
    elif before is False and due_date is not None:
        filters["due_date__gt"] = due_date

    return await task.get_tasks(db, **filters)

async def update_task(db: Database, task_id: str, taskObj: TaskUpdate):
    result = await task.get_task_by_id(db, task_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Task not found")

    db_data = dict(result)

    update_data = taskObj.model_dump(exclude_unset=True)
    
    task.update_task(db, update_data)
    
async def create_task(db: Database, taskObj: TaskCreate):
    return await task.create_task(db, taskObj)
    