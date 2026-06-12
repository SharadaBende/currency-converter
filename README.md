# CurrencyX

A full-stack currency converter web app with authentication, multi-currency conversion, live rate trends, AI-powered market insights, and a personalized dashboard.

**Live App:** https://currency-converter-kappa-orcin.vercel.app
**Backend API:** https://currencyx-backend.onrender.com/docs

> Note: the backend is hosted on Render's free tier and may take 30-50 seconds to wake up after periods of inactivity.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router
- **Backend:** Python, FastAPI, SQLAlchemy, PostgreSQL (production) / SQLite (local)
- **Auth:** JWT access + refresh tokens, bcrypt password hashing
- **Deployment:** Render (backend), Vercel (frontend)

## Features

- JWT-based signup and login with bcrypt password hashing
- Silent auto-refresh of access tokens using long-lived refresh tokens
- Automatic logout with a session-expired notification when both tokens expire
- Currency converter supporting 150+ currencies with country flags
- Searchable currency dropdown across all pages
- Swap-currencies button and copy-result button
- Multi-currency converter — convert one amount into all currencies at once
- 7-day exchange rate trend chart
- Live rates dashboard with a searchable base currency selector
- Favorite currency pairs (saved locally)
- Per-user conversion history
- AI-powered market insights on the dashboard
- Dark mode
- Responsive design with bottom navigation on mobile

## Project Structure

```
currency-converter/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── database.py
│   │   └── auth.py
│   ├── requirements.txt
│   └── runtime.txt
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   └── utils/
    ├── vercel.json
    └── package.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Log in and receive access/refresh tokens |
| POST | `/api/auth/refresh` | Get a new access token |
| POST | `/api/auth/logout` | Revoke the refresh token |
| POST | `/api/convert` | Convert an amount between two currencies |
| POST | `/api/convert-multi` | Convert an amount into all currencies |
| GET | `/api/history` | Get the current user's conversion history |
| GET | `/api/insights` | Get AI-generated market insights |

## Running Locally

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate     # Windows
# source venv/bin/activate  # macOS/Linux

pip install -r requirements.txt
uvicorn app.main:app --reload
```

The backend runs at `http://localhost:8000`. API docs available at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

## Environment Variables

### backend/.env

```
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=30
ALLOWED_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your-gemini-key
DATABASE_URL=sqlite:///./currency.db
```

### frontend/.env

```
VITE_API_URL=http://localhost:8000
```

## Deployment Notes

- **Backend (Render):** Deployed as a Python web service. Root directory `backend`, build command `pip install -r requirements.txt`, start command `uvicorn app.main:app --host 0.0.0.0 --port $PORT`. Uses a hosted PostgreSQL database; CurrencyX tables live in a dedicated `currencyx` schema to avoid collisions with other projects sharing the same database.
- **Frontend (Vercel):** Deployed with root directory `frontend`, framework preset Vite. Includes a `vercel.json` rewrite rule so client-side routes (e.g. `/login`, `/dashboard`) work correctly on page refresh.
- Update `ALLOWED_ORIGIN` on the backend whenever the frontend's deployed URL changes, to avoid CORS errors.

## Important Notes

- `bcrypt` must be pinned to version `4.0.1` for compatibility with `passlib`.
- Dark mode uses Tailwind v4's `@variant dark`.
- Exchange rates are sourced from `https://open.er-api.com/v6/latest/{currency}`.
- If backend models change, delete `currency.db` locally and restart the server to regenerate the schema.
- The Gemini API key requires a Google account with available free quota.

## Roadmap

- [ ] Replace localStorage favorites with per-user persisted favorites
- [ ] Add unit tests for backend routes
- [ ] Custom domain for production deployment