from fastapi import FastAPI, Request, HTTPException
from starlette.responses import RedirectResponse, JSONResponse
from starlette.middleware.sessions import SessionMiddleware
from authlib.integrations.starlette_client import OAuth, OAuthError
from fastapi import APIRouter, status, HTTPException
import os

router = APIRouter(prefix="/auth")

CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")



oauth = OAuth()
oauth.register(
    name='google',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    client_kwargs={
        'scope': 'openid email profile',
    }
)


@router.get("/login")
async def login(request: Request):
    redirect_uri = 'http://localhost:8000/auth'  # Ensure this matches your Google Console settings
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get('')
async def auth(request: Request):
    try:
        token = await oauth.google.authorize_access_token(request)
        user = token.get('userinfo')
    except OAuthError as e:
        return JSONResponse({"error": e.error}, status_code=400)
    if user:
        request.session['user'] = dict(user)
    return RedirectResponse(url='http://localhost:3000/dashboard')  # Redirect to the dashboard

@router.get('/logout')
async def logout(request: Request):
    request.session.pop('user', None)
    return RedirectResponse(url='/')