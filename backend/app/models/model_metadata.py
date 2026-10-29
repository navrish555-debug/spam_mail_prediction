from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from backend.app.db.base import Base

def utc_now():
    return datetime.now(timezone.utc)

class ModelMetadata(Base):
    __tablename__ = "model_metadata"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    model_version = Column(String(50), unique=True, nullable=False)
    algorithm = Column(String(100), nullable=False)
    dataset_name = Column(String(100), nullable=False)
    trained_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    accuracy = Column(Float, nullable=False)
    precision = Column(Float, nullable=False)
    recall = Column(Float, nullable=False)
    f1_score = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

