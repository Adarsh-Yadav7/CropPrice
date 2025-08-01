

from flask import Flask, request, jsonify, send_from_directory
import joblib
import pandas as pd
import os
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__, static_folder='../frontend')
CORS(app)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Load models and encoders
try:
    min_model = joblib.load(os.path.join(BASE_DIR, "min_price_model.pkl"))
    max_model = joblib.load(os.path.join(BASE_DIR, "max_price_model.pkl"))
    le_crop = joblib.load(os.path.join(BASE_DIR, "le_crop.pkl"))
    le_district = joblib.load(os.path.join(BASE_DIR, "le_district.pkl"))
    le_month = joblib.load(os.path.join(BASE_DIR, "le_month.pkl"))
    le_soil = joblib.load(os.path.join(BASE_DIR, "le_soil.pkl"))
    le_water = joblib.load(os.path.join(BASE_DIR, "le_water.pkl"))
    
except Exception as e:
    print(f"Error loading models: {e}")
    raise e

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'home.html')

@app.route('/price')
def price_page():
    return send_from_directory(app.static_folder, 'price.html')

@app.route('/predict', methods=['POST'])
def predict_price():
    try:
        # Validate request has JSON data
        if not request.is_json:
            return jsonify({
                'status': 'error',
                'message': 'Request must be JSON',
                'error_code': 'invalid_content_type'
            }), 400

        data = request.get_json()

        # Validate required fields
        required_fields = ['crop', 'district', 'month', 'year', 'soil', 'water']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                'status': 'error',
                'message': f'Missing required fields: {", ".join(missing_fields)}',
                'error_code': 'missing_fields'
            }), 400

        # Transform user input
        input_data = pd.DataFrame([{
            'Crop': le_crop.transform([data['crop']])[0],
            'District': le_district.transform([data['district']])[0],
            'Month': le_month.transform([data['month']])[0],
            'Year': int(data['year']),
            'Soil_Type': le_soil.transform([data['soil']])[0],
            'Water_Availability': le_water.transform([data['water']])[0]
        }])

        # Make predictions
        min_price = float(min_model.predict(input_data)[0])
        max_price = float(max_model.predict(input_data)[0])

        return jsonify({
            'status': 'success',
            'data': {
                'predicted_prices': {
                    'min': round(min_price, 2),
                    'max': round(max_price, 2)
                },
                'input_data': {
                    'crop': data['crop'],
                    'district': data['district'],
                    'month': data['month'],
                    'year': data['year'],
                    'soil': data['soil'],
                    'water': data['water']
                }
            }
        })

    except ValueError as e:
        return jsonify({
            'status': 'error',
            'message': f'Invalid input value: {str(e)}',
            'error_code': 'invalid_value'
        }), 400
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Prediction failed: {str(e)}',
            'error_code': 'prediction_failed'
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

if __name__ != "__main__":
    application = app

