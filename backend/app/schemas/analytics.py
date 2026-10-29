from pydantic import BaseModel

class OverviewStats(BaseModel):
    total_emails: int
    spam_count: int
    not_spam_count: int
    spam_percentage: float
    avg_confidence: float

class TrendItem(BaseModel):
    date: str
    spam: int
    legitimate: int
    total: int

class DistributionItem(BaseModel):
    name: str
    value: int
    percentage: float
    color: str

class AnalyticsOverviewResponse(BaseModel):
    overview: OverviewStats
    trends: list[TrendItem]
    distribution: list[DistributionItem]

