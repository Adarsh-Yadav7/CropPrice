from flask import Flask
from flask_cors import CORS

# Import Blueprints
from chatbot.api import chatbot_bp
from weatherapi.api import weather_bp
from news.api import news_bp
from pricemodel.api import price_bp

app = Flask(__name__)
CORS(app)

# Register routes
app.register_blueprint(chatbot_bp, url_prefix="/chatbot")
app.register_blueprint(weather_bp, url_prefix="/weatherapi")
app.register_blueprint(news_bp, url_prefix="/news")
app.register_blueprint(price_bp, url_prefix="/pricemodel")

# Optional: Root route for testing
@app.route("/")
def home():
    return {"message": "All APIs are running!"}
