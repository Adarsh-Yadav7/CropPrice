from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import requests
from bs4 import BeautifulSoup
import pandas as pd
import re
import json
import numpy as np

app = Flask(__name__)
CORS(app)

# Gemini API setup
GEMINI_API_KEY = "AIzaSyCGS72o8teyhpXI1e5dZFIF-ckSvI1fssg" # <-- Replace with yours
genai.configure(api_key=GEMINI_API_KEY)

# Web scraping mock (actual AGMARKNET is hard to scrape live due to JavaScript)
def mock_crop_data(crop, location):
    # Generate 30 days of dates
    dates = pd.date_range(end="2025-07-31", periods=30).strftime("%Y-%m-%d")
    
    # Start price between 1800-2200
    base_price = np.random.randint(1800, 2200)

    # Simulate daily fluctuations between -100 to +100
    fluctuations = np.random.randint(-100, 100, size=30)

    # Create price series with some volatility
    prices = [base_price]
    for i in range(1, 30):
        new_price = prices[-1] + fluctuations[i]
        prices.append(max(1000, new_price))  # Ensure price doesn't go below 1000

    return pd.DataFrame({
        'Date': dates,
        'Price': prices
    })

@app.route('/market-trend', methods=['POST'])
def get_market_trend():
    try:
        data = request.json
        crop = data.get('crop', 'wheat')
        location = data.get('location', 'Madhya Pradesh')

        df = mock_crop_data(crop, location)
        trend_data = df.to_dict(orient='records')

        # Gemini Prompt
        prompt = f"""
You are an expert agricultural market analyst.

Below is the crop price data for **{crop}** in **{location}** for the past 10 days:
{df.to_string(index=False)}

Instructions:
- Write a **point-wise** summary of market trend (↑/↓/stable)
- Mention if prices are volatile or consistent
- Suggest possible reasons (weather, demand, harvesting)
- Give a brief prediction for next week
- Keep it short and informative
Use bullet points with emojis.
only 5 points Answer
"""

        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        insight = response.text.strip()

        return jsonify({
            "trend_data": trend_data,
            "insight": insight
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
