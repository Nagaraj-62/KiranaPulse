# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .database import engine
from .routes import router

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Grocery Tracker API")

# Add CORS middleware so frontend can access backend
origins = [
    "http://localhost:3000",  # React dev server origin
    "https://kiranapulse.netlify.app",  # Production frontend origin
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # allow only this origin
    allow_credentials=True,
    allow_methods=["*"],          # allow all HTTP methods
    allow_headers=["*"],          # allow all headers
)

app.include_router(router)
