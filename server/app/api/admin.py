from fastapi import APIRouter, Request

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)






# @router.get("/dashboard")
# async def admin_dashboard(request: Request):
#     user = request.state.user  




@router.get("/dashboard")
async def admin_dashboard(request: Request):
    user = request.state.user  

    if user["role"] != "admin": 
        return {"error": "You are not authorized"} 
    return {"message": f"Welcome {user['sub']}, you are an admin!"} 
