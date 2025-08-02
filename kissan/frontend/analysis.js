// Sample Data for 2026
const PreData = [
    {
        "Crop": "Wheat",
        "Year": "2026",
        "Data": [
            {"Month": "January", "AveragePrice": "2450", "PriceChangeIndicator": "+2.5%"},
            {"Month": "February", "AveragePrice": "2500", "PriceChangeIndicator": "+2.0%"},
            {"Month": "March", "AveragePrice": "2480", "PriceChangeIndicator": "-0.8%"},
            {"Month": "April", "AveragePrice": "2550", "PriceChangeIndicator": "+2.8%"},
            {"Month": "May", "AveragePrice": "2600", "PriceChangeIndicator": "+2.0%"},
            {"Month": "June", "AveragePrice": "2580", "PriceChangeIndicator": "-0.8%"}
        ]
    },
    {
        "Crop": "Rice",
        "Year": "2026",
        "Data": [
            {"Month": "January", "AveragePrice": "3200", "PriceChangeIndicator": "+1.5%"},
            {"Month": "February", "AveragePrice": "3250", "PriceChangeIndicator": "+1.6%"},
            {"Month": "March", "AveragePrice": "3300", "PriceChangeIndicator": "+1.5%"},
            {"Month": "April", "AveragePrice": "3350", "PriceChangeIndicator": "+1.5%"},
            {"Month": "May", "AveragePrice": "3400", "PriceChangeIndicator": "+1.5%"},
            {"Month": "June", "AveragePrice": "3450", "PriceChangeIndicator": "+1.5%"}
        ]
    },
    {
        "Crop": "Corn",
        "Year": "2026",
        "Data": [
            {"Month": "January", "AveragePrice": "1800", "PriceChangeIndicator": "+3.0%"},
            {"Month": "February", "AveragePrice": "1850", "PriceChangeIndicator": "+2.8%"},
            {"Month": "March", "AveragePrice": "1900", "PriceChangeIndicator": "+2.7%"},
            {"Month": "April", "AveragePrice": "1950", "PriceChangeIndicator": "+2.6%"},
            {"Month": "May", "AveragePrice": "2000", "PriceChangeIndicator": "+2.6%"},
            {"Month": "June", "AveragePrice": "2050", "PriceChangeIndicator": "+2.5%"}
        ]
    },
    {
        "Crop": "Soybean",
        "Year": "2026",
        "Data": [
            {"Month": "January", "AveragePrice": "4200", "PriceChangeIndicator": "-1.2%"},
            {"Month": "February", "AveragePrice": "4150", "PriceChangeIndicator": "-1.2%"},
            {"Month": "March", "AveragePrice": "4100", "PriceChangeIndicator": "-1.2%"},
            {"Month": "April", "AveragePrice": "4050", "PriceChangeIndicator": "-1.2%"},
            {"Month": "May", "AveragePrice": "4000", "PriceChangeIndicator": "-1.2%"},
            {"Month": "June", "AveragePrice": "3950", "PriceChangeIndicator": "-1.3%"}
        ]
    },
    {
        "Crop": "Cotton",
        "Year": "2026",
        "Data": [
            {"Month": "January", "AveragePrice": "5800", "PriceChangeIndicator": "+0.5%"},
            {"Month": "February", "AveragePrice": "5850", "PriceChangeIndicator": "+0.9%"},
            {"Month": "March", "AveragePrice": "5900", "PriceChangeIndicator": "+0.9%"},
            {"Month": "April", "AveragePrice": "5950", "PriceChangeIndicator": "+0.8%"},
            {"Month": "May", "AveragePrice": "6000", "PriceChangeIndicator": "+0.8%"},
            {"Month": "June", "AveragePrice": "6050", "PriceChangeIndicator": "+0.8%"}
        ]
    },
    {
        "Crop": "Potato",
        "Year": "2026",
        "Data": [
            {"Month": "January", "AveragePrice": "1200", "PriceChangeIndicator": "+5.0%"},
            {"Month": "February", "AveragePrice": "1250", "PriceChangeIndicator": "+4.2%"},
            {"Month": "March", "AveragePrice": "1300", "PriceChangeIndicator": "+4.0%"},
            {"Month": "April", "AveragePrice": "1350", "PriceChangeIndicator": "+3.8%"},
            {"Month": "May", "AveragePrice": "1400", "PriceChangeIndicator": "+3.7%"},
            {"Month": "June", "AveragePrice": "1450", "PriceChangeIndicator": "+3.6%"}
        ]
    }
];

