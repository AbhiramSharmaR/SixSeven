from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth_routes, analysis_routes, results_routes
from app.config import settings
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import os
from fastapi.responses import FileResponse
app = FastAPI(
    title="PharmaGuard Backend",
    description="Backend API for PharmaGuard Pharmacogenomics Platform",
    version="1.0.0"
)

# CORS Middleware
origins = [
    "http://localhost:5173",  # Vite default
    "http://localhost:3000",
    "*"  # Allow all for development ease
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,# restrict later
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routes
app.include_router(auth_routes.router)
app.include_router(analysis_routes.router)
app.include_router(results_routes.router)

@app.get("/")
async def root():
    return {"message": "PharmaGuard API is running"}


frontend_path = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"

app.mount("/assets", StaticFiles(directory=frontend_path / "assets"), name="assets")

@app.get("/{full_path:path}")
async def catch_all(full_path: str):
    return FileResponse(frontend_path / "index.html")