// document.addEventListener('DOMContentLoaded', function() {
//   // DOM Elements
//   const stateInput = document.getElementById('stateInput');
//   const cityInput = document.getElementById('cityInput');
//   const fetchButton = document.getElementById('fetchButton');
//   const errorMessage = document.getElementById('errorMessage');
//   const weatherContent = document.getElementById('weatherContent');
//   const locationTitle = document.getElementById('locationTitle');
//   const forecastContainer = document.getElementById('forecastContainer');
//   const hamburger = document.getElementById('hamburger');
//   const navLinks = document.getElementById('navLinks');

//   // State variables
//   let weatherData = null;
//   let loading = false;
//   let isAnimating = false;

//   function fetchWeatherData() {
//   loading = true;
//   isAnimating = true;
//   fetchButton.classList.add('loading');
//   fetchButton.textContent = 'Fetching...';
//   errorMessage.style.display = 'none';
//   weatherContent.style.display = 'none';

//   const url = new URL('https://cropprice-64y3.onrender.com/weatherapi/get');
//   // #'https://cropprice400.onrender.com/weatherapi/get'
//   url.searchParams.append('state', stateInput.value);
//   url.searchParams.append('city', cityInput.value);

//   fetch(url)
//     .then(response => {
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       return response.json();
//     })
//     .then(data => {
//       weatherData = data;
//       renderWeatherData();
//     })
//     .catch(err => {
//       console.error('Fetch Error:', err);
//       errorMessage.textContent = 'Error fetching weather data';
//       errorMessage.style.display = 'block';
//     })
//     .finally(() => {
//       loading = false;
//       fetchButton.classList.remove('loading');
//       fetchButton.textContent = 'Get Weather Forecast';
//       setTimeout(() => {
//         isAnimating = false;
//       }, 500);
//     });
// }

//   // Render weather data
//   function renderWeatherData() {
//     if (!weatherData) return;

//     locationTitle.textContent = `Weather Forecast for ${weatherData.location}`;
//     forecastContainer.innerHTML = '';

//     weatherData.forecast.forEach((day, index) => {
//       const forecastBox = document.createElement('div');
//       forecastBox.className = 'forecast-box';
//       forecastBox.style.animationDelay = `${index * 0.1}s`;
      
//       forecastBox.innerHTML = `
//         <div class="forecast-date">${day.date}</div>
//         <img 
//           src="https:${day.icon}" 
//           alt="${day.condition}"
//           class="weather-icon"
//           onerror="this.src='https://via.placeholder.com/64?text=Weather'"
//         />
//         <div class="forecast-details">
//           <div class="temp">
//             <span class="label">Temperature</span>
//             <span class="value">${day.avg_temperature}°C</span>
//           </div>
//           <div class="condition">
//             <span class="label">Condition</span>
//             <span class="value">${day.condition}</span>
//           </div>
//           <div class="humidity">
//             <span class="label">Humidity</span>
//             <span class="value">${day.humidity}%</span>
//           </div>
//         </div>
//       `;
      
//       forecastContainer.appendChild(forecastBox);
//     });

//     if (isAnimating) {
//       forecastContainer.classList.add('animate');
//     } else {
//       forecastContainer.classList.remove('animate');
//       void forecastContainer.offsetWidth;
//       forecastContainer.classList.add('animate');
//     }

//     weatherContent.style.display = 'block';
//   }

//   // Event listeners
//   fetchButton.addEventListener('click', fetchWeatherData);

//   // Mobile Navigation Toggle
//   hamburger.addEventListener('click', () => {
//     navLinks.classList.toggle('active');
//     hamburger.innerHTML = navLinks.classList.contains('active') 
//       ? '<i class="fas fa-times"></i>' 
//       : '<i class="fas fa-bars"></i>';
//   });

//   // Close mobile menu when clicking on a link
//   document.querySelectorAll('.nav-links a').forEach(link => {
//     link.addEventListener('click', () => {
//       if (navLinks.classList.contains('active')) {
//         navLinks.classList.remove('active');
//         hamburger.innerHTML = '<i class="fas fa-bars"></i>';
//       }
//     });
//   });

//   // Initialize with default values
//   fetchWeatherData();
// });

