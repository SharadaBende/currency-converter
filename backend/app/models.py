from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

class ConversionHistory(Base):
    __tablename__ = "conversions"

    id = Column(Integer, primary_key=True, index=True)
    from_currency = Column(String, nullable=False)
    to_currency = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    converted_amount = Column(Float, nullable=False)
    rate = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)