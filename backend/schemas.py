from pydantic import BaseModel, ConfigDict
from typing import Optional, Any


class TransactionInput(BaseModel):

    model_config = ConfigDict(extra="allow")

    TransactionAmt: float

    transaction_hour: Optional[int] = None
    transaction_day: Optional[int] = None

    ProductCD: Optional[str] = None

    card1: Optional[float] = None
    card2: Optional[float] = None
    card3: Optional[float] = None
    card4: Optional[str] = None
    card5: Optional[float] = None
    card6: Optional[str] = None

    addr1: Optional[float] = None
    addr2: Optional[float] = None

    dist1: Optional[float] = None
    dist2: Optional[float] = None

    DeviceType: Optional[str] = None
    DeviceInfo: Optional[str] = None


class RiskFactor(BaseModel):
    feature: str
    value: Any
    impact: float


class PredictionResponse(BaseModel):
    risk_score: float
    risk_level: str
    top_risk_factors: list[RiskFactor]