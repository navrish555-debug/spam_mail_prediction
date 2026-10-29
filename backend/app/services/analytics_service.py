import logging
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.app.models.prediction import Prediction
from backend.app.schemas.analytics import OverviewStats, TrendItem, DistributionItem, AnalyticsOverviewResponse

logger = logging.getLogger("MailGuardAnalyticsService")

def get_overview_statistics(db: Session) -> OverviewStats:
    """
    Computes genuine KPI statistics strictly from SQLite predictions table.
    """
    total = db.query(func.count(Prediction.id)).scalar() or 0
    spam_count = db.query(func.count(Prediction.id)).filter(Prediction.predicted_label == "SPAM").scalar() or 0
    not_spam_count = db.query(func.count(Prediction.id)).filter(Prediction.predicted_label == "NOT_SPAM").scalar() or 0
    
    spam_percentage = round((spam_count / total * 100), 2) if total > 0 else 0.0
    
    avg_conf = db.query(func.avg(Prediction.confidence)).scalar()
    avg_confidence = round(float(avg_conf), 4) if avg_conf is not None else 0.0

    return OverviewStats(
        total_emails=total,
        spam_count=spam_count,
        not_spam_count=not_spam_count,
        spam_percentage=spam_percentage,
        avg_confidence=avg_confidence
    )

def get_prediction_trends(db: Session, days: int = 7) -> list[TrendItem]:
    """
    Groups predictions by date over the past N days.
    """
    today = datetime.now(timezone.utc).date()
    start_date = today - timedelta(days=days - 1)

    # Fetch records within range
    records = db.query(
        func.date(Prediction.created_at).label("pred_date"),
        Prediction.predicted_label,
        func.count(Prediction.id).label("count")
    ).filter(
        func.date(Prediction.created_at) >= start_date
    ).group_by(
        func.date(Prediction.created_at),
        Prediction.predicted_label
    ).all()

    # Map records by date
    trend_map = {}
    for i in range(days):
        d_str = (start_date + timedelta(days=i)).strftime("%Y-%m-%d")
        trend_map[d_str] = {"spam": 0, "legitimate": 0}

    for row in records:
        d_str = str(row.pred_date)
        if d_str in trend_map:
            if row.predicted_label == "SPAM":
                trend_map[d_str]["spam"] = row.count
            else:
                trend_map[d_str]["legitimate"] = row.count

    result = []
    for d_str, counts in sorted(trend_map.items()):
        total = counts["spam"] + counts["legitimate"]
        result.append(TrendItem(
            date=d_str,
            spam=counts["spam"],
            legitimate=counts["legitimate"],
            total=total
        ))

    return result

def get_class_distribution(db: Session) -> list[DistributionItem]:
    """
    Returns distribution array for donut / pie charts.
    """
    total = db.query(func.count(Prediction.id)).scalar() or 0
    spam_count = db.query(func.count(Prediction.id)).filter(Prediction.predicted_label == "SPAM").scalar() or 0
    not_spam_count = db.query(func.count(Prediction.id)).filter(Prediction.predicted_label == "NOT_SPAM").scalar() or 0

    spam_pct = round((spam_count / total * 100), 1) if total > 0 else 0.0
    ham_pct = round((not_spam_count / total * 100), 1) if total > 0 else 0.0

    return [
        DistributionItem(name="Spam Threats", value=spam_count, percentage=spam_pct, color="#F87171"),
        DistributionItem(name="Legitimate", value=not_spam_count, percentage=ham_pct, color="#22C7A9"),
    ]

def get_full_analytics(db: Session) -> AnalyticsOverviewResponse:
    overview = get_overview_statistics(db)
    trends = get_prediction_trends(db)
    distribution = get_class_distribution(db)
    return AnalyticsOverviewResponse(
        overview=overview,
        trends=trends,
        distribution=distribution
    )