const TopGainers = [
    {"Crop": "Potato", "Price": "1450", "Change": "+5.2%"},
    {"Crop": "Corn", "Price": "2050", "Change": "+4.8%"},
    {"Crop": "Wheat", "Price": "2600", "Change": "+4.5%"},
    {"Crop": "Rice", "Price": "3450", "Change": "+3.2%"},
    {"Crop": "Cotton", "Price": "6050", "Change": "+1.5%"}
];

const TopLosers = [
    {"Crop": "Soybean", "Price": "3950", "Change": "-2.8%"},
    {"Crop": "Barley", "Price": "1650", "Change": "-1.5%"},
    {"Crop": "Mustard", "Price": "4800", "Change": "-1.2%"},
    {"Crop": "Chickpea", "Price": "5200", "Change": "-0.8%"},
    {"Crop": "Lentil", "Price": "3800", "Change": "-0.5%"}
];

// Function to get price change class
function getPriceChangeClass(change) {
    if (!change) return '';
    const numChange = parseFloat(change);
    if (numChange > 0) return 'positive-change';
    if (numChange < 0) return 'negative-change';
    if (numChange === 0) return 'no-change';
    return '';
}

// Function to get crop details
function getCropDetails(cropName) {
    return PreData.filter(item => item.Crop === cropName);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Populate Top Gainers table
    const topGainersTable = document.getElementById('top-gainers-table');
    TopGainers.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="crop-name">${item.Crop}</td>
            <td class="text-center price-value">${item.Price}</td>
            <td class="text-center ${getPriceChangeClass(item.Change)}">${item.Change}</td>
        `;
        topGainersTable.appendChild(row);
    });

    // Populate Top Losers table
    const topLosersTable = document.getElementById('top-losers-table');
    TopLosers.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="crop-name">${item.Crop}</td>
            <td class="text-center price-value">${item.Price}</td>
            <td class="text-center ${getPriceChangeClass(item.Change)}">${item.Change}</td>
        `;
        topLosersTable.appendChild(row);
    });

    // Populate Crops Grid
    const cropsGrid = document.getElementById('crops-grid');
    const uniqueCrops = [...new Set(PreData.map(item => item.Crop))];
    uniqueCrops.forEach(crop => {
        const cropCard = document.createElement('div');
        cropCard.className = 'crop-card';
        cropCard.innerHTML = `
            <div class="crop-icon">🌱</div>
            <h3>${crop}</h3>
            <div class="crop-status">Click for details</div>
        `;
        cropCard.addEventListener('click', () => showCropDetails(crop));
        cropsGrid.appendChild(cropCard);
    });

    // Close button event
    document.getElementById('close-details').addEventListener('click', () => {
        document.getElementById('crop-details').style.display = 'none';
    });
});

// Show crop details
function showCropDetails(cropName) {
    const details = getCropDetails(cropName);
    const detailsTable = document.getElementById('crop-details-table');
    const cropNameElement = document.getElementById('selected-crop-name');
    
    // Clear previous details
    detailsTable.innerHTML = '';
    
    // Set crop name
    cropNameElement.textContent = cropName;
    
    // Populate details table
    details.forEach(item => {
        item.Data.forEach(data => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="year-cell">${item.Year}</td>
                <td class="month-cell">${data.Month}</td>
                <td class="text-center price-value">₹${data.AveragePrice}</td>
                <td class="text-center ${getPriceChangeClass(data.PriceChangeIndicator)}">
                    ${data.PriceChangeIndicator}
                </td>
            `;
            detailsTable.appendChild(row);
        });
    });
    
    // Show details section
    document.getElementById('crop-details').style.display = 'block';
    
    // Scroll to details
    document.getElementById('crop-details').scrollIntoView({ behavior: 'smooth' });
}

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
