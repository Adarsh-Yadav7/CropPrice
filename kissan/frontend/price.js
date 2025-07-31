document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('predictionForm');
    const submitBtn = document.getElementById('submitBtn');
    const errorDiv = document.getElementById('error');
    const resultDiv = document.getElementById('result');
    const minPriceSpan = document.getElementById('minPrice');
    const maxPriceSpan = document.getElementById('maxPrice');
    const inputDetailsDiv = document.getElementById('inputDetails');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Set loading state
        submitBtn.disabled = true;
        submitBtn.textContent = "Predicting...";
        errorDiv.style.display = 'none';
        resultDiv.style.display = 'none';
        
        try {
            // Get form data
            const formData = {
                crop: form.elements['crop'].value,
                district: form.elements['district'].value,
                month: form.elements['month'].value,
                year: form.elements['year'].value,
                soil: form.elements['soil'].value,
                water: form.elements['water'].value
            };

            // Validate form data
            if (Object.values(formData).some(value => !value)) {
                throw new Error('Please fill in all fields');
            }

            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const responseData = await response.json();
            
            if (!response.ok || responseData.status !== 'success') {
                throw new Error(responseData.message || 'Prediction failed');
            }

            if (!responseData.data?.predicted_prices) {
                throw new Error('Invalid response format from server');
            }

            // Display results
            minPriceSpan.textContent = responseData.data.predicted_prices.min.toFixed(2);
            maxPriceSpan.textContent = responseData.data.predicted_prices.max.toFixed(2);
            
            // Display input details
            inputDetailsDiv.innerHTML = `
                <p><strong>Crop:</strong> ${responseData.data.input_data.crop}</p>
                <p><strong>District:</strong> ${responseData.data.input_data.district}</p>
                <p><strong>Month:</strong> ${responseData.data.input_data.month} ${responseData.data.input_data.year}</p>
                <p><strong>Soil Type:</strong> ${responseData.data.input_data.soil}</p>
                <p><strong>Water Availability:</strong> ${responseData.data.input_data.water}</p>
            `;
            
            resultDiv.style.display = 'block';
        } catch (err) {
            errorDiv.textContent = `❌ Error: ${err.message}`;
            errorDiv.style.display = 'block';
            console.error('Prediction error:', err);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Predict Price";
        }
    });
});