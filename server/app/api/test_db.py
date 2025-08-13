from fastapi import APIRouter, Depends
from app.database.connection import database

router = APIRouter()

@router.get("/test-db")
async def test_db_connection():
    try:
        # Simple query
        query = "SELECT 1"
        result = await database.fetch_one(query=query)
        return {"status": "success", "result": result}
    except Exception as e:
        return {"status": "error", "details": str(e)}
