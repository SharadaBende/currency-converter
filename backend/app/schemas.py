from pydantic import BaseModel
from datetime import datetime

class ConversionRequest(BaseModel):
    from_currency: str
    to_currency: str
    amount: float

class ConversionResponse(BaseModel):
    from_currency: str
    to_currency: str
    amount: float
    converted_amount: float
    rate: float
    timestamp: datetime

    class Config:
        from_attributes = True