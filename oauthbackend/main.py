import os
from fastapi import FastAPI, Request, HTTPException
from starlette.responses import RedirectResponse, JSONResponse
from starlette.middleware.sessions import SessionMiddleware
from authlib.integrations.starlette_client import OAuth, OAuthError
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from fastapi import UploadFile, File

load_dotenv()

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key="add_any_string_here")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

oauth = OAuth()
oauth.register(
    name='google',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    client_kwargs={
        'scope': 'email openid profile',
    }
)

@app.get("/")
async def index(request: Request):
    user = request.session.get('user')
    if user:
        return RedirectResponse(url='/welcome')
    return JSONResponse({"message": "Not logged in"})

@app.get('/welcome')
async def welcome(request: Request):
    user = request.session.get('user')
    if not user:
        return RedirectResponse(url='/')
    return JSONResponse({"message": "Welcome", "user": user})

@app.get("/auth/login")
async def login(request: Request):
    redirect_uri = 'http://localhost:8000/auth'  # Ensure this matches your Google Console settings
    return await oauth.google.authorize_redirect(request, redirect_uri)

@app.get('/auth')
async def auth(request: Request):
    try:
        token = await oauth.google.authorize_access_token(request)
        user = token.get('userinfo')
    except OAuthError as e:
        return JSONResponse({"error": e.error}, status_code=400)
    if user:
        request.session['user'] = dict(user)
    return RedirectResponse(url='http://localhost:3000/dashboard')  # Redirect to the dashboard

@app.get('/logout')
async def logout(request: Request):
    request.session.pop('user', None)
    return RedirectResponse(url='/')

@app.post("/query/message")
async def handle_message(request: Request, payload: dict):
    user = request.session.get('user')
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    query = payload.get("query")
    # Process the query and get a response (dummy response here)
    response = {"response": "This is a response to your query: " + query}
    return JSONResponse(response)

@app.post("/query/upload-image")
async def handle_image_upload(request: Request, file: UploadFile = File(...)):
    user = request.session.get('user')
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    # Process the image (dummy response here)
    response = {"response": "Image received and processed"}
    return JSONResponse(response)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
