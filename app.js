// Model coefficients from trained linear regression
const MODEL = {
    intercept: 2911.839074137213,
    coefficients: {
        toWork: -188.08420316877394,
        toAirports: 46.45107048107582,
        cleanliness: 125.03736360661765,
        size: 150.01256007265417,
        amenity: 86.13017711210327,
        location: 65.41713968844476,
        additionalSpace: -70.90916699013869,
        leasePeriod: -115.71234950793077,
        sharehouse: -262.45995780072616
    }
};

// Feature definitions
const FEATURES = {
    toWork: {
        name: 'Commute to Work',
        options: ['Short walk', 'Long walk/short bike', 'Long bike/short subway', 'Mid subway', 'Mid bus/long subway'],
        min: 1,
        max: 5
    },
    toAirports: {
        name: 'Airport Access',
        options: ['Short taxi (15min)', 'Med taxi (25min)', 'Long taxi (35min+)'],
        min: 1,
        max: 3
    },
    cleanliness: {
        name: 'Cleanliness',
        options: ['Dank', "Pia's", 'Veronica', 'Southbank'],
        min: 1,
        max: 4
    },
    size: {
        name: 'Size',
        options: ['Small studio', 'Large studio', '1 bedroom', '2 bedroom'],
        min: 1,
        max: 4
    },
    amenity: {
        name: 'Amenities',
        options: ['None', 'One', 'Two', 'Three', 'Four+'],
        min: 1,
        max: 5
    },
    location: {
        name: 'Location Vibe',
        options: ['Quiet parklike', 'Dodgy', 'Hip funky', 'Boring', 'Noisy'],
        min: 1,
        max: 5
    },
    additionalSpace: {
        name: 'Additional Space',
        options: ['None', 'Fire escape', 'Balcony', 'Yard/roof'],
        min: 1,
        max: 4
    },
    leasePeriod: {
        name: 'Lease Period',
        options: ['Short (1-3mo)', 'Mid (5-8mo)', '1 year+'],
        min: 1,
        max: 3
    },
    sharehouse: {
        name: 'Sharehouse',
        options: ['No', 'Yes'],
        min: 1,
        max: 2
    }
};

// Location reordering (from notebook)
const LOCATION_REMAP = {1: 3, 2: 4, 3: 2, 4: 5, 5: 1};

// State management
let apartments = [];
let apartmentCounter = 0;
let barChart = null;
let radarChart = null;

// Calculate predicted score
function calculateScore(apartment) {
    let score = MODEL.intercept;
    
    // Apply location remapping
    const locationValue = LOCATION_REMAP[apartment.location] || apartment.location;
    
    score += MODEL.coefficients.toWork * apartment.toWork;
    score += MODEL.coefficients.toAirports * apartment.toAirports;
    score += MODEL.coefficients.cleanliness * apartment.cleanliness;
    score += MODEL.coefficients.size * apartment.size;
    score += MODEL.coefficients.amenity * apartment.amenity;
    score += MODEL.coefficients.location * locationValue;
    score += MODEL.coefficients.additionalSpace * apartment.additionalSpace;
    score += MODEL.coefficients.leasePeriod * apartment.leasePeriod;
    score += MODEL.coefficients.sharehouse * apartment.sharehouse;
    
    return Math.round(score);
}

// Create default apartment
function createDefaultApartment() {
    apartmentCounter++;
    return {
        id: apartmentCounter,
        name: `Apartment ${apartmentCounter}`,
        toWork: 2,
        toAirports: 2,
        cleanliness: 2,
        size: 2,
        amenity: 3,
        location: 3,
        additionalSpace: 2,
        leasePeriod: 2,
        sharehouse: 1
    };
}

// Parse example data
function parseExampleData() {
    const examples = [
        { features: '221241232', price: 2400 },
        { features: '412115232', price: 2200 },
        { features: '314353232', price: 2700 },
        { features: '222121131', price: 2650 },
        { features: '533235311', price: 2500 },
        { features: '134343432', price: 3200 },
        { features: '331243431', price: 2300 }
    ];
    
    return examples.map((ex, idx) => {
        const f = ex.features;
        return {
            id: ++apartmentCounter,
            name: `Example ${idx + 1} ($${ex.price})`,
            toWork: parseInt(f[0]),
            toAirports: parseInt(f[1]),
            cleanliness: parseInt(f[2]),
            size: parseInt(f[3]),
            amenity: parseInt(f[4]),
            location: parseInt(f[5]),
            additionalSpace: parseInt(f[6]),
            leasePeriod: parseInt(f[7]),
            sharehouse: parseInt(f[8])
        };
    });
}

// Render apartment card
function renderApartmentCard(apartment) {
    const score = calculateScore(apartment);
    
    const card = document.createElement('div');
    card.className = 'apartment-card';
    card.dataset.id = apartment.id;
    
    let featuresHTML = '';
    for (const [key, config] of Object.entries(FEATURES)) {
        const value = apartment[key];
        const displayValue = config.options[value - 1];
        
        featuresHTML += `
            <div class="feature-group">
                <div class="feature-label">
                    <span>${config.name}</span>
                    <span class="feature-value">${displayValue}</span>
                </div>
                <input type="range" 
                       min="${config.min}" 
                       max="${config.max}" 
                       value="${value}"
                       data-apartment-id="${apartment.id}"
                       data-feature="${key}">
            </div>
        `;
    }
    
    card.innerHTML = `
        <div class="apartment-header">
            <div class="apartment-name">${apartment.name}</div>
            <button class="remove-btn" data-id="${apartment.id}">Remove</button>
        </div>
        <div class="score-display">
            <div class="score-value">$${score.toLocaleString()}</div>
            <div class="score-label">Predicted Value</div>
        </div>
        ${featuresHTML}
    `;
    
    return card;
}

