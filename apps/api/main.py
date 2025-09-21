from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv
from app.auth.router import router as auth_router
from app.decks.router import router as decks_router
from app.flashcards.router import router as flashcards_router
from app.database import engine
from app.db_models import Base

# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Promptly API",
    description="FastAPI backend for Promptly application with PostgreSQL and Google OAuth",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "https://promptly-r1d6.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, tags=["auth"])
app.include_router(decks_router, tags=["decks"])
app.include_router(flashcards_router, tags=["flashcards"])

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
