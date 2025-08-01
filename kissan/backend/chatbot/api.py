from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)

# Allow all origins (safe for public APIs without sensitive data)
CORS(app)

# ✅ Gemini API Key (secure via env vars in production!)
GEMINI_API_KEY = "AIzaSyCGS72o8teyhpXI1e5dZFIF-ckSvI1fssg"
genai.configure(api_key=GEMINI_API_KEY)

SYSTEM_PROMPT = """You are KrishiBot, an AI assistant specialized in Indian agriculture. 
Provide accurate, practical advice on:
- Crop selection and rotation
- Soil management
- Pest control
- Weather impact
- Government schemes
- Organic farming
- Irrigation techniques
- Market prices

For non-agricultural queries, politely redirect to agricultural topics.
Give responses in simple English or Hindi as appropriate."""

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get("message", "").strip()
    
    if not user_message:
        return jsonify({"response": "Please ask a question about farming"})

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        chat_session = model.start_chat(history=[
            {
                "role": "user",
                "parts": [SYSTEM_PROMPT]
            },
            {
                "role": "model",
                "parts": ["Understood! I'm ready to assist with all agricultural queries."]
            }
        ])
        
        response = chat_session.send_message(user_message)
        reply = response.text
        return jsonify({"response": reply})

    except Exception as e:
        return jsonify({"response": f"Sorry, I encountered an error: {str(e)}"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