document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const stateInput = document.getElementById('stateInput');
  const cityInput = document.getElementById('cityInput');
  const fetchButton = document.getElementById('fetchButton');
  const errorMessage = document.getElementById('errorMessage');
  const weatherContent = document.getElementById('weatherContent');
  const locationTitle = document.getElementById('locationTitle');
  const forecastContainer = document.getElementById('forecastContainer');
  const currentWeatherContainer = document.getElementById('currentWeather');
  const alertsContainer = document.getElementById('alertsContainer');
  const recommendationsContainer = document.getElementById('recommendationsContainer');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  // State variables
  let weatherData = null;
  let loading = false;

  function fetchWeatherData() {
    loading = true;
    fetchButton.classList.add('loading');
    fetchButton.textContent = 'Fetching...';
    errorMessage.style.display = 'none';
    weatherContent.style.display = 'none';

    const url = new URL('https://cropprice-64y3.onrender.com/weatherapi/get');
    url.searchParams.append('state', stateInput.value);
    url.searchParams.append('city', cityInput.value);

    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        weatherData = data;
        renderWeatherData();
      })
      .catch(err => {
        console.error('Fetch Error:', err);
        errorMessage.textContent = 'Error fetching weather data. Please try again.';
        errorMessage.style.display = 'block';
      })
      .finally(() => {
        loading = false;
        fetchButton.classList.remove('loading');
        fetchButton.textContent = 'Get Weather Forecast';
      });
  }

  function renderWeatherData() {
    if (!weatherData) return;

    // Update location title
    locationTitle.textContent = `Weather for ${weatherData.location}`;
    locationTitle.innerHTML += `<span class="last-updated">Last updated: ${weatherData.last_updated}</span>`;

    // Render current weather
    renderCurrentWeather();

    // Render forecast
    renderForecast();

    // Render alerts
    renderAlerts();

    // Render recommendations
    renderRecommendations();

    weatherContent.style.display = 'block';
  }

  function renderCurrentWeather() {
    if (!weatherData.current) return;

    currentWeatherContainer.innerHTML = `
      <div class="current-weather-card">
        <h3>Current Conditions</h3>
        <div class="current-main">
          <img src="https:${weatherData.current.icon}" alt="${weatherData.current.condition}" class="current-icon">
          <div class="current-temp">${weatherData.current.temp}°C</div>
        </div>
        <div class="current-details">
          <div class="detail"><span>Feels Like:</span> ${weatherData.current.feels_like}°C</div>
          <div class="detail"><span>Humidity:</span> ${weatherData.current.humidity}%</div>
          <div class="detail"><span>Wind:</span> ${weatherData.current.wind_speed} km/h</div>
          <div class="detail"><span>Condition:</span> ${weatherData.current.condition}</div>
        </div>
      </div>
    `;
  }

  function renderForecast() {
    forecastContainer.innerHTML = '';

    weatherData.forecast.forEach((day, index) => {
      const forecastBox = document.createElement('div');
      forecastBox.className = 'forecast-box';
      forecastBox.style.animationDelay = `${index * 0.1}s`;
      
      forecastBox.innerHTML = `
        <div class="forecast-date">${formatDate(day.date)}</div>
        <img src="https:${day.icon}" alt="${day.condition}" class="weather-icon">
        <div class="forecast-temp">
          <span class="max-temp">${day.max_temp}°</span>
          <span class="min-temp">${day.min_temp}°</span>
        </div>
        <div class="forecast-details">
          <div><i class="fas fa-tint"></i> ${day.humidity}%</div>
          <div><i class="fas fa-cloud-rain"></i> ${day.precipitation}mm</div>
          <div><i class="fas fa-wind"></i> ${day.wind_speed}km/h</div>
          <div class="condition">${day.condition}</div>
        </div>
      `;
      
      forecastContainer.appendChild(forecastBox);
    });
  }

  function renderAlerts() {
    if (!weatherData.alerts || weatherData.alerts.length === 0) {
      alertsContainer.innerHTML = '<div class="no-alerts">No significant weather alerts for this period.</div>';
      return;
    }

    alertsContainer.innerHTML = '<h3><i class="fas fa-exclamation-triangle"></i> Agricultural Alerts</h3>';
    
    weatherData.alerts.forEach(alert => {
      const alertElement = document.createElement('div');
      alertElement.className = `alert ${alert.type} ${alert.severity}`;
      
      alertElement.innerHTML = `
        <div class="alert-date">${formatDate(alert.date)}</div>
        <div class="alert-message">${alert.message}</div>
      `;
      
      alertsContainer.appendChild(alertElement);
    });
  }

  function renderRecommendations() {
    const recommendations = generateRecommendations();
    
    recommendationsContainer.innerHTML = '<h3><i class="fas fa-lightbulb"></i> Farming Recommendations</h3>';
    
    recommendations.forEach(rec => {
      const recElement = document.createElement('div');
      recElement.className = 'recommendation';
      
      recElement.innerHTML = `
        <div class="rec-category">${rec.category}</div>
        <div class="rec-content">${rec.content}</div>
      `;
      
      recommendationsContainer.appendChild(recElement);
    });
  }

  function generateRecommendations() {
    if (!weatherData.forecast) return [];
    
    const recs = [];
    const temps = weatherData.forecast.map(day => day.avg_temperature);
    const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
    const humidity = weatherData.forecast[0].humidity;
    const precipitation = weatherData.forecast[0].precipitation;
    
    // General recommendations
    if (avgTemp > 30) {
      recs.push({
        category: 'Irrigation',
        content: 'Increase irrigation frequency due to high temperatures. Water early morning or late evening to reduce evaporation.'
      });
    } else if (avgTemp < 15) {
      recs.push({
        category: 'Crop Protection',
        content: 'Consider using row covers or mulch to protect crops from cold temperatures.'
      });
    }
    
    if (precipitation > 10) {
      recs.push({
        category: 'Drainage',
        content: 'Ensure proper drainage in fields to prevent waterlogging from expected rainfall.'
      });
    }
    
    if (humidity > 75) {
      recs.push({
        category: 'Disease Prevention',
        content: 'High humidity increases fungal disease risk. Consider preventive fungicide applications.'
      });
    }
    
    // Seasonal recommendations
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) {
      recs.push({
        category: 'Seasonal',
        content: 'Spring season - ideal time for planting summer crops like corn, soybeans, and cotton.'
      });
    } else if (month >= 6 && month <= 9) {
      recs.push({
        category: 'Seasonal',
        content: 'Monsoon season - focus on rice cultivation and water management.'
      });
    }
    
    return recs.length > 0 ? recs : [{
      category: 'General',
      content: 'Weather conditions are favorable for most crops. Monitor regularly for any changes.'
    }];
  }

  function formatDate(dateStr) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  }

  // Event listeners
  fetchButton.addEventListener('click', fetchWeatherData);
  
  // Mobile Navigation Toggle
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

  // Initialize with default values
  fetchWeatherData();
});


