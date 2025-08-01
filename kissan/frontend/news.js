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
  // State variables
  let news = [];
  let currentIndex = 0;
  let isNewsVisible = false;
  let isLoading = true;
  let autoPlay = false;
  let autoPlayInterval;
  let error = null;

  // DOM elements
  const newsToggleBox = document.getElementById('newsToggleBox');
  const newsContentWrapper = document.getElementById('newsContentWrapper');
  const loadingContainer = document.getElementById('loadingContainer');
  const errorContainer = document.getElementById('errorContainer');
  const errorMessage = document.getElementById('errorMessage');
  const retryBtn = document.getElementById('retryBtn');
  const newsCount = document.getElementById('newsCount');
  const currentIndexSpan = document.getElementById('currentIndex');
  const totalNewsSpan = document.getElementById('totalNews');
  const autoPlayBtn = document.getElementById('autoPlayBtn');
  const newsTrack = document.getElementById('newsTrack');
  const dotsContainer = document.getElementById('dotsContainer');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const progressFill = document.getElementById('progressFill');

  // Fetch news data
  function fetchNews() {
    isLoading = true;
    loadingContainer.style.display = 'flex';
    errorContainer.style.display = 'none';
    newsContentWrapper.style.display = 'none';

    console.log('Fetching news...'); // Debug log

    // Using fetch instead of axios
    fetch('https://cropprice400.onrender.com/real-time-news?query=farming&page_size=8')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('API Response:', data); // Debug log
        if (data.error) {
          throw new Error(data.error);
        }
        news = data.news || [];
        error = null;
        renderNews();
      })
      .catch(err => {
        console.error('Error:', err); // Debug log
        error = 'Unable to fetch latest farming news. Please try again later.';
        showError();
      })
      .finally(() => {
        isLoading = false;
        loadingContainer.style.display = 'none';
      });
  }

  // Render news cards
  function renderNews() {
    if (error) {
      showError();
      return;
    }

    newsCount.textContent = `${news.length} articles available`;
    totalNewsSpan.textContent = news.length;

    // Clear existing content
    newsTrack.innerHTML = '';
    dotsContainer.innerHTML = '';

    if (news.length === 0) {
      error = 'No news articles found.';
      showError();
      return;
    }

    // Create news cards
    news.forEach((article, index) => {
      const newsCard = document.createElement('div');
      newsCard.className = 'news-card';
      newsCard.innerHTML = `
        <div class="card-header">
          <div class="news-badge">Latest</div>
          <div class="news-category">🌱 Agriculture</div>
        </div>
        
        <div class="card-content">
          <h3>${article.title || 'No title available'}</h3>
          <p class="description">${article.description || 'No description available'}</p>
          
          <div class="meta-info">
            <div class="source-info">
              <span class="source-icon">📺</span>
              <span class="source">${article.source || 'Unknown source'}</span>
            </div>
            <div class="date-info">
              <span class="date-icon">📅</span>
              <span class="date">
                ${article.published_at ? new Date(article.published_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'Date not available'}
              </span>
            </div>
          </div>
        </div>
        
        <div class="card-footer">
          <a href="${article.url || '#'}" target="_blank" rel="noopener noreferrer" class="read-more-btn">
            <span>Read Full Article</span>
            <span class="arrow">→</span>
          </a>
        </div>
      `;
      newsTrack.appendChild(newsCard);

      // Create dots
      const dot = document.createElement('button');
      dot.className = 'dot';
      if (index === currentIndex) {
        dot.classList.add('active');
      }
      dot.addEventListener('click', () => handleDotClick(index));
      dotsContainer.appendChild(dot);
    });

    updateNewsDisplay();
  }

  // Show error message
  function showError() {
    errorMessage.textContent = error;
    errorContainer.style.display = 'flex';
    newsContentWrapper.style.display = 'none';
  }

  // Update news display
  function updateNewsDisplay() {
    newsTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
    currentIndexSpan.textContent = currentIndex + 1;
    progressFill.style.width = `${((currentIndex + 1) / news.length) * 100}%`;

    // Update active dot
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // Next card
  function handleNextCard() {
    currentIndex = (currentIndex + 1) % news.length;
    updateNewsDisplay();
  }

  // Previous card
  function handlePrevCard() {
    currentIndex = (currentIndex - 1 + news.length) % news.length;
    updateNewsDisplay();
  }

  // Dot click
  function handleDotClick(index) {
    currentIndex = index;
    updateNewsDisplay();
  }

  // Toggle auto play
  function toggleAutoPlay() {
    autoPlay = !autoPlay;
    autoPlayBtn.classList.toggle('active', autoPlay);
    autoPlayBtn.title = autoPlay ? 'Pause Auto-play' : 'Start Auto-play';
    autoPlayBtn.innerHTML = autoPlay ? '⏸️' : '▶️';

    if (autoPlay) {
      autoPlayInterval = setInterval(handleNextCard, 4000);
    } else {
      clearInterval(autoPlayInterval);
    }
  }

  // Toggle news visibility
  function toggleNewsVisibility() {
    isNewsVisible = !isNewsVisible;
    newsToggleBox.classList.toggle('active', isNewsVisible);
    newsContentWrapper.style.display = isNewsVisible ? 'block' : 'none';
    
    const toggleIcon = newsToggleBox.querySelector('.toggle-icon');
    const title = newsToggleBox.querySelector('h3');
    const description = newsToggleBox.querySelector('p');
    
    if (isNewsVisible) {
      toggleIcon.textContent = '📖';
      title.textContent = 'Hide News Feed';
      description.textContent = 'Close news panel';
    } else {
      toggleIcon.textContent = '📰';
      title.textContent = 'Show Latest News';
      description.textContent = `${news.length} articles available`;
    }
  }

  // Event listeners
  newsToggleBox.addEventListener('click', toggleNewsVisibility);
  autoPlayBtn.addEventListener('click', toggleAutoPlay);
  prevBtn.addEventListener('click', handlePrevCard);
  nextBtn.addEventListener('click', handleNextCard);
  retryBtn.addEventListener('click', fetchNews);

  // Initialize
  fetchNews();
});
