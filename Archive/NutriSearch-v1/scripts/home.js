// Home page functionality
let selectedStores = [];
let userLocation = null;
let searchSuggestions = [];
let currentStoreFilter = 'all';

// Initialize home page
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    updateQuickStats();
    loadSelectedStores();
    setupLocationSearch();
});

// Sample New Zealand locations data
const nzLocations = [
    { name: 'Auckland Central', region: 'Auckland', coords: [-36.8485, 174.7633] },
    { name: 'Wellington Central', region: 'Wellington', coords: [-41.2865, 174.7762] },
    { name: 'Christchurch Central', region: 'Canterbury', coords: [-43.5321, 172.6362] },
    { name: 'Hamilton Central', region: 'Waikato', coords: [-37.7870, 175.2793] },
    { name: 'Tauranga', region: 'Bay of Plenty', coords: [-37.6878, 176.1651] },
    { name: 'Dunedin Central', region: 'Otago', coords: [-45.8788, 170.5028] },
    { name: 'Palmerston North', region: 'Manawatu-Wanganui', coords: [-40.3523, 175.6082] },
    { name: 'Napier', region: 'Hawke\'s Bay', coords: [-39.4928, 176.9120] },
    { name: 'Nelson', region: 'Nelson', coords: [-41.2706, 173.2840] },
    { name: 'Rotorua', region: 'Bay of Plenty', coords: [-38.1368, 176.2497] },
    { name: 'New Plymouth', region: 'Taranaki', coords: [-39.0556, 174.0752] },
    { name: 'Whangarei', region: 'Northland', coords: [-35.7275, 174.3166] },
    { name: 'Invercargill', region: 'Southland', coords: [-46.4132, 168.3538] },
    { name: 'Gisborne', region: 'Gisborne', coords: [-38.6627, 178.0176] },
    { name: 'Timaru', region: 'Canterbury', coords: [-44.3904, 171.2373] },
    { name: 'Belfast, Christchurch', region: 'Canterbury', coords: [-43.4833, 172.6500] },
    { name: 'Riccarton, Christchurch', region: 'Canterbury', coords: [-43.5394, 172.5619] },
    { name: 'Hornby, Christchurch', region: 'Canterbury', coords: [-43.5167, 172.5167] }
];

// Sample store data for New Zealand
const storeLocations = {
    newworld: [
        { id: 'nw-chch-central', name: 'New World Christchurch Central', address: '123 High Street, Christchurch Central', distance: 0.8, coords: [-43.5321, 172.6362] },
        { id: 'nw-riccarton', name: 'New World Riccarton', address: '456 Riccarton Road, Riccarton', distance: 3.2, coords: [-43.5394, 172.5619] },
        { id: 'nw-belfast', name: 'New World Belfast', address: '789 Main North Road, Belfast', distance: 5.1, coords: [-43.4833, 172.6500] }
    ],
    paknsave: [
        { id: 'pns-moorhouse', name: 'PAK\'nSAVE Moorhouse', address: '321 Moorhouse Avenue, Christchurch', distance: 1.2, coords: [-43.5321, 172.6362] },
        { id: 'pns-riccarton', name: 'PAK\'nSAVE Riccarton', address: '654 Riccarton Road, Riccarton', distance: 3.5, coords: [-43.5394, 172.5619] },
        { id: 'pns-rangiora', name: 'PAK\'nSAVE Rangiora', address: '987 High Street, Rangiora', distance: 8.7, coords: [-43.3056, 172.5944] }
    ],
    countdown: [
        { id: 'cd-city', name: 'Countdown City', address: '111 Cashel Street, Christchurch Central', distance: 0.5, coords: [-43.5321, 172.6362] },
        { id: 'cd-riccarton', name: 'Countdown Riccarton', address: '222 Riccarton Road, Riccarton', distance: 3.0, coords: [-43.5394, 172.5619] },
        { id: 'cd-hornby', name: 'Countdown Hornby', address: '333 Main South Road, Hornby', distance: 6.8, coords: [-43.5167, 172.5167] }
    ],
    freshchoice: [
        { id: 'fc-merivale', name: 'FreshChoice Merivale', address: '444 Papanui Road, Merivale', distance: 2.1, coords: [-43.5157, 172.6285] },
        { id: 'fc-barrington', name: 'FreshChoice Barrington', address: '555 Barrington Street, Spreydon', distance: 2.8, coords: [-43.5557, 172.6085] },
        { id: 'fc-new-brighton', name: 'FreshChoice New Brighton', address: '666 New Brighton Road, New Brighton', distance: 7.2, coords: [-43.5167, 172.7167] }
    ]
};

