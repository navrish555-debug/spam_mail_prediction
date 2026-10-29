from fastapi import APIRouter
from backend.app.api.routes import auth, health, predictions, analytics, model_info

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(health.router)
api_router.include_router(predictions.router)
api_router.include_router(analytics.router)
api_router.include_router(model_info.router)
