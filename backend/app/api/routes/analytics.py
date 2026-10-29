from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.schemas.analytics import (
    AnalyticsOverviewResponse,
    OverviewStats,
    TrendItem,
    DistributionItem,
)
from backend.app.services.analytics_service import (
    get_full_analytics,
    get_overview_statistics,
    get_prediction_trends,
    get_class_distribution,
)

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/overview", response_model=AnalyticsOverviewResponse)
def get_analytics_overview(db: Session = Depends(get_db)):
    """
    Returns dashboard KPI overview, trend history, and distribution statistics.
    """
    return get_full_analytics(db=db)

@router.get("/stats", response_model=OverviewStats)
def get_stats(db: Session = Depends(get_db)):
    """
    Returns top-level metric counters.
    """
    return get_overview_statistics(db=db)

@router.get("/trends", response_model=list[TrendItem])
def get_trends(
    days: int = Query(default=7, ge=1, le=90, description="Number of days for trend history"),
    db: Session = Depends(get_db),
):
    """
    Returns daily classification counts.
    """
    return get_prediction_trends(db=db, days=days)

@router.get("/distribution", response_model=list[DistributionItem])
def get_distribution(db: Session = Depends(get_db)):
    """
    Returns spam vs legitimate distribution.
    """
    return get_class_distribution(db=db)
