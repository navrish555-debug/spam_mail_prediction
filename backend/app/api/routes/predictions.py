from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.schemas.prediction import (
    PredictionCreate,
    PredictionResponse,
    PredictionListResponse,
    DeleteResult,
)
from backend.app.services.prediction_service import create_prediction
from backend.app.services.history_service import (
    get_predictions,
    get_prediction_by_id,
    delete_prediction_by_id,
    clear_all_predictions,
)
from backend.app.services.gemini_service import analyze_threat_with_gemini
from backend.app.core.dependencies import get_optional_current_user
from backend.app.models.user import User

router = APIRouter(prefix="/predictions", tags=["Predictions"])

@router.post("", response_model=PredictionResponse, status_code=status.HTTP_201_CREATED)
def predict_and_store_email(
    payload: PredictionCreate,
    db: Session = Depends(get_db),
    user: User | None = Depends(get_optional_current_user)
):
    """
    Classifies an email as SPAM or NOT_SPAM using the ML model, records it in SQLite, and returns details.
    """
    return create_prediction(db=db, payload=payload, user_id=user.id if user else None)

@router.get("", response_model=PredictionListResponse)
def list_prediction_history(
    page: int = Query(default=1, ge=1, description="Page number"),
    size: int = Query(default=10, ge=1, le=100, description="Page size"),
    search: str | None = Query(default=None, description="Search keyword in subject or body"),
    label: str | None = Query(default=None, description="Filter by SPAM or NOT_SPAM"),
    sort_order: str = Query(default="desc", pattern="^(asc|desc)$", description="Sort order by date"),
    db: Session = Depends(get_db),
):
    """
    Retrieves paginated and filtered prediction records.
    """
    return get_predictions(
        db=db, page=page, size=size, search=search, label=label, sort_order=sort_order
    )

@router.get("/{prediction_id}", response_model=PredictionResponse)
def get_prediction_detail(prediction_id: int, db: Session = Depends(get_db)):
    """
    Retrieves single prediction record by ID.
    """
    return get_prediction_by_id(db=db, prediction_id=prediction_id)

@router.delete("/{prediction_id}", response_model=DeleteResult)
def delete_prediction(prediction_id: int, db: Session = Depends(get_db)):
    """
    Deletes a single prediction record from the database.
    """
    return delete_prediction_by_id(db=db, prediction_id=prediction_id)

@router.delete("", response_model=DeleteResult)
def clear_history(db: Session = Depends(get_db)):
    """
    Clears all saved prediction records.
    """
    return clear_all_predictions(db=db)

@router.post("/{prediction_id}/gemini-explain")
def explain_with_gemini(prediction_id: int, db: Session = Depends(get_db)):
    """
    Generates an expert generative AI threat analysis using Google Gemini.
    """
    prediction = get_prediction_by_id(db=db, prediction_id=prediction_id)
    return analyze_threat_with_gemini(
        subject=prediction.subject,
        email_text=prediction.email_text,
        predicted_label=prediction.predicted_label
    )

