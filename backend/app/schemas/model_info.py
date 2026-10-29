from datetime import datetime
from pydantic import BaseModel

class ModelInfoResponse(BaseModel):
    model_version: str
    algorithm: str
    dataset_name: str
    trained_at: datetime | str
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    is_active: bool

class ModelMetricsResponse(BaseModel):
    model_version: str
    algorithm: str
    dataset_name: str
    trained_at: datetime | str | None = None
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    confusion_matrix: list[list[int]]
    classification_report: dict
    train_samples: int
    test_samples: int

