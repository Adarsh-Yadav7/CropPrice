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

// Slides data
const slides = [
  {
    id: 1,
    src: "https://images.pexels.com/photos/235925/pexels-photo-235925.jpeg",
    label: "Harvest Analytics",
    subtitle: "Data-Driven Farming",
    description: "Make informed decisions with our prediction models.",
    ctaText: "Explore Analytics",
    url: "analysis.html"
  },
  {
    id: 2,
    src: "https://images.pexels.com/photos/2382904/pexels-photo-2382904.jpeg",
    label: "Krishi Chat",
    subtitle: "Your Smart Agricultural Assistant",
    description: "Farmer-focused chatbot for guidance.",
    ctaText: "Start Chatting",
    url: "chat.html"
  },
  {
    id: 3,
    src: "https://images.pexels.com/photos/442589/pexels-photo-442589.jpeg",
    label: "Smart Crop Insights",
    subtitle: "Grow What Thrives",
    description: "Analyze soil & climate to find profitable crops.",
    ctaText: "Get Insights",
    url: "crop.html"
  }
];

let activeSlide = 0;
let autoplayPaused = false;
let autoplayInterval;

function renderSlides() {
  const slidesContainer = document.getElementById("slides");
  const indicators = document.getElementById("indicators");

  slidesContainer.innerHTML = "";
  indicators.innerHTML = "";

  slides.forEach((slide, index) => {
    const slideDiv = document.createElement("div");
    slideDiv.className = `slide ${index === activeSlide ? "active" : ""}`;
    slideDiv.style.transform = `translateX(${(index - activeSlide) * 100}%)`;
    slideDiv.style.zIndex = index === activeSlide ? 2 : 1;

    slideDiv.innerHTML = `
      <div class="slide-bg" style="background-image: url('${slide.src}')"></div>
      <div class="slide-overlay"></div>
      <div class="slide-content">
        <h3 class="slide-subtitle">${slide.subtitle}</h3>
        <h2 class="slide-title">${slide.label}</h2>
        <p class="slide-description">${slide.description}</p>
        <div class="slide-actions">
          <button class="btn btn-primary" data-url="${slide.url}">${slide.ctaText} <span class="btn-icon">→</span></button>
          <button class="btn btn-secondary">Learn More</button>
        </div>
      </div>
    `;

    const indicator = document.createElement("button");
    indicator.className = `carousel-indicator ${index === activeSlide ? "active" : ""}`;
    indicator.onclick = () => goToSlide(index);
    indicator.innerHTML = `<span class="indicator-progress"></span>`;

    slidesContainer.appendChild(slideDiv);
    indicators.appendChild(indicator);
  });

  // Reset autoplay timer when slides are rendered
  resetAutoplay();
}

function nextSlide() {
  activeSlide = (activeSlide + 1) % slides.length;
  renderSlides();
}

function prevSlide() {
  activeSlide = activeSlide === 0 ? slides.length - 1 : activeSlide - 1;
  renderSlides();
}

function goToSlide(index) {
  activeSlide = index;
  renderSlides();
}

function pauseAutoplay() {
  autoplayPaused = true;
  clearInterval(autoplayInterval);
}

function resumeAutoplay() {
  autoplayPaused = false;
  resetAutoplay();
}

function resetAutoplay() {
  clearInterval(autoplayInterval);
  autoplayInterval = setInterval(() => {
    if (!autoplayPaused) nextSlide();
  }, 6000);
}

// Handle slide button clicks
document.addEventListener('click', (e) => {
  // Navigation for primary buttons
  if (e.target.classList.contains('btn-primary') || 
      e.target.parentElement.classList.contains('btn-primary')) {
    const button = e.target.classList.contains('btn-primary') 
      ? e.target 
      : e.target.parentElement;
    const url = button.getAttribute('data-url');
    if (url) {
      window.location.href = url;
    }
  }
  
  // Pause autoplay when interacting with carousel
  if (e.target.closest('.slide') || e.target.closest('.carousel-indicator')) {
    pauseAutoplay();
    setTimeout(resumeAutoplay, 10000); // Resume after 10 seconds of inactivity
  }
});

// Initialize
renderSlides();

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    nextSlide();
  } else if (e.key === 'ArrowLeft') {
    prevSlide();
  }
});

// Pause autoplay when window loses focus
window.addEventListener('blur', pauseAutoplay);
window.addEventListener('focus', resumeAutoplay);
