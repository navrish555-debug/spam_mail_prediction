from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.db.base import Base

def utc_now():
    return datetime.now(timezone.utc)

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    subject = Column(String(255), nullable=True)
    email_text = Column(Text, nullable=False)
    predicted_label = Column(String(20), nullable=False, index=True) # SPAM or NOT_SPAM
    confidence = Column(Float, nullable=True)
    model_version = Column(String(50), nullable=False, default="v1.0")
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False, index=True)

    user = relationship("User", back_populates="predictions")