// Render all apartments
function renderApartments() {
    const container = document.getElementById('apartments');
    container.innerHTML = '';
    
    if (apartments.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No apartments yet</h3>
                <p>Add an apartment or load example data to get started</p>
            </div>
        `;
        return;
    }
    
    apartments.forEach(apt => {
        container.appendChild(renderApartmentCard(apt));
    });
    
    // Attach event listeners
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        slider.addEventListener('input', handleSliderChange);
    });
    
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            removeApartment(parseInt(btn.dataset.id));
        });
    });
}

// Handle slider changes
function handleSliderChange(e) {
    const apartmentId = parseInt(e.target.dataset.apartmentId);
    const feature = e.target.dataset.feature;
    const value = parseInt(e.target.value);
    
    const apartment = apartments.find(a => a.id === apartmentId);
    if (apartment) {
        apartment[feature] = value;
        updateApartment(apartmentId);
    }
}

// Update single apartment
function updateApartment(id) {
    const apartment = apartments.find(a => a.id === id);
    if (!apartment) return;
    
    const card = document.querySelector(`.apartment-card[data-id="${id}"]`);
    if (card) {
        const score = calculateScore(apartment);
        card.querySelector('.score-value').textContent = `$${score.toLocaleString()}`;
        
        // Update feature labels
        card.querySelectorAll('input[type="range"]').forEach(slider => {
            const feature = slider.dataset.feature;
            const value = apartment[feature];
            const label = card.querySelector(`input[data-feature="${feature}"]`)
                             .parentElement.querySelector('.feature-value');
            label.textContent = FEATURES[feature].options[value - 1];
        });
    }
    
    updateVisualizations();
}

// Add apartment
function addApartment() {
    apartments.push(createDefaultApartment());
    renderApartments();
    updateVisualizations();
}

// Remove apartment
function removeApartment(id) {
    apartments = apartments.filter(a => a.id !== id);
    renderApartments();
    updateVisualizations();
}

// Load example data
function loadExamples() {
    if (apartments.length > 0) {
        if (!confirm('This will replace existing apartments. Continue?')) {
            return;
        }
    }
    apartments = parseExampleData();
    renderApartments();
    updateVisualizations();
}

// Clear all
function clearAll() {
    if (apartments.length === 0) return;
    if (!confirm('Remove all apartments?')) return;
    
    apartments = [];
    renderApartments();
    updateVisualizations();
}

// Update visualizations
function updateVisualizations() {
    updateBarChart();
    updateRadarChart();
    updateRanking();
}

// Update bar chart
function updateBarChart() {
    const ctx = document.getElementById('barChart');
    
    if (apartments.length === 0) {
        if (barChart) barChart.destroy();
        barChart = null;
        return;
    }
    
    const data = {
        labels: apartments.map(a => a.name),
        datasets: [{
            label: 'Predicted Value ($)',
            data: apartments.map(a => calculateScore(a)),
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2
        }]
    };
    
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: { color: '#e8eaed' }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: { color: '#9aa0a6' },
                    grid: { color: '#374151' }
                },
                x: {
                    ticks: { color: '#9aa0a6' },
                    grid: { color: '#374151' }
                }
            }
        }
    };
    
    if (barChart) {
        barChart.destroy();
    }
    barChart = new Chart(ctx, config);
}

// Update radar chart
function updateRadarChart() {
    const ctx = document.getElementById('radarChart');
    
    if (apartments.length === 0) {
        if (radarChart) radarChart.destroy();
        radarChart = null;
        return;
    }
    
    const featureKeys = Object.keys(FEATURES);
    const labels = featureKeys.map(k => FEATURES[k].name);
    
    const datasets = apartments.map((apt, idx) => {
        const colors = [
            'rgba(59, 130, 246, 0.6)',
            'rgba(16, 185, 129, 0.6)',
            'rgba(239, 68, 68, 0.6)',
            'rgba(139, 92, 246, 0.6)',
            'rgba(245, 158, 11, 0.6)',
            'rgba(236, 72, 153, 0.6)',
            'rgba(34, 211, 238, 0.6)'
        ];
        
        return {
            label: apt.name,
            data: featureKeys.map(k => apt[k]),
            backgroundColor: colors[idx % colors.length],
            borderColor: colors[idx % colors.length].replace('0.6', '1'),
            borderWidth: 2
        };
    });
    
    const config = {
        type: 'radar',
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: { color: '#e8eaed' }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    ticks: { color: '#9aa0a6' },
                    grid: { color: '#374151' },
                    pointLabels: { color: '#9aa0a6' }
                }
            }
        }
    };
    
    if (radarChart) {
        radarChart.destroy();
    }
    radarChart = new Chart(ctx, config);
}

// Update ranking table
function updateRanking() {
    const container = document.getElementById('rankingTable');
    
    if (apartments.length === 0) {
        container.innerHTML = '<p style="color: #9aa0a6;">No apartments to rank</p>';
        return;
    }
    
    const sorted = [...apartments]
        .map(a => ({ ...a, score: calculateScore(a) }))
        .sort((a, b) => b.score - a.score);
    
    container.innerHTML = sorted.map((apt, idx) => `
        <div class="ranking-item">
            <div class="ranking-position">#${idx + 1}</div>
            <div class="ranking-name">${apt.name}</div>
            <div class="ranking-score">$${apt.score.toLocaleString()}</div>
        </div>
    `).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addApartment').addEventListener('click', addApartment);
    document.getElementById('loadExamples').addEventListener('click', loadExamples);
    document.getElementById('clearAll').addEventListener('click', clearAll);
    
    // Load examples by default so portfolio visitors see it working
    loadExamples();
});
