# kissan/backend/weatherapi/api.py

from flask import Blueprint, jsonify, request
import requests

weather_bp = Blueprint('weather_bp', __name__)

# WeatherAPI config
API_KEY = "7a1bfddbee1d464a800200342250203"  # Replace with your actual key
BASE_URL = "https://api.weatherapi.com/v1/forecast.json"

@weather_bp.route('/get', methods=['GET'])
def get_weather():
    state = request.args.get('state', 'Madhya Pradesh')
    city = request.args.get('city', 'Indore')
    location = f"{city}, {state}"

    response = requests.get(
        BASE_URL,
        params={
            'key': API_KEY,
            'q': location,
            'days': 4
        }
    )

    if response.status_code == 200:
        data = response.json()
        forecast = [
            {
                'date': day['date'],
                'avg_temperature': day['day']['avgtemp_c'],
                'condition': day['day']['condition']['text'],
                'icon': day['day']['condition']['icon'],
                'humidity': day['day']['avghumidity']
            }
            for day in data['forecast']['forecastday']
        ]

        return jsonify({
            'location': location,
            'forecast': forecast
        })
    else:
        return jsonify({'error': 'Unable to fetch weather data'}), response.status_code
