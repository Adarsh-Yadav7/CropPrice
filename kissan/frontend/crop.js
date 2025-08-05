// document.addEventListener('DOMContentLoaded', function() {
//   // Mobile navigation
//   const hamburger = document.getElementById('hamburger');
//   const navLinks = document.getElementById('navLinks');
//   hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));

//   // Form handling
//   const form = document.getElementById('recommendationForm');
//   const loadingDiv = document.getElementById('loading');
//   const resultsDiv = document.getElementById('results');
//   const cropResultsDiv = document.getElementById('cropResults');

//   form.addEventListener('submit', async function(e) {
//     e.preventDefault();
    
//     loadingDiv.style.display = 'block';
//     resultsDiv.style.display = 'none';
//     cropResultsDiv.innerHTML = '';
    
//     const formData = {
//       soil_type: document.getElementById('soil').value,
//       location: document.getElementById('location').value,
//       season: document.getElementById('season').value,
//       water_availability: document.getElementById('water').value
//     };

//     try {
//       const response = await fetch('https://cropprice-64y3.onrender.com/crop_recc/recommend-crops', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Server error');
//       }

//       const data = await response.json();
      
//       if (data.error) {
//         throw new Error(data.error);
//       }
      
//       displayResults(data);
      
//     } catch (error) {
//       showError(error.message || 'Failed to get recommendations');
//       console.error('Error:', error);
//     } finally {
//       loadingDiv.style.display = 'none';
//       resultsDiv.style.display = 'block';
//     }
//   });

//   function displayResults(data) {
//     cropResultsDiv.innerHTML = '';
    
//     if (!data.recommendations || data.recommendations.length === 0) {
//       cropResultsDiv.innerHTML = `
//         <div class="no-results">
//           <i class="fas fa-info-circle"></i>
//           <p>No crops found for these conditions. Try different parameters.</p>
//         </div>`;
//       return;
//     }

//     data.recommendations.forEach(crop => {
//       const card = document.createElement('div');
//       card.className = 'crop-card';
//       card.innerHTML = `
//         <h4><i class="fas fa-seedling"></i> ${crop.crop || 'N/A'}</h4>
//         <p class="scientific-name">${crop.scientific_name || ''}</p>
//         <div class="details">
//           <div class="details-item">
//             <span>Planting Time:</span>
//             <span>${crop.planting_window || 'N/A'}</span>
//           </div>
//           <div class="details-item">
//             <span>Expected Yield:</span>
//             <span>${crop.yield_range || 'N/A'}</span>
//           </div>
//           <div class="details-item">
//             <span>Water Needs:</span>
//             <span>${crop.water_needs || 'N/A'}</span>
//           </div>
//           <div class="details-item">
//             <span>Market Demand:</span>
//             <span>${crop.market_demand || 'N/A'}</span>
//           </div>
//         </div>`;
//       cropResultsDiv.appendChild(card);
//     });

//     if (data.additional_tips) {
//       const tipsDiv = document.createElement('div');
//       tipsDiv.className = 'additional-tips';
//       tipsDiv.innerHTML = `
//         <h4><i class="fas fa-lightbulb"></i> Expert Advice</h4>
//         <p>${data.additional_tips}</p>
//       `;
//       cropResultsDiv.appendChild(tipsDiv);
//     }
//   }

//   function showError(message) {
//     cropResultsDiv.innerHTML = `
//       <div class="error-message">
//         <i class="fas fa-exclamation-triangle"></i>
//         <p>${message}</p>
//         <button onclick="window.location.reload()">Try Again</button>
//       </div>`;
//   }

// });