// Load user data from localStorage
function loadUserData() {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
        userLocation = JSON.parse(savedLocation);
        updateCurrentLocationDisplay();
    }
    
    const savedStores = localStorage.getItem('selectedStores');
    if (savedStores) {
        selectedStores = JSON.parse(savedStores);
    }
}

// Update quick stats on home page
function updateQuickStats() {
    const profiles = JSON.parse(localStorage.getItem('nutritionProfiles') || '[]');
    const meals = JSON.parse(localStorage.getItem('savedMeals') || '[]');
    const stores = JSON.parse(localStorage.getItem('selectedStores') || '[]');
    
    document.getElementById('profileCount').textContent = profiles.length;
    document.getElementById('mealCount').textContent = meals.length;
    document.getElementById('storeCount').textContent = stores.length;
}

// Setup location search functionality
function setupLocationSearch() {
    const searchInput = document.getElementById('locationSearch');
    const suggestionsDiv = document.getElementById('searchSuggestions');
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        if (query.length < 2) {
            suggestionsDiv.style.display = 'none';
            return;
        }
        
        const matches = nzLocations.filter(location => 
            location.name.toLowerCase().includes(query) ||
            location.region.toLowerCase().includes(query)
        ).slice(0, 5);
        
        if (matches.length > 0) {
            suggestionsDiv.innerHTML = matches.map(location => `
                <div class="suggestion-item" onclick="selectLocation('${location.name}', ${location.coords[0]}, ${location.coords[1]})">
                    <strong>${location.name}</strong>
                    <small>${location.region}</small>
                </div>
            `).join('');
            suggestionsDiv.style.display = 'block';
        } else {
            suggestionsDiv.style.display = 'none';
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(event) {
        if (!searchInput.contains(event.target) && !suggestionsDiv.contains(event.target)) {
            suggestionsDiv.style.display = 'none';
        }
    });
}

// Select location from suggestions
function selectLocation(name, lat, lng) {
    userLocation = { name, coords: [lat, lng] };
    document.getElementById('locationSearch').value = name;
    document.getElementById('searchSuggestions').style.display = 'none';
    updateCurrentLocationDisplay();
}

// Update current location display
function updateCurrentLocationDisplay() {
    const displayDiv = document.getElementById('currentLocationDisplay');
    if (userLocation) {
        displayDiv.innerHTML = `
            <div class="current-location-info">
                <h4>📍 Current Location</h4>
                <p>${userLocation.name}</p>
                <button class="btn-secondary btn-small" onclick="clearLocation()">Change Location</button>
            </div>
        `;
    } else {
        displayDiv.innerHTML = '';
    }
}

// Clear current location
function clearLocation() {
    userLocation = null;
    document.getElementById('locationSearch').value = '';
    document.getElementById('currentLocationDisplay').innerHTML = '';
    localStorage.removeItem('userLocation');
}

// Search for stores near location
function searchStores() {
    if (!userLocation) {
        alert('Please select a location first');
        return;
    }
    
    // Calculate distances and display stores
    displayStores();
}

