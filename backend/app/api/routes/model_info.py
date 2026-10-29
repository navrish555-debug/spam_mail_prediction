from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.models.model_metadata import ModelMetadata
from backend.app.schemas.model_info import ModelInfoResponse, ModelMetricsResponse
from backend.app.ml.evaluate import get_evaluation_metrics

router = APIRouter(prefix="/model", tags=["Model Information"])

@router.get("/info", response_model=ModelInfoResponse)
def get_model_info(db: Session = Depends(get_db)):
    """
    Returns metadata about the active ML model from SQLite.
    """
    meta = db.query(ModelMetadata).filter(ModelMetadata.is_active == True).order_by(ModelMetadata.id.desc()).first()
    if not meta:
        # Fall back to evaluation metadata if db has not recorded it yet
        eval_data = get_evaluation_metrics()
        return ModelInfoResponse(
            model_version=eval_data["model_version"],
            algorithm=eval_data["algorithm"],
            dataset_name=eval_data["dataset_name"],
            trained_at=eval_data["trained_at"] or "N/A",
            accuracy=eval_data["accuracy"],
            precision=eval_data["precision"],
            recall=eval_data["recall"],
            f1_score=eval_data["f1_score"],
            is_active=True
        )

    return ModelInfoResponse(
        model_version=meta.model_version,
        algorithm=meta.algorithm,
        dataset_name=meta.dataset_name,
        trained_at=meta.trained_at,
        accuracy=meta.accuracy,
        precision=meta.precision,
        recall=meta.recall,
        f1_score=meta.f1_score,
        is_active=meta.is_active
    )

@router.get("/metrics", response_model=ModelMetricsResponse)
def get_model_evaluation_metrics():
    """
    Returns authentic evaluation metrics, confusion matrix, and classification report.
    """
    try:
        metrics = get_evaluation_metrics()
        return ModelMetricsResponse(**metrics)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unable to read model metrics: {str(e)}"
        )
