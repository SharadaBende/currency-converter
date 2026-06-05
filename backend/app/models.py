from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from .database import Base

class ConversionHistory(Base):
    __tablename__ = "conversions"

    id = Column(Integer, primary_key=True, index=True)
    from_currency = Column(String, nullable=False)
    to_currency = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    converted_amount = Column(Float, nullable=False)
    rate = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)