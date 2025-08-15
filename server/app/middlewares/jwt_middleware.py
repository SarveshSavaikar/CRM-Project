# middlewares/jwt_middleware.py

from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import jwt

SECRET_KEY = "awkef20392@" 
ALGORITHM = "HS256"  

class JWTMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # here i am skipping this path for the middleware currently 
        if (
            request.url.path.startswith("/auth") or
    request.url.path.startswith("/docs") or
    request.url.path.startswith("/openapi.json") or
    request.url.path.startswith("/redoc")
        ):
            return await call_next(request)

        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JSONResponse(status_code=401, content={"detail": "Missing or invalid token"})

        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            request.state.user = payload  # payload is stored here and can be used outside where ever reuired 
        except jwt.ExpiredSignatureError:
            return JSONResponse(status_code=401, content={"detail": "Token expired"})
        except jwt.InvalidTokenError:
            return JSONResponse(status_code=401, content={"detail": "Invalid token"})

        return await call_next(request)
