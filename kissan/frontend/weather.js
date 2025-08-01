document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const stateInput = document.getElementById('stateInput');
  const cityInput = document.getElementById('cityInput');
  const fetchButton = document.getElementById('fetchButton');
  const errorMessage = document.getElementById('errorMessage');
  const weatherContent = document.getElementById('weatherContent');
  const locationTitle = document.getElementById('locationTitle');
  const forecastContainer = document.getElementById('forecastContainer');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  // State variables
  let weatherData = null;
  let loading = false;
  let isAnimating = false;

  function fetchWeatherData() {
  loading = true;
  isAnimating = true;
  fetchButton.classList.add('loading');
  fetchButton.textContent = 'Fetching...';
  errorMessage.style.display = 'none';
  weatherContent.style.display = 'none';

  const url = new URL('http://localhost:3500/weather');
  url.searchParams.append('state', stateInput.value);
  url.searchParams.append('city', cityInput.value);

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      weatherData = data;
      renderWeatherData();
    })
    .catch(err => {
      console.error('Fetch Error:', err);
      errorMessage.textContent = 'Error fetching weather data';
      errorMessage.style.display = 'block';
    })
    .finally(() => {
      loading = false;
      fetchButton.classList.remove('loading');
      fetchButton.textContent = 'Get Weather Forecast';
      setTimeout(() => {
        isAnimating = false;
      }, 500);
    });
}

  // Render weather data
  function renderWeatherData() {
    if (!weatherData) return;

    locationTitle.textContent = `Weather Forecast for ${weatherData.location}`;
    forecastContainer.innerHTML = '';

    weatherData.forecast.forEach((day, index) => {
      const forecastBox = document.createElement('div');
      forecastBox.className = 'forecast-box';
      forecastBox.style.animationDelay = `${index * 0.1}s`;
      
      forecastBox.innerHTML = `
        <div class="forecast-date">${day.date}</div>
        <img 
          src="https:${day.icon}" 
          alt="${day.condition}"
          class="weather-icon"
          onerror="this.src='https://via.placeholder.com/64?text=Weather'"
        />
        <div class="forecast-details">
          <div class="temp">
            <span class="label">Temperature</span>
            <span class="value">${day.avg_temperature}°C</span>
          </div>
          <div class="condition">
            <span class="label">Condition</span>
            <span class="value">${day.condition}</span>
          </div>
          <div class="humidity">
            <span class="label">Humidity</span>
            <span class="value">${day.humidity}%</span>
          </div>
        </div>
      `;
      
      forecastContainer.appendChild(forecastBox);
    });

    if (isAnimating) {
      forecastContainer.classList.add('animate');
    } else {
      forecastContainer.classList.remove('animate');
      void forecastContainer.offsetWidth;
      forecastContainer.classList.add('animate');
    }

    weatherContent.style.display = 'block';
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