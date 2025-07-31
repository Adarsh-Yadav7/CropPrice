
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error
import joblib

# Load dataset
data = pd.read_csv(r"C:\Users\vishw\Downloads\crop_price_dataset_2000rows.csv")

# Drop missing values
data.dropna(inplace=True)
# Display unique values
print("✅ Crop Names:")
print(data['Crop'].unique())

print("\n✅ Districts:")
print(data['District'].unique())

print("\n✅ Soil Types:")
print(data['Soil_Type'].unique())

# Convert date column to datetime and extract month/year
data['Date'] = pd.to_datetime(data['Date'])
data['Month'] = data['Date'].dt.strftime('%B')
data['Year'] = data['Date'].dt.year
data.drop(columns=['Date'], inplace=True)

# Encode all categorical variables
le_crop = LabelEncoder()
le_district = LabelEncoder()
le_month = LabelEncoder()
le_soil = LabelEncoder()
le_water = LabelEncoder()

data['Crop'] = le_crop.fit_transform(data['Crop'])
data['District'] = le_district.fit_transform(data['District'])
data['Month'] = le_month.fit_transform(data['Month'])
data['Soil_Type'] = le_soil.fit_transform(data['Soil_Type'])
data['Water_Availability'] = le_water.fit_transform(data['Water_Availability'])

# Define features and targets
features = ['Crop', 'District', 'Month', 'Year', 'Soil_Type', 'Water_Availability']
X = data[features]
y_min = data['Min_Price']
y_max = data['Max_Price']

# Train/test split
X_train_min, X_test_min, y_train_min, y_test_min = train_test_split(X, y_min, test_size=0.2, random_state=42)
X_train_max, X_test_max, y_train_max, y_test_max = train_test_split(X, y_max, test_size=0.2, random_state=42)

# Models
min_price_model = RandomForestRegressor(n_estimators=100, random_state=42)
max_price_model = RandomForestRegressor(n_estimators=100, random_state=42)

# Train models
min_price_model.fit(X_train_min, y_train_min)
max_price_model.fit(X_train_max, y_train_max)

# Evaluate models
min_price_preds = min_price_model.predict(X_test_min)
max_price_preds = max_price_model.predict(X_test_max)

print("📉 Min Price Model")
print("R2 Score:", r2_score(y_test_min, min_price_preds))
print("RMSE:", np.sqrt(mean_squared_error(y_test_min, min_price_preds)))

print("\n📈 Max Price Model")
print("R2 Score:", r2_score(y_test_max, max_price_preds))
print("RMSE:", np.sqrt(mean_squared_error(y_test_max, max_price_preds)))

# Optional: Save models and encoders
joblib.dump(min_price_model, 'min_price_model.pkl')
joblib.dump(max_price_model, 'max_price_model.pkl')
joblib.dump(le_crop, 'le_crop.pkl')
joblib.dump(le_district, 'le_district.pkl')
joblib.dump(le_month, 'le_month.pkl')
joblib.dump(le_soil, 'le_soil.pkl')
joblib.dump(le_water, 'le_water.pkl')

# ----------------- 🔮 PREDICTION FOR USER INPUT -----------------

# Sample input
crop_input = 'Wheat'
district_input = 'Indore'
month_input = 'January'
year_input = 2026
soil_input = 'Loamy'
water_input = 'Low'

# Transform user input using label encoders
X_user = pd.DataFrame([{
    'Crop': le_crop.transform([crop_input])[0],
    'District': le_district.transform([district_input])[0],
    'Month': le_month.transform([month_input])[0],
    'Year': year_input,
    'Soil_Type': le_soil.transform([soil_input])[0],
    'Water_Availability': le_water.transform([water_input])[0]
}])

# Predict prices
predicted_min = min_price_model.predict(X_user)[0]
predicted_max = max_price_model.predict(X_user)[0]

print(f"\n📊 Prediction for {crop_input} in {district_input}, {month_input} {year_input}:")
print(f"✅ Soil: {soil_input}, Water: {water_input}")
print(f"✅ Predicted Min Price: ₹{predicted_min:.2f}")
print(f"✅ Predicted Max Price: ₹{predicted_max:.2f}")
