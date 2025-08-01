from flask import Blueprint, request, jsonify, send_from_directory
import os
import numpy as np
import joblib

# Define Blueprint
price_bp = Blueprint("price", __name__, static_folder="../../frontend")

# Path to current directory
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

# Serve HTML files
@price_bp.route('/', defaults={'path': ''})
@price_bp.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(price_bp.static_folder, path)):
        return send_from_directory(price_bp.static_folder, path)
    return send_from_directory(price_bp.static_folder, 'home.html')

@price_bp.route('/price')
def price_page():
    return send_from_directory(price_bp.static_folder, 'price.html')

# Prediction route
@price_bp.route('/predict', methods=['POST'])
def predict_price():
    try:
        data = request.get_json()

        crop = data['crop']
        district = data['district']
        month = data['month']
        soil = data['soil']
        water = data['water']

        # Encode categorical variables
        crop_encoded = le_crop.transform([crop])[0]
        district_encoded = le_district.transform([district])[0]
        month_encoded = le_month.transform([month])[0]
        soil_encoded = le_soil.transform([soil])[0]
        water_encoded = le_water.transform([water])[0]

        # Prepare input array
        input_data = np.array([[crop_encoded, district_encoded, month_encoded, soil_encoded, water_encoded]])

        # Predict min and max prices
        min_price = min_model.predict(input_data)[0]
        max_price = max_model.predict(input_data)[0]

        return jsonify({
            'min_price': round(min_price, 2),
            'max_price': round(max_price, 2)
        })

    except Exception as e:
        return jsonify({'error': str(e)})
