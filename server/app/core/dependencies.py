# deps.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.database.connection import database
from app.core.security import decode_token
from app.services.auth_service import decode_access_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")  # form login endpoint

# async def get_current_user(token: str = Depends(oauth2_scheme)):
#     payload = decode_token(token)
#     if not payload:
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

#     user_id = payload.get("sub")
#     if not user_id:
#         raise HTTPException(status_code=401, detail="Invalid token payload")

#     row = await database.fetch_one(
#         "SELECT id, name, email, role FROM users WHERE id = :id",
#         {"id": int(user_id)}
#     )
#     if not row:
#         raise HTTPException(status_code=401, detail="User not found")

#     return dict(row)

def require_roles(*allowed_roles: str):
    async def checker(user=Depends(get_current_user)):
        if user["role"] not in allowed_roles:
            raise HTTPException(status_code=403, detail="Forbidden")
        return user
    return checker


security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    row = await database.fetch_one(
        'SELECT id, name, email, role FROM "User" WHERE email = :id',
        {"id": user_id}
    )
    if not row:
        raise HTTPException(status_code=401, detail="User not found")

    return dict(row)
