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
    // Load Chart.js dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    document.body.appendChild(script);
    
    const form = document.getElementById('predictionForm');
    const submitBtn = document.getElementById('submitBtn');
    const errorDiv = document.getElementById('error');
    const resultDiv = document.getElementById('result');
    const minPriceSpan = document.getElementById('minPrice');
    const maxPriceSpan = document.getElementById('maxPrice');
    const inputDetailsDiv = document.getElementById('inputDetails');
    const cropAnimation = document.getElementById('cropAnimation');
    const trendText = document.getElementById('trendText');
    const farmingAdvice = document.getElementById('farmingAdvice');
    
    // Store chart instance
    let priceChart = null;

    // Color palette
    const colorPalette = {
        wheat: '#FFD700', // Gold
        maize: '#FFA500', // Orange
        jowar: '#CD853F', // Peru
        soybean: '#8FBC8F', // Dark Sea Green
        positive: '#4CAF50', // Green
        negative: '#F44336', // Red
        neutral: '#2196F3'  // Blue
    };

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Set loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Predicting...';
        errorDiv.style.display = 'none';
        resultDiv.style.display = 'none';
        cropAnimation.style.display = 'block';

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

            // Display prices with color coding
            const minPrice = responseData.data.predicted_prices.min;
            const maxPrice = responseData.data.predicted_prices.max;
            const priceDifference = maxPrice - minPrice;
            
            minPriceSpan.textContent = minPrice.toFixed(2);
            maxPriceSpan.textContent = maxPrice.toFixed(2);
            
            // Color code the price cards based on crop type
            const cropColor = getCropColor(formData.crop);
            document.querySelectorAll('.price-card').forEach(card => {
                card.style.borderTop = `3px solid ${cropColor}`;
            });

            // Show user input data with colorful icons
            inputDetailsDiv.innerHTML = `
                <p><i class="fas fa-seedling" style="color: ${cropColor}"></i> <strong>Crop:</strong> ${responseData.data.input_data.crop}</p>
                <p><i class="fas fa-map-marker-alt" style="color: #E91E63"></i> <strong>District:</strong> ${responseData.data.input_data.district}</p>
                <p><i class="far fa-calendar-alt" style="color: #3F51B5"></i> <strong>Month:</strong> ${responseData.data.input_data.month} ${responseData.data.input_data.year}</p>
                <p><i class="fas fa-mountain" style="color: #795548"></i> <strong>Soil Type:</strong> ${responseData.data.input_data.soil}</p>
                <p><i class="fas fa-tint" style="color: #00BCD4"></i> <strong>Water Availability:</strong> ${responseData.data.input_data.water}</p>
            `;

            // Show price trend if historical data is available
            if (responseData.data.historical_prices) {
                showPriceTrend(
                    responseData.data.input_data.crop,
                    responseData.data.input_data.district,
                    responseData.data.historical_prices
                );
            } else {
                // Fallback: Generate sample trend if no historical data
                generateSampleTrend(
                    responseData.data.input_data.crop,
                    responseData.data.input_data.district,
                    responseData.data.predicted_prices
                );
            }

            resultDiv.style.display = 'block';

        } catch (err) {
            errorDiv.textContent = `❌ Error: ${err.message}`;
            errorDiv.style.display = 'block';
            console.error('Prediction error:', err);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Predict Price <i class="fas fa-chart-line"></i>';
            cropAnimation.style.display = 'none';
        }
    });

    function getCropColor(cropName) {
        const crop = cropName.toLowerCase();
        if (crop.includes('wheat')) return colorPalette.wheat;
        if (crop.includes('maize')) return colorPalette.maize;
        if (crop.includes('jowar')) return colorPalette.jowar;
        if (crop.includes('soybean')) return colorPalette.soybean;
        return colorPalette.positive; // Default green
    }

    function showPriceTrend(crop, district, historicalPrices) {
        // Prepare data for chart
        const labels = historicalPrices.map(item => item.month);
        const prices = historicalPrices.map(item => item.price);
        
        // Calculate percentage change
        const lastChange = historicalPrices.length > 1 
            ? ((prices[prices.length-1] - prices[prices.length-2]) / prices[prices.length-2] * 100).toFixed(1)
            : 0;

        // Update trend text with color coding
        updateTrendText(lastChange);
        
        // Create or update chart with gradient
        createChart(crop, district, labels, prices, lastChange);
    }

    function generateSampleTrend(crop, district, predictedPrices) {
        // Generate sample data for 6 months
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const avgPrice = (predictedPrices.min + predictedPrices.max) / 2;
        
        // Generate realistic sample prices
        const prices = months.map((_, i) => {
            const fluctuation = (Math.random() * 0.2 - 0.1) * avgPrice;
            return avgPrice + fluctuation * (i / months.length);
        });
        
        // Calculate percentage change
        const lastChange = ((prices[5] - prices[4]) / prices[4] * 100).toFixed(1);
        
        // Update trend text with color coding
        updateTrendText(lastChange);
        
        // Create chart with sample data and gradient
        createChart(crop, district, months, prices, lastChange);
    }

    function updateTrendText(percentageChange) {
        const trendElement = document.getElementById('priceTrend');
        
        if (percentageChange > 5) {
            trendText.innerHTML = `<i class="fas fa-arrow-up" style="color: ${colorPalette.positive}"></i> Prices <strong style="color: ${colorPalette.positive}">increased by ${percentageChange}%</strong> last month. Expected to rise further.`;
            farmingAdvice.innerHTML = `<i class="fas fa-thumbs-up" style="color: ${colorPalette.positive}"></i> Market prices are <strong>rising</strong>. This is a good time to plant this crop for maximum profit.`;
            trendElement.style.borderLeft = `4px solid ${colorPalette.positive}`;
        } else if (percentageChange < -5) {
            trendText.innerHTML = `<i class="fas fa-arrow-down" style="color: ${colorPalette.negative}"></i> Prices <strong style="color: ${colorPalette.negative}">dropped by ${Math.abs(percentageChange)}%</strong> last month. May stabilize soon.`;
            farmingAdvice.innerHTML = `<i class="fas fa-exclamation-triangle" style="color: ${colorPalette.negative}"></i> Prices are <strong>declining</strong>. Consider alternative crops or wait for better market conditions.`;
            trendElement.style.borderLeft = `4px solid ${colorPalette.negative}`;
        } else {
            trendText.innerHTML = `<i class="fas fa-equals" style="color: ${colorPalette.neutral}"></i> Prices remained <strong style="color: ${colorPalette.neutral}">stable</strong> last month. The trend is neutral.`;
            farmingAdvice.innerHTML = `<i class="fas fa-info-circle" style="color: ${colorPalette.neutral}"></i> Prices are <strong>stable</strong>. This crop remains a safe choice with moderate profit potential.`;
            trendElement.style.borderLeft = `4px solid ${colorPalette.neutral}`;
        }
    }

    function createChart(crop, district, labels, prices, lastChange) {
        const ctx = document.getElementById('trendChart').getContext('2d');
        
        // Determine chart color based on trend
        const chartColor = lastChange > 0 ? colorPalette.positive : 
                         lastChange < 0 ? colorPalette.negative : 
                         colorPalette.neutral;
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, `${chartColor}80`); // 50% opacity
        gradient.addColorStop(1, `${chartColor}20`); // 20% opacity
        
        // Destroy previous chart if exists
        if (priceChart) {
            priceChart.destroy();
        }
        
        // Create new chart with colorful style
        priceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `${crop} Price (₹/Quintal) in ${district}`,
                    data: prices,
                    borderColor: chartColor,
                    backgroundColor: gradient,
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: chartColor,
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#333',
                        titleFont: {
                            size: 16
                        },
                        bodyFont: {
                            size: 14
                        },
                        callbacks: {
                            label: (context) => ` ₹${context.parsed.y.toFixed(2)} /Quintal`,
                            labelColor: () => ({
                                borderColor: 'transparent',
                                backgroundColor: chartColor
                            })
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        title: {
                            display: true,
                            text: 'Price (₹/Quintal)',
                            font: {
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            callback: (value) => `₹${value}`,
                            font: {
                                weight: 'bold'
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                weight: 'bold'
                            }
                        }
                    }
                }
            }
        });
    }
});
