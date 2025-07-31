const slides = [
  {
    id: 1,
    src: "https://images.pexels.com/photos/235925/pexels-photo-235925.jpeg",
    label: "Harvest Analytics",
    subtitle: "Data-Driven Farming",
    description: "Make informed decisions with our prediction models.",
    ctaText: "Explore Analytics",
  },
  {
    id: 2,
    src: "https://images.pexels.com/photos/2382904/pexels-photo-2382904.jpeg",
    label: "Krishi Chat",
    subtitle: "Your Smart Agricultural Assistant",
    description: "Farmer-focused chatbot for guidance.",
    ctaText: "Start Chatting",
  },
  {
    id: 3,
    src: "https://images.pexels.com/photos/442589/pexels-photo-442589.jpeg",
    label: "Smart Crop Insights",
    subtitle: "Grow What Thrives",
    description: "Analyze soil & climate to find profitable crops.",
    ctaText: "Get Insights",
  },
];

let activeSlide = 0;
let autoplayPaused = false;

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
          <button class="btn btn-primary">${slide.ctaText} <span class="btn-icon">→</span></button>
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
}
function resumeAutoplay() {
  autoplayPaused = false;
}

setInterval(() => {
  if (!autoplayPaused) nextSlide();
}, 6000);

renderSlides();
