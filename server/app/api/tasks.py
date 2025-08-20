from fastapi import APIRouter, Depends
from databases import Database
from app.database.connection import get_db
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.services import task_service
from datetime import date, datetime

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.post("/create-task", response_model=TaskResponse)
async def create_task(task: TaskCreate, db: Database = Depends(get_db)):
    return await task_service.create_task(db, task)

@router.get("/", response_model=list[TaskResponse])
async def get_task(
    due_date: date = None,
    status: str = None,
    priority: str = None,
    user_id: int = None,
    opportunity_id: int = None,
    before: bool = True, 
    db: Database = Depends(get_db)
):
    return await task_service.get_tasks(db, due_date, status, priority, user_id, opportunity_id, before)


@router.get("/task-{task_id}", response_model=TaskResponse)
async def get_task(task_id: int, db: Database = Depends(get_db)):
    return await task_service.get_task(db, task_id)


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(task_id: int, task: TaskUpdate, db: Database = Depends(get_db)):    
    return await task_service.update_task(db, task_id, task)  # service function to be implemented

@router.delete("/{task_id}", response_model=TaskResponse)
async def delete_task(task_id: int, db: Database = Depends(get_db)):
    return await task_service.delete_task(db, task_id)

