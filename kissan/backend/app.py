from flask import Flask
from flask_cors import CORS

# ✅ Import Blueprints
from backend.chatbot.api import chatbot_bp
from backend.weatherapi.api import weather_bp
from backend.news.api import news_bp
from backend.pricemodel.api import price_bp

app = Flask(__name__)
CORS(app)  # ✅ Enable CORS for all routes

# ✅ Register Blueprints with URL prefixes
app.register_blueprint(chatbot_bp, url_prefix="/chatbot")
app.register_blueprint(weather_bp, url_prefix="/weatherapi")
app.register_blueprint(news_bp, url_prefix="/news")
app.register_blueprint(price_bp, url_prefix="/pricemodel")

# ✅ Optional Root Route
@app.route("/")
def home():
    return {"message": "All APIs (Chatbot, Weather, News, PriceModel) are running!"}

if __name__ == "__main__":
    app.run(debug=True, port=5000)
