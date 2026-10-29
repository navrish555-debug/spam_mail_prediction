from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime
from backend.app.db.base import Base

def utc_now():
    return datetime.now(timezone.utc)

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    event_type = Column(String(50), nullable=False)
    description = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False, index=True)

