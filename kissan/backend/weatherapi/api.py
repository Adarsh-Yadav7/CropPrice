from flask import Blueprint, jsonify, request
import requests
from datetime import datetime

weather_bp = Blueprint('weather_bp', __name__)

# WeatherAPI config
API_KEY = "7a1bfddbee1d464a800200342250203"
BASE_URL = "https://api.weatherapi.com/v1/forecast.json"

def generate_agricultural_alerts(forecast):
    alerts = []
    for day in forecast:
        date = day['date']
        avg_temp = day['day']['avgtemp_c']
        humidity = day['day']['avghumidity']
        condition = day['day']['condition']['text'].lower()

        # Temperature alerts
        if avg_temp > 35:
            alerts.append({
                'date': date,
                'type': 'heat_wave',
                'message': 'High temperature warning! Consider irrigating crops in the early morning or late evening.',
                'severity': 'high'
            })
        elif avg_temp < 10:
            alerts.append({
                'date': date,
                'type': 'cold_wave',
                'message': 'Low temperature alert! Protect sensitive crops with covers or mulch.',
                'severity': 'medium'
            })

        # Rain alerts
        if 'rain' in condition:
            alerts.append({
                'date': date,
                'type': 'rain',
                'message': 'Rain expected. Delay irrigation and consider drainage for water-sensitive crops.',
                'severity': 'medium'
            })

        # Humidity alerts
        if humidity > 80:
            alerts.append({
                'date': date,
                'type': 'high_humidity',
                'message': 'High humidity expected. Watch for fungal diseases in crops.',
                'severity': 'medium'
            })
        elif humidity < 30:
            alerts.append({
                'date': date,
                'type': 'low_humidity',
                'message': 'Low humidity expected. Increase irrigation frequency.',
                'severity': 'low'
            })

    return alerts

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
            'days': 4,
            'aqi': 'no',
            'alerts': 'yes'
        }
    )

    if response.status_code == 200:
        data = response.json()

        forecast = [
            {
                'date': day['date'],
                'avg_temperature': day['day']['avgtemp_c'],
                'min_temp': day['day']['mintemp_c'],
                'max_temp': day['day']['maxtemp_c'],
                'condition': day['day']['condition']['text'],
                'icon': day['day']['condition']['icon'],
                'humidity': day['day']['avghumidity'],
                'precipitation': day['day']['totalprecip_mm'],
                'uv_index': day['day']['uv'],
                'wind_speed': day['day']['maxwind_kph']
            }
            for day in data['forecast']['forecastday']
        ]

        alerts = generate_agricultural_alerts(data['forecast']['forecastday'])

        current = data.get('current', {})

        return jsonify({
            'location': data['location']['name'] + ", " + data['location']['region'],
            'current': {
                'temp': current.get('temp_c'),
                'condition': current.get('condition', {}).get('text'),
                'icon': current.get('condition', {}).get('icon'),
                'humidity': current.get('humidity'),
                'wind_speed': current.get('wind_kph'),
                'feels_like': current.get('feelslike_c')
            },
            'forecast': forecast,
            'alerts': alerts,
            'last_updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })
    else:
        return jsonify({'error': 'Unable to fetch weather data'}), response.status_code
