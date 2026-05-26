# 💱 Currency Converter - Full Stack Web App

A simple yet powerful full-stack currency converter web application built using **Flask (Python)** for the backend and **HTML, CSS, JavaScript** for the frontend.  
It uses a real-time exchange rate API to convert currencies instantly.

---

## 🚀 Live Features

- 🌍 Real-time currency conversion
- 🔄 Supports 150+ world currencies
- 💻 Clean and simple UI
- ⚡ Fast API-based backend
- 🔗 Frontend–Backend integration using REST API
- ❌ Error handling for invalid inputs

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript (Fetch API)

### Backend
- Python
- Flask
- Flask-CORS
- Requests library

### API
- ExchangeRate API (live currency data)

---

## 📁 Project Structure

currency-converter/
│
├── backend/
│ ├── app.py
│ ├── requirements.txt
│
├── frontend/
│ ├── index.html
│ ├── style.css
│ ├── script.js
│
└── README.md



---

## ⚙️ How It Works

1. User enters:
   - From currency (e.g., USD)
   - To currency (e.g., INR)
   - Amount

2. Frontend sends request to backend:
```

GET /convert?from=USD&to=INR&amount=10

```

3. Backend:
- Fetches live exchange rates from API
- Calculates converted amount
- Sends response back to frontend

4. Frontend displays the result instantly.

---

## ▶️ How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/your-username/currency-converter.git

2. Backend Setup
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
python app.py

Backend runs at:
http://127.0.0.1:5000


3. Frontend Setup
Simply open:
frontend/index.html

OR run local server:

cd frontend
python -m http.server 5500

Then open:
http://localhost:5500


🌐 API Endpoint
Convert Currency
GET /convert
Parameters:
from → source currency (USD)
to → target currency (INR)
amount → value to convert
Example:
/convert?from=USD&to=INR&amount=10
Response:
{
  "from": "USD",
  "to": "INR",
  "amount": 10,
  "converted": 953.34
}


📌 Future Improvements
Dropdown auto-complete for currencies
Currency flags integration
Dark mode UI
Deployment on cloud (Render + Netlify)
Better UI animations

animations
👨‍💻 Author

Sharada Bende
Full Stack Developer (Learning Phase 🚀)

⭐ Show Your Support

If you like this project:

⭐ Star the repository
🍴 Fork it
📢 Share it


📜 License

This project is open-source and free to use for learning purposes.
