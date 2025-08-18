# app/api/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.auth import Token, UserCreate, UserResponse
from app.schemas.permissions import ROLES , PERMISSIONS
from app.services.auth_service import authenticate_user, create_user, check_user
from app.core.security import create_access_token
from app.core.dependencies import get_current_user, require_roles
from datetime import timedelta
from pydantic import BaseModel
# from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

ACCESS_TOKEN_EXPIRE_MINUTES = 60  # 1 hour token validity

# ------------------------
# LOGIN
# ------------------------
class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
async def login(data: LoginRequest):
    print("Trying to log in")
    user = await authenticate_user(data.username, data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    access_token = create_access_token(
        subject={"sub": user["email"], "role": user["role"]}
    )
    return {"access_token": access_token, "token_type": "bearer"}

# ------------------------
# SIGNUP (Admin only)
# ------------------------
@router.post("/signup", response_model=Token)
async def signup(user: UserCreate):
    
    if await check_user(user.email) is False:
        new_user = await create_user(user)
        access_token = create_access_token(subject={"sub": str(new_user["id"])})
        return {"access_token": access_token, "token_type": "bearer"}
    else:
        return{"status":"Failed","msg":"Already exists"}

# ------------------------
# CURRENT USER
# ------------------------
@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user

@router.get("/roles")
async def get_roles():
    return {"roles":ROLES}

@router.get("/permissions", response_model=str)
async def get_permissions(role : str):
    # permissions = PERMISSIONS.get(role)
    permissions =  { page: perm[role] for page , perm in PERMISSIONS.items()}
    if permissions is None:
        raise HTTPException(status_code=404, detail="Role Not Found")
    return f"Permissions for {role} : {permissions}"

# ------------------------
# ADMIN TEST ROUTE
# ------------------------
@router.get("/admin-dashboard")
async def admin_dashboard(_: dict = Depends(require_roles("admin"))):
    return {"message": "Welcome, Admin! Only admins can see this."}


@router.get("/view-dashboard")
async def Viewer_dashboard(_: dict = Depends(require_roles("viewer"))):
    return {"message": "Welcome, Viewer! Only admins can see this."}

