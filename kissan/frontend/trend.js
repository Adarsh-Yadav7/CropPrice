

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



async function fetchTrend() {
  const crop = document.getElementById("crop").value.trim();
  const location = document.getElementById("location").value.trim();

  if (!crop || !location) {
    alert("Please select both crop and location.");
    return;
  }

  try {
    const response = await fetch('https://cropprice-64y3.onrender.com/trend/market-trend', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ crop, location })
    });

    const data = await response.json();

    if (!data.trend_data || !data.insight) {
      alert("Error: " + (data.error || "No trend data received"));
      return;
    }

    const ctx = document.getElementById("trendChart").getContext("2d");
    const labels = data.trend_data.map(d => d.Date);
    const prices = data.trend_data.map(d => d.Price);

    // Destroy previous chart
    if (window.trendChartInstance) {
      window.trendChartInstance.destroy();
    }
window.trendChartInstance = new Chart(ctx, {
  type: "line",
  data: {
    labels: labels,
    datasets: [{
      label: "Price (₹)",
      data: prices,
      borderColor: "#2d5c2f",
      backgroundColor: "rgba(45, 92, 47, 0.2)",
      tension: 0.3,
      fill: true
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        title: {
          display: true,
          text: 'Price in ₹'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  }
});


    // Show AI insight
    const insightBox = document.getElementById("insightBox");
    insightBox.innerText = data.insight;
    insightBox.style.display = "block";

  } catch (error) {
    alert("Something went wrong. Check console.");
    console.error(error);
  }
}



