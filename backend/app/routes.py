from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from . import models, schemas
from .database import get_db
from .auth import hash_password, verify_password, create_access_token, create_refresh_token, verify_refresh_token, revoke_refresh_token, get_current_user
import httpx
import os
import json
import requests

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
router = APIRouter()

@router.post("/auth/signup", response_model=schemas.UserResponse)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(
        (models.User.username == user.username) | (models.User.email == user.email)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    new_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid username or password")
    access_token = create_access_token(data={"sub": user.username})
    refresh_token = create_refresh_token(user.id, db)
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

@router.post("/auth/refresh")
def refresh(request: schemas.RefreshRequest, db: Session = Depends(get_db)):
    user = verify_refresh_token(request.refresh_token, db)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/auth/logout")
def logout(request: schemas.RefreshRequest, db: Session = Depends(get_db)):
    revoke_refresh_token(request.refresh_token, db)
    return {"message": "Logged out successfully"}

@router.post("/convert", response_model=schemas.ConversionResponse)
async def convert_currency(request: schemas.ConversionRequest, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://open.er-api.com/v6/latest/{request.from_currency}",
            timeout=30.0
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
        rate=rate,
        user_id=current_user.id
    )
    db.add(conversion)
    db.commit()
    db.refresh(conversion)
    return conversion

@router.post("/convert-multi")
async def convert_multi(request: schemas.ConversionRequest, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://open.er-api.com/v6/latest/{request.from_currency}",
            timeout=30.0
        )
    data = response.json()
    if response.status_code != 200 or data.get("result") != "success":
        raise HTTPException(status_code=400, detail="Could not fetch exchange rates")
    return {"rates": data["rates"], "base": request.from_currency}

@router.get("/history", response_model=list[schemas.ConversionResponse])
def get_history(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.ConversionHistory).filter(
        models.ConversionHistory.user_id == current_user.id
    ).order_by(
        models.ConversionHistory.timestamp.desc()
    ).limit(10).all()

@router.get("/api/insights")
async def get_insights(current_user=Depends(get_current_user)):
    try:
        res = requests.get("https://open.er-api.com/v6/latest/USD")
        rates = res.json().get("rates", {})
        snippet = {k: rates[k] for k in ["EUR", "GBP", "JPY", "INR", "AUD", "CAD"] if k in rates}

        prompt = f"""You are a concise FX market analyst. Here are today's USD exchange rates:
{json.dumps(snippet, indent=2)}

Return ONLY a valid JSON object, no markdown, no extra text:
{{
  "insights": [
    "One sentence insight about a notable rate or trend.",
    "One sentence insight about another currency pair.",
    "One sentence broader market observation."
  ]
}}"""

        gemini_res = requests.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}",
            json={"contents": [{"parts": [{"text": prompt}]}]}
        )
        gemini_res.raise_for_status()

        raw = gemini_res.json()["candidates"][0]["content"]["parts"][0]["text"]
        clean = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        data = json.loads(clean)

        return data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))