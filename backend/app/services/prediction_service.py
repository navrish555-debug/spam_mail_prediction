import logging
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from backend.app.models.prediction import Prediction
from backend.app.models.activity_log import ActivityLog
from backend.app.schemas.prediction import PredictionCreate
from backend.app.ml.predict import predict_email, extract_threat_indicators

logger = logging.getLogger("MailGuardPredictionService")

def create_prediction(db: Session, payload: PredictionCreate, user_id: int | None = None) -> Prediction:
    """
    Executes ML prediction on the email content, saves the result to SQLite,
    and records an activity log entry.
    """
    subject = (payload.subject or "").strip() or None
    email_text = payload.email_text.strip()

    if len(email_text) < 3:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Email body must contain at least 3 characters."
        )

    try:
        result = predict_email(subject=subject, email_text=email_text)
    except Exception as e:
        logger.error(f"ML inference error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference engine failure: {str(e)}"
        )

    prediction = Prediction(
        user_id=user_id,
        subject=subject,
        email_text=email_text,
        predicted_label=result["predicted_label"],
        confidence=result["confidence"],
        model_version=result["model_version"]
    )
    
    try:
        db.add(prediction)
        db.commit()
        db.refresh(prediction)

        # Log prediction activity
        log = ActivityLog(
            event_type="EMAIL_ANALYZED",
            description=f"Email ID {prediction.id} analyzed -> {prediction.predicted_label}"
        )
        db.add(log)
        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Database error while saving prediction: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to persist prediction record."
        )

    # Attach dynamic indicators
    prediction.indicators = result.get("indicators", [])
    return prediction

