# app/api/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.auth import Token, UserCreate, UserResponse
from app.services.auth_service import authenticate_user, create_user, create_access_token , check_user
from app.core.dependencies import get_current_user, require_roles
from datetime import timedelta
# from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

ACCESS_TOKEN_EXPIRE_MINUTES = 60  # 1 hour token validity

# ------------------------
# LOGIN
# ------------------------
@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Step 1: Authenticate user
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Step 2: Create Access Token
    access_token = create_access_token(
        data={"sub": user["email"], "role": user["role"]}
    )

    # Step 3: Return token in standard format
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
    # return{
    #     "ok":True
    # }


# ------------------------
# SIGNUP (Admin only)
# ------------------------
@router.post("/signup", response_model=Token)
async def signup(user: UserCreate):
    
    if await check_user(user.email) is False:
        new_user = await create_user(user)
        access_token = create_access_token(data={"sub": str(new_user["id"])})
        return {"access_token": access_token, "token_type": "bearer"}
    else:
        return{"status":"Failed","msg":"Already exists"}

# ------------------------
# CURRENT USER
# ------------------------
@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user


# ------------------------
# ADMIN TEST ROUTE
# ------------------------
@router.get("/admin-dashboard")
async def admin_dashboard(_: dict = Depends(require_roles("admin"))):
    return {"message": "Welcome, Admin! Only admins can see this."}


