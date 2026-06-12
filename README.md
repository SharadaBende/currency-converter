CurrencyX — Full Project Summary
Tech Stack

Frontend: React + Vite + Tailwind CSS + React Router
Backend: Python FastAPI + SQLAlchemy + SQLite
Auth: JWT access tokens + refresh tokens + bcrypt

Project Structure
currency-converter/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── database.py
│   │   └── auth.py
│   ├── .env
│   ├── .gitignore
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── BottomNav.jsx
    │   │   ├── ConverterForm.jsx
    │   │   ├── ConversionHistory.jsx
    │   │   ├── MultiConverter.jsx
    │   │   ├── RateChart.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── FavoritePairs.jsx
    │   │   ├── AIInsights.jsx
    │   │   ├── CurrencyDropdown.jsx
    │   │   ├── Login.jsx
    │   │   └── Signup.jsx
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── SignupPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── ConverterPage.jsx
    │   │   ├── MultiPage.jsx
    │   │   ├── FavoritesPage.jsx
    │   │   └── HistoryPage.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   └── utils/
    │       ├── flags.js
    │       └── currencies.js
    ├── .env
    ├── .gitignore
    └── package.json
Features

✅ JWT login & signup with bcrypt password hashing
✅ Refresh token system — 30 day, silent auto-refresh in background
✅ Auto logout when both tokens expire
✅ Show/hide password toggle on login and signup
✅ Confirm password field with validation on signup
✅ Currency converter with 150+ currencies and flags
✅ Searchable currency dropdown on all pages
✅ Swap currencies button
✅ Spinner animation on convert button
✅ Multi-currency converter — convert to all currencies at once
✅ 7-day rate trend chart (recharts)
✅ Live rates dashboard with searchable base currency selector
✅ Favorite currency pairs saved in localStorage
✅ Per-user conversion history
✅ AI market insights on dashboard (Gemini API — swap key to enable)
✅ Dark mode
✅ Mobile friendly with bottom navigation
✅ Multi-page app with React Router
✅ Environment variables for all secrets and URLs
✅ Secrets protected with .gitignore

Still To Add (next session)

📋 Copy result button on converter
🔔 Session expired toast notification
📄 README
🚀 Deploy backend on Render, frontend on Vercel

API Endpoints
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
POST /api/convert
POST /api/convert-multi
GET  /api/history
GET  /api/insights
Environment Variables
# backend/.env
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=30
ALLOWED_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your-gemini-key

# frontend/.env
VITE_API_URL=http://localhost:8000
How to Run
bash# Backend
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload

# Frontend
cd frontend
npm run dev
Important Notes

bcrypt must be version 4.0.1
Dark mode uses Tailwind v4 with @variant dark
Exchange rate API: https://open.er-api.com/v6/latest/{currency}
All axios calls pass token via localStorage.getItem("token")
Delete currency.db and restart after any model changes
Gemini API key needs a fresh Google account with free quota

