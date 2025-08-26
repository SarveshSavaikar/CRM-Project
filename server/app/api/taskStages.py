from fastapi import APIRouter, Depends
from databases import Database
from app.database.connection import get_db
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.services import task_service
from datetime import date, datetime
import json
router =APIRouter(prefix="/taskStages",tags=["Task Stages"])

@router.get("/")
def get_task_list():
    result = {}
    result['data'] = [
        {
            "id": 1,
            "title": "UNASSIGNED",
        },
        {
            "id": 2,
            "title": "TO DO",
        },
        {
            "id": 3,
            "title": "IN PROGRESS",
        },
        {
            "id": 4,
            "title": "WAITING / BLOCKED",
        },
        {
            "id": 5,
            "title":"REVIEW",
        },
        {
            "id": 6,
            "title":"COMPLETED",
        }
    ]
    result["total"] = 6
    
    json_string = json.dumps(result, indent=2)


    return result