from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import query, image

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(query.router)
app.include_router(image.router)

@app.get("/")
def home():
    return "Welcome to the chatbot!"
