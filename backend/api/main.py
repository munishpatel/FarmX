from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import ai_routes

app = FastAPI(title="FarmX API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(ai_routes.router, prefix="/api/ai", tags=["ai"]) 