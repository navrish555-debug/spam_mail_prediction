import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.app.core.config import settings
from backend.app.core.logging_config import setup_logging
from backend.app.db.init_db import init_db
from backend.app.ml.predict import get_model
from backend.app.api.router import api_router

setup_logging()
logger = logging.getLogger("MailGuardApp")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup sequence
    logger.info("Initializing MailGuard AI backend...")
    init_db()
    try:
        model_payload = get_model()
        logger.info(f"Loaded ML model: {model_payload.get('model_version')} ({model_payload.get('algorithm')})")
    except Exception as e:
        logger.warning(f"ML model artifact note: {e}")
    yield
    # Shutdown sequence
    logger.info("Shutting down MailGuard AI backend.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Email Spam Prediction & Threat Analysis Platform API",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router, prefix=settings.API_PREFIX)

@app.get("/", tags=["Root"])
def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "health": f"{settings.API_PREFIX}/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
