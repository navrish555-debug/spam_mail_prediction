from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.app.core.config import settings
from backend.app.db.session import get_db
from backend.app.ml.predict import get_model

router = APIRouter(tags=["Health"])

@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    """
    Checks operational health of backend, database connectivity, and ML model availability.
    """
    db_ok = False
    try:
        db.execute(text("SELECT 1"))
        db_ok = True
    except Exception:
        db_ok = False

    model_loaded = False
    model_version = None
    try:
        model_data = get_model()
        model_loaded = True
        model_version = model_data.get("model_version")
    except Exception:
        model_loaded = False

    status_str = "healthy" if (db_ok and model_loaded) else "degraded"

    return {
        "status": status_str,
        "database_connected": db_ok,
        "model_loaded": model_loaded,
        "model_version": model_version,
        "app_version": settings.VERSION,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
