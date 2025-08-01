from flask import Blueprint, request, jsonify
import google.generativeai as genai

chatbot_bp = Blueprint("chatbot", __name__)  # ✅ This is correct

# ✅ Gemini API Key (secure via env vars in production!)
GEMINI_API_KEY = "AIzaSyCGS72o8teyhpXI1e5dZFIF-ckSvI1fssg"
genai.configure(api_key=GEMINI_API_KEY)

SYSTEM_PROMPT = SYSTEM_PROMPT = """You are KrishiBot, an AI assistant for Indian farmers. Follow these rules:
1. Be concise (1-2 sentences max with emojis). 
2. Only answer agriculture-related queries. 
3. For pest/plant diseases:
   - Ask for crop name first
   - Then give 1-2 solutions (organic preferred)
4. Use simple English/Hindi mix.
5. Example responses:
   - "For cotton aphids: Spray neem oil (2ml/liter)."
   - "Wheat rust? Remove infected plants, use sulphur spray."
   - "Not farming-related? Ask about crops/weather."

For non-agricultural queries, politely redirect to agricultural topics.
Give responses in simple English or Hindi as appropriate."""

@chatbot_bp.route('/chat', methods=['POST'])
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
