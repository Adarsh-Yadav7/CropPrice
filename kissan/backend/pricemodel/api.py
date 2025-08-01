from flask import Blueprint, request, jsonify
import os
import numpy as np
import joblib

# Define the blueprint
price_bp = Blueprint("price", __name__)

# Base directory (used to locate model files)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load trained model and encoders
model_path = os.path.join(BASE_DIR, "crop_price_model.pkl")
le_crop = joblib.load(os.path.join(BASE_DIR, "le_crop.pkl"))
le_district = joblib.load(os.path.join(BASE_DIR, "le_district.pkl"))
le_month = joblib.load(os.path.join(BASE_DIR, "le_month.pkl"))
le_soil = joblib.load(os.path.join(BASE_DIR, "le_soil.pkl"))
le_water = joblib.load(os.path.join(BASE_DIR, "le_water.pkl"))
model = joblib.load(model_path)

# Predict route
@price_bp.route("/predict", methods=["POST"])
def predict_price():
    try:
        data = request.get_json()
        crop = data.get("crop")
        district = data.get("district")
        month = data.get("month")
        soil = data.get("soil")
        water = data.get("water")

        # Log received values (for debugging)
        print("Received data:", data)

        # Validate input values
        try:
            crop_encoded = le_crop.transform([crop])[0]
            district_encoded = le_district.transform([district])[0]
            month_encoded = le_month.transform([month])[0]
            soil_encoded = le_soil.transform([soil])[0]
            water_encoded = le_water.transform([water])[0]
        except ValueError as ve:
            return jsonify({'status': 'error', 'message': f'Invalid input: {ve}'}), 400

        # Prepare input for prediction
        features = np.array([[crop_encoded, district_encoded, month_encoded, soil_encoded, water_encoded]])

        # Predict using model
        predicted_price = model.predict(features)[0]

        return jsonify({'status': 'success', 'predicted_price': round(predicted_price, 2)})
    
    except Exception as e:
        print("Prediction error:", str(e))
        return jsonify({'status': 'error', 'message': 'Prediction failed'}), 500
