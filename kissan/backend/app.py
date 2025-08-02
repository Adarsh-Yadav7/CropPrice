from flask import Flask
from flask_cors import CORS

# ✅ Import Blueprints
from backend.chatbot.api import chatbot_bp
from backend.weatherapi.api import weather_bp
from backend.news.api import news_bp
from backend.pricemodel.api import price_bp
from backend.crop_recc.api import crop_bp          # 🆕 Add this
from backend.trend.api import trend_bp             # 🆕 And this

app = Flask(__name__)
CORS(app)  # ✅ Enable CORS

# ✅ Register Blueprints
app.register_blueprint(chatbot_bp, url_prefix="/chatbot")
app.register_blueprint(weather_bp, url_prefix="/weatherapi")
app.register_blueprint(news_bp, url_prefix="/news")
app.register_blueprint(price_bp, url_prefix="/pricemodel")
app.register_blueprint(crop_bp, url_prefix="/crop_recc")       # 🆕 Register
app.register_blueprint(trend_bp, url_prefix="/trend")         # 🆕 Register

# ✅ Root Route
@app.route("/")
def home():
    return {"message": "APIs running: Chatbot, Weather, News, PriceModel, Crop Recommendation, Trend"}

if __name__ == "__main__":
    app.run(debug=True, port=5000)
