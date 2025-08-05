document.addEventListener('DOMContentLoaded', function() {
  // Mobile navigation
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));

  // Form handling
  const form = document.getElementById('recommendationForm');
  const loadingDiv = document.getElementById('loading');
  const resultsDiv = document.getElementById('results');
  const cropResultsDiv = document.getElementById('cropResults');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    loadingDiv.style.display = 'block';
    resultsDiv.style.display = 'none';
    cropResultsDiv.innerHTML = '';
    
    const formData = {
      soil_type: document.getElementById('soil').value,
      location: document.getElementById('location').value,
      season: document.getElementById('season').value,
      water_availability: document.getElementById('water').value
    };

    try {
      const response = await fetch('https://cropprice-64y3.onrender.com/recommend-crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server error');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      displayResults(data);
      
    } catch (error) {
      showError(error.message || 'Failed to get recommendations');
      console.error('Error:', error);
    } finally {
      loadingDiv.style.display = 'none';
      resultsDiv.style.display = 'block';
    }
  });

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
      const card = document.createElement('div');
      card.className = 'crop-card';
      card.innerHTML = `
        <h4><i class="fas fa-seedling"></i> ${crop.crop || 'N/A'}</h4>
        <p class="scientific-name">${crop.scientific_name || ''}</p>
        <div class="details">
          <div class="details-item">
            <span>Planting Time:</span>
            <span>${crop.planting_window || 'N/A'}</span>
          </div>
          <div class="details-item">
            <span>Expected Yield:</span>
            <span>${crop.yield_range || 'N/A'}</span>
          </div>
          <div class="details-item">
            <span>Water Needs:</span>
            <span>${crop.water_needs || 'N/A'}</span>
          </div>
          <div class="details-item">
            <span>Market Demand:</span>
            <span>${crop.market_demand || 'N/A'}</span>
          </div>
        </div>`;
      cropResultsDiv.appendChild(card);
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

  function showError(message) {
    cropResultsDiv.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>${message}</p>
        <button onclick="window.location.reload()">Try Again</button>
      </div>`;
  }

});
