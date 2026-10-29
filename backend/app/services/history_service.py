import logging
import math
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status
from backend.app.models.prediction import Prediction
from backend.app.models.activity_log import ActivityLog
from backend.app.ml.predict import extract_threat_indicators

logger = logging.getLogger("MailGuardHistoryService")

def get_predictions(
    db: Session,
    page: int = 1,
    size: int = 10,
    search: str | None = None,
    label: str | None = None,
    sort_order: str = "desc"
) -> dict:
    """
    Retrieves paginated, filtered, and sorted prediction records.
    """
    query = db.query(Prediction)

    if label and label.upper() in ["SPAM", "NOT_SPAM"]:
        query = query.filter(Prediction.predicted_label == label.upper())

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            (Prediction.subject.ilike(term)) | (Prediction.email_text.ilike(term))
        )

    total = query.count()
    total_pages = math.ceil(total / size) if total > 0 else 1

    if sort_order.lower() == "asc":
        query = query.order_by(Prediction.created_at.asc())
    else:
        query = query.order_by(Prediction.created_at.desc())

    offset = (page - 1) * size
    items = query.offset(offset).limit(size).all()

    # Populate indicators dynamically
    for item in items:
        item.indicators = extract_threat_indicators(item.email_text)

    return {
        "items": items,
        "total": total,
        "page": page,
        "size": size,
        "total_pages": total_pages,
    }

def get_prediction_by_id(db: Session, prediction_id: int) -> Prediction:
    item = db.query(Prediction).filter(Prediction.id == prediction_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Prediction with ID {prediction_id} not found."
        )
    item.indicators = extract_threat_indicators(item.email_text)
    return item

def delete_prediction_by_id(db: Session, prediction_id: int) -> dict:
    item = db.query(Prediction).filter(Prediction.id == prediction_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Prediction with ID {prediction_id} not found."
        )
    db.delete(item)
    
    log = ActivityLog(
        event_type="RECORD_DELETED",
        description=f"Prediction record ID {prediction_id} was deleted."
    )
    db.add(log)
    db.commit()

    return {"message": f"Prediction {prediction_id} deleted successfully.", "id": prediction_id}

def clear_all_predictions(db: Session) -> dict:
    count = db.query(Prediction).delete()
    log = ActivityLog(
        event_type="HISTORY_CLEARED",
        description=f"Cleared all prediction history ({count} records deleted)."
    )
    db.add(log)
    db.commit()
    return {"message": "All prediction history cleared successfully.", "deleted_count": count}

