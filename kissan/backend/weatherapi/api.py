from flask import Flask, jsonify, request
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Your API key and base URL for WeatherAPI
API_KEY = "7a1bfddbee1d464a800200342250203"  # Replace with your actual API key
BASE_URL = "https://api.weatherapi.com/v1/forecast.json"

@app.route('/weather', methods=['GET'])
def get_weather():
    # Get state and city from query parameters, defaulting to Madhya Pradesh and Indore respectively
    state = request.args.get('state', 'Madhya Pradesh')
    city = request.args.get('city', 'Indore')
    
    # Build location string using the provided (or default) state and city
    location = f"{city}, {state}"

    # Fetch weather data from WeatherAPI for the next 4 days (including today)
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
        # Extract 4-day forecast
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
        
        # Extract current weather data for humidity
        # current_weather = data['current']
        # current_humidity = current_weather['humidity']

        return jsonify({
            'location': location,
            'forecast': forecast,
            # 'current_humidity': current_humidity
        })
    else:
        return jsonify({'error': 'Unable to fetch weather data'}), response.status_code

if __name__ == '__main__':
    app.run(debug=True, port=3500)