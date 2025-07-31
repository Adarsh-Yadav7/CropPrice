
// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.innerHTML = navLinks.classList.contains('active') 
    ? '<i class="fas fa-times"></i>' 
    : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });
});


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
            // Collect form data
            const formData = {
                crop: form.elements['crop'].value,
                district: form.elements['district'].value,
                month: form.elements['month'].value,
                year: form.elements['year'].value,
                soil: form.elements['soil'].value,
                water: form.elements['water'].value
            };

            // Validate
            if (Object.values(formData).some(value => !value)) {
                throw new Error('Please fill in all fields');
            }

            const response = await fetch('https://croppricekissan.onrender.com/predict', {
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

            // Display prices
            minPriceSpan.textContent = responseData.data.predicted_prices.min.toFixed(2);
            maxPriceSpan.textContent = responseData.data.predicted_prices.max.toFixed(2);

            // Show user input data
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
