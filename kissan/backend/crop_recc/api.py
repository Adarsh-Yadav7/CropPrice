
import json
import re

app = Flask(__name__)
CORS(app)
from flask import Blueprint, request, jsonify
import google.generativeai as genai

chatbot_bp = Blueprint("crop_recc", __name__)  # ✅ This is correct

# Configure Gemini
GEMINI_API_KEY = "AIzaSyCGS72o8teyhpXI1e5dZFIF-ckSvI1fssg"  # Replace with your actual API key
genai.configure(api_key=GEMINI_API_KEY)

# Prompt Template
CROP_PROMPT = """You are an agricultural expert for Indian farming. Based on the following input:
Soil Type: {soil_type}
Location: {location}
Season: {season}
Water Availability: {water_availability}

Provide crop recommendations in this EXACT JSON format ONLY:

```json
{{
  "recommendations": [
    {{
      "crop": "Crop Name (English/Hindi)",
      "scientific_name": "Scientific Name",
      "planting_window": "Month-Month",
      "yield_range": "X-Y tons/hectare",
      "water_needs": "Low/Medium/High",
      "market_demand": "High/Medium/Low"
    }}
  ],
  "additional_tips": "Brief farming advice"
}}
```"""

@app.route('/recommend-crops', methods=['POST'])
def recommend_crops():
    try:
        data = request.json
        soil_type = data.get('soil_type', '').strip()
        location = data.get('location', '').strip()
        season = data.get('season', '').strip()
        water = data.get('water_availability', 'medium').strip().lower()

        if not all([soil_type, location, season]):
            return jsonify({"error": "Missing required fields"}), 400

        prompt = CROP_PROMPT.format(
            soil_type=soil_type,
            location=location,
            season=season,
            water_availability=water
        )

        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)

        # Extract JSON from response
        json_match = re.search(r'```json\n(.*?)\n```', response.text, re.DOTALL)

        if not json_match:
            return jsonify({
                "error": "Invalid response format from AI",
                "raw_response": response.text
            }), 500

        try:
            parsed_data = json.loads(json_match.group(1))
            if not isinstance(parsed_data, dict) or 'recommendations' not in parsed_data:
                raise ValueError("Invalid JSON structure")
            return jsonify(parsed_data)
        except (json.JSONDecodeError, ValueError) as e:
            return jsonify({
                "error": "Failed to parse AI response",
                "exception": str(e),
                "raw_response": response.text
            }), 500

    except Exception as e:
        return jsonify({
            "error": "Server error",
            "details": str(e)
        }), 500

# Main runner
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
