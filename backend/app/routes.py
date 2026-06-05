from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas
from .database import get_db
import httpx

router = APIRouter()

@router.post("/convert", response_model=schemas.ConversionResponse)
async def convert_currency(request: schemas.ConversionRequest, db: Session = Depends(get_db)):
    async with httpx.AsyncClient() as client:
       response = await client.get(
    f"https://open.er-api.com/v6/latest/{request.from_currency}",
    timeout=10.0
)
    
    data = response.json()

    if response.status_code != 200 or data.get("result") != "success":
        raise HTTPException(status_code=400, detail="Could not fetch exchange rates")

    
    if request.to_currency not in data["rates"]:
        raise HTTPException(status_code=400, detail="Invalid currency code")
    
    rate = data["rates"][request.to_currency]
    converted_amount = request.amount * rate

    conversion = models.ConversionHistory(
        from_currency=request.from_currency,
        to_currency=request.to_currency,
        amount=request.amount,
        converted_amount=converted_amount,
        rate=rate
    )
    db.add(conversion)
    db.commit()
    db.refresh(conversion)

    return conversion

@router.get("/history", response_model=list[schemas.ConversionResponse])
def get_history(db: Session = Depends(get_db)):
    return db.query(models.ConversionHistory).order_by(
        models.ConversionHistory.timestamp.desc()
    ).limit(10).all()