from fastapi import FastAPI, Request, HTTPException
from starlette.responses import RedirectResponse, JSONResponse
from starlette.middleware.sessions import SessionMiddleware
from authlib.integrations.starlette_client import OAuth, OAuthError
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from .routers import query, auth
import os

load_dotenv()

app = FastAPI()

app.include_router(query.router)
app.include_router(auth.router)
# origins = ["*"]

SECRET_KEY = os.getenv('SECRET_KEY')


app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def index(request: Request):
    user = request.session.get('user')
    if user:
        return RedirectResponse(url='/welcome')
    return JSONResponse({"message": "Not logged in"})


@app.get("/")
def home():
    return "Welcome to the chatbot!"
