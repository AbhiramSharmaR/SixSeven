from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth_routes, analysis_routes, results_routes
from app.config import settings

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
    allow_origins=origins,
    allow_credentials=True,
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
