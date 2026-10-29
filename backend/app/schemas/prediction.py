from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class PredictionCreate(BaseModel):
    subject: str | None = Field(default=None, max_length=255, description="Optional email subject line")
    email_text: str = Field(..., min_length=3, max_length=50000, description="Email body content to analyze")

class PredictionResponse(BaseModel):
    id: int
    subject: str | None = None
    email_text: str
    predicted_label: str
    confidence: float | None = None
    model_version: str
    created_at: datetime
    indicators: list[str] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)

class PredictionListResponse(BaseModel):
    items: list[PredictionResponse]
    total: int
    page: int
    size: int
    total_pages: int

class DeleteResult(BaseModel):
    message: str
    id: int | None = None
    deleted_count: int | None = None

