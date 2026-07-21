import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

API_KEY = os.getenv("EXCHANGE_API_KEY")


@app.route("/")
def home():
    return jsonify({"message": "Currency Converter Backend Running 🚀"})

@app.route("/convert", methods=["GET"])
def convert_currency():
    from_currency = request.args.get("from")
    to_currency = request.args.get("to")
    amount = float(request.args.get("amount"))

    url = f"https://v6.exchangerate-api.com/v6/{API_KEY}/latest/{from_currency}"

    response = requests.get(url)
    data = response.json()

    if data["result"] == "success":
        rate = data["conversion_rates"][to_currency]
        converted = rate * amount

        return jsonify({
            "from": from_currency,
            "to": to_currency,
            "amount": amount,
            "converted": round(converted, 2)
        })

    return jsonify({
        "error": "API failed",
        "details": data
    }), 400


if __name__ == "__main__":
    app.run()