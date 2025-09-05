from fastapi import HTTPException
from app.crud import task
from app.schemas.task import TaskCreate, TaskUpdate
from datetime import date, datetime, time
from databases import Database
from typing import Any, Optional
from datetime import date

async def get_task(db: Database, task_id: int):
    result = await task.get_task_by_id(db, task_id)
    
    if not result:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return result


async def get_tasks(
    db: Database,
    title: Optional[str] = None,
    due_date: Optional[datetime] = None,
    status: Optional[str] = None,
    priority: Optional[float] = None,
    user_id: Optional[int] = None,
    opportunity_id: Optional[int] = None,
    before: Optional[bool] = True,
    count:bool = False
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
    if title is not None:
        filters["title"] = title
    elif before is False and due_date is not None:
        filters["due_date__gt"] = datetime.combine(due_date, time.max)

    result =  await task.get_tasks(db, count, **filters)
    
    if(result == None):
        return { "detail" : "No Task Found"}
    print(f"Result:", result)
    return result

async def update_task(db: Database, task_id: int = None, taskObj: TaskUpdate = None, **filters: dict[str, Any]):
    if task_id is not None:
        result = await task.get_task_by_id(db, task_id)
        if result is None:
            raise HTTPException(status_code=404, detail="Task not found")

    update_data = taskObj.model_dump(exclude_unset=True)
    
    print("Update data:- ",taskObj)
    if task_id is not None:
        print("Updating the task")
        return await task.update_task(db, task_id, update_data)
    else:
        return await task.update_tasks_by_filters(db, update_data, **filters)
    
async def create_task(db: Database, taskObj: TaskCreate):
    taskObj.user_id = None if taskObj.user_id==0 else taskObj.user_id
    taskObj.opportunity_id = None if taskObj.opportunity_id==0 else taskObj.opportunity_id
    return await task.create_task(db, taskObj)

async def delete_task(db: Database, task_id: int):
    result = await task.delete_task(db, task_id)
    if not result:
        raise HTTPException(status_code=404, detail=f"Task(id:{task_id}) not found. Failed to delete.")
    return result   