// Display stores in modal
function displayStores() {
    const storesList = document.getElementById('storesList');
    const allStores = getAllStoresForDisplay();
    
    if (allStores.length === 0) {
        storesList.innerHTML = `
            <div class="no-stores">
                <p>No stores found in this area. Try searching for a different location.</p>
            </div>
        `;
        return;
    }
    
    storesList.innerHTML = allStores.map(store => `
        <div class="store-item ${selectedStores.some(s => s.id === store.id) ? 'selected' : ''}" onclick="toggleStoreSelection('${store.id}')">
            <div class="store-info">
                <div class="store-header">
                    <h4>${store.name}</h4>
                    <div class="store-brand ${store.brand}">${store.brand.toUpperCase()}</div>
                </div>
                <p class="store-address">${store.address}</p>
                <div class="store-meta">
                    <span class="store-distance">📍 ${store.distance}km away</span>
                    <span class="store-hours">🕒 Open until 9pm</span>
                </div>
            </div>
            <div class="store-selection">
                <div class="checkbox ${selectedStores.some(s => s.id === store.id) ? 'checked' : ''}">
                    ${selectedStores.some(s => s.id === store.id) ? '✓' : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Get all stores for display based on current filter
function getAllStoresForDisplay() {
    let storesToShow = [];
    
    if (currentStoreFilter === 'all') {
        // Combine all stores
        Object.entries(storeLocations).forEach(([brand, stores]) => {
            storesToShow.push(...stores.map(store => ({ ...store, brand })));
        });
    } else {
        // Show specific brand
        const brandStores = storeLocations[currentStoreFilter] || [];
        storesToShow = brandStores.map(store => ({ ...store, brand: currentStoreFilter }));
    }
    
    // Sort by distance
    return storesToShow.sort((a, b) => a.distance - b.distance);
}

// Show store tab
function showStoreTab(tabName) {
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });
    
    document.querySelector(`[onclick="showStoreTab('${tabName}')"]`).classList.add('active');
    document.querySelector(`[onclick="showStoreTab('${tabName}')"]`).setAttribute('aria-selected', 'true');
    
    currentStoreFilter = tabName;
    displayStores();
}

// Toggle store selection
function toggleStoreSelection(storeId) {
    const allStores = getAllStoresForDisplay();
    const store = allStores.find(s => s.id === storeId);
    
    if (!store) return;
    
    const existingIndex = selectedStores.findIndex(s => s.id === storeId);
    
    if (existingIndex >= 0) {
        // Remove from selection
        selectedStores.splice(existingIndex, 1);
    } else {
        // Add to selection
        selectedStores.push({
            id: store.id,
            name: store.name,
            brand: store.brand,
            address: store.address,
            distance: store.distance,
            coords: store.coords
        });
    }
    
    // Update display
    displayStores();
}

// Load selected stores on page load
function loadSelectedStores() {
    const saved = localStorage.getItem('selectedStores');
    if (saved) {
        selectedStores = JSON.parse(saved);
    }
}

// Save selected stores
function saveSelectedStores() {
    if (selectedStores.length === 0) {
        alert('Please select at least one store');
        return;
    }
    
    // Save to localStorage
    localStorage.setItem('selectedStores', JSON.stringify(selectedStores));
    localStorage.setItem('userLocation', JSON.stringify(userLocation));
    
    // Update quick stats
    updateQuickStats();
    
    // Close modal
    closeLocationModal();
    
    alert(`${selectedStores.length} store(s) saved successfully!`);
}

// Show location modal
function showLocationModal() {
    document.getElementById('locationModal').style.display = 'block';
    
    // If user has location, show stores immediately
    if (userLocation) {
        displayStores();
    }
}

// Close location modal
function closeLocationModal() {
    document.getElementById('locationModal').style.display = 'none';
}

// Navigation function
function navigateTo(url) {
    window.location.href = url;
}

// Keyboard navigation for cards
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        const target = event.target;
        
        if (target.classList.contains('primary-card') || target.classList.contains('secondary-card')) {
            event.preventDefault();
            target.click();
        }
    }
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('locationModal');
    if (event.target === modal) {
        closeLocationModal();
    }
};

// Handle store search on Enter key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && event.target.id === 'locationSearch') {
        const suggestions = document.querySelectorAll('.suggestion-item');
        if (suggestions.length > 0) {
            suggestions[0].click();
        }
    }
});

// Auto-search stores when location is selected
function selectLocationAndSearch(name, lat, lng) {
    selectLocation(name, lat, lng);
    searchStores();
}

// Update location search to auto-search
const originalSelectLocation = selectLocation;
selectLocation = function(name, lat, lng) {
    originalSelectLocation(name, lat, lng);
    if (document.getElementById('locationModal').style.display === 'block') {
        setTimeout(searchStores, 100);
    }
};

// Initialize stats update interval
setInterval(updateQuickStats, 30000); // Update every 30 seconds