document.addEventListener('DOMContentLoaded', function() {
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

    // Form elements
    const form = document.getElementById('recommendationForm');
    const loadingDiv = document.getElementById('loading');
    const resultsDiv = document.getElementById('results');
    const cropResultsDiv = document.getElementById('cropResults');
    
    // Crop color mapping
 const cropColors = {
        'wheat': { 
            primary: '#FFD700', // Gold
            secondary: '#FFF9C4', // Light Gold
            border: '#FBC02D' // Dark Gold
        },
        'maize': {
            primary: '#FFA500', // Orange
            secondary: '#FFE0B2', // Light Orange
            border: '#F57C00' // Dark Orange
        },
        'jowar': {
            primary: '#CD853F', // Peru
            secondary: '#D2B48C', // Tan
            border: '#8B4513' // SaddleBrown
        },
        'soybean': {
            primary: '#8FBC8F', // DarkSeaGreen
            secondary: '#C8E6C9', // Light Green
            border: '#689F38' // Dark Green
        },
        'rice': {
            primary: '#8BC34A', // Light Green
            secondary: '#DCEDC8', // Very Light Green
            border: '#689F38' // Dark Green
        },
        'cotton': {
            primary: '#9C27B0', // Purple
            secondary: '#E1BEE7', // Light Purple
            border: '#7B1FA2' // Dark Purple
        },
        'sugarcane': {
            primary: '#795548', // Brown
            secondary: '#D7CCC8', // Light Brown
            border: '#5D4037' // Dark Brown
        },
        'default': {
            primary: '#4CAF50', // Green
            secondary: '#C8E6C9', // Light Green
            border: '#2E7D32' // Dark Green
        }
    };

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        loadingDiv.style.display = 'flex';
        resultsDiv.style.display = 'none';
        cropResultsDiv.innerHTML = '';
        
        const formData = {
            soil_type: document.getElementById('soil').value,
            location: document.getElementById('location').value,
            season: document.getElementById('season').value,
            water_availability: document.getElementById('water').value
        };

        try {
            // Make API call to Flask backend
            const response = await fetch('https://cropprice-64y3.onrender.com/crop_recc/recommend-crops', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'API request failed');
            }

            const responseData = await response.json();
            
            if (responseData.error) {
                throw new Error(responseData.error);
            }
            
            // Add sample historical prices for demonstration
            const recommendationsWithPrices = responseData.recommendations.map(crop => {
                return {
                    ...crop,
                    historical_prices: generateSamplePrices(crop.crop.toLowerCase())
                };
            });
            
            displayResults({
                ...responseData,
                recommendations: recommendationsWithPrices
            });
            
        } catch (error) {
            showError(error.message || 'Failed to get recommendations');
            console.error('Error:', error);
        } finally {
            loadingDiv.style.display = 'none';
            resultsDiv.style.display = 'block';
        }
    });

    // Helper function to generate sample price data for charts
    function generateSamplePrices(cropType) {
        const basePrices = {
            'wheat': 2000,
            'maize': 1800,
            'jowar': 2200,
            'soybean': 3200,
            'rice': 1500,
            'cotton': 5000,
            'sugarcane': 3000
        };
        
        const basePrice = basePrices[cropType] || 2000;
        return Array.from({length: 6}, (_, i) => 
            basePrice + Math.round(Math.random() * 500 * (i + 1))
        );
    }

    function displayResults(data) {
        cropResultsDiv.innerHTML = '';
        
        if (!data.recommendations || data.recommendations.length === 0) {
            cropResultsDiv.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-info-circle"></i>
                    <p>No crops found for these conditions. Try different parameters.</p>
                </div>`;
            return;
        }

        data.recommendations.forEach(crop => {
            const cropColor = cropColors[crop.crop.toLowerCase()] || '#4CAF50';
            const card = document.createElement('div');
            card.className = 'crop-card';
            card.style.borderLeft = `5px solid ${cropColor}`;
            
            card.innerHTML = `
                <h4 style="color: ${cropColor}"><i class="fas fa-seedling"></i> ${crop.crop || 'N/A'}</h4>
                <p class="scientific-name">${crop.scientific_name || ''}</p>
                <div class="details">
                    <div class="details-item">
                        <span><i class="far fa-calendar-alt"></i> Planting Time:</span>
                        <span>${crop.planting_window || 'N/A'}</span>
                    </div>
                    <div class="details-item">
                        <span><i class="fas fa-weight-hanging"></i> Expected Yield:</span>
                        <span>${crop.yield_range || 'N/A'}</span>
                    </div>
                    <div class="details-item">
                        <span><i class="fas fa-tint"></i> Water Needs:</span>
                        <span>${crop.water_needs || 'N/A'}</span>
                    </div>
                    <div class="details-item">
                        <span><i class="fas fa-chart-line"></i> Market Demand:</span>
                        <span>${crop.market_demand || 'N/A'}</span>
                    </div>
                </div>
                <div class="trend-chart">
                    <canvas id="chart-${crop.crop.toLowerCase().replace(/\s+/g, '-')}"></canvas>
                </div>`;
            
            cropResultsDiv.appendChild(card);
            
            // Create chart for this crop
            if (crop.historical_prices) {
                createChart(crop, cropColor);
            }
        });

        if (data.additional_tips) {
            const tipsDiv = document.createElement('div');
            tipsDiv.className = 'additional-tips';
            tipsDiv.innerHTML = `
                <h4><i class="fas fa-lightbulb"></i> Expert Advice</h4>
                <p>${data.additional_tips}</p>
            `;
            cropResultsDiv.appendChild(tipsDiv);
        }
    }

    function createChart(crop, color) {
        const chartId = `chart-${crop.crop.toLowerCase().replace(/\s+/g, '-')}`;
        const ctx = document.getElementById(chartId).getContext('2d');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 150);
        gradient.addColorStop(0, `${color}80`);
        gradient.addColorStop(1, `${color}20`);
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: `${crop.crop} Price Trend (₹/Quintal)`,
                    data: crop.historical_prices,
                    borderColor: color,
                    backgroundColor: gradient,
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: color,
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => ` ₹${context.parsed.y} /Quintal`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: (value) => `₹${value}`
                        }
                    }
                }
            }
        });
    }

    function showError(message) {
        cropResultsDiv.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
                <button onclick="window.location.reload()">Try Again</button>
            </div>`;
    }
});
