from fastapi import FastAPI # type: ignore
from fastapi.responses import JSONResponse
from crud import get_all_users, create_user
from server_utils import User
import json



app = FastAPI(
    title="CRM-API",
    version="1.0.0",
    description="API server for CRM Application"
)


@app.get("/api/users")
def get_users(role: str = None, team: str = None, status: str = None):
    users = get_all_users()
    for user in users:
        user.show()
    return users    

# params hanlding to be added
@app.get("/api/sign-up")
def sign_up():
    # user = User(name="Nathan Pinto", role="Sales Executive", department=12, email="nathan@email.com", phone="9191919191")
    result = json.loads(create_user(user))
    if result["success"]:
        print(result["message"])
        return JSONResponse(content=result, status_code=200)
    else:
        print(result["message"])
        return JSONResponse(content=result, status_code=409)
    