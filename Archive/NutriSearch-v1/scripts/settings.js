// Settings page functionality
let currentProfiles = [];
let filteredProfiles = [];
let confirmAction = null;
let selectedProfileId = null;

// Initialize settings page
document.addEventListener('DOMContentLoaded', function() {
    loadProfiles();
    updateStorageUsage();
    initializeDarkModeToggle();
    calculateStorageUsage();
});

// Load and display profiles
function loadProfiles() {
    const profiles = JSON.parse(localStorage.getItem('nutritionProfiles') || '[]');
    currentProfiles = profiles.length > 0 ? profiles : getDefaultProfiles();
    filteredProfiles = [...currentProfiles];
    displayProfiles();
}

// Default profiles for initial setup
function getDefaultProfiles() {
    return [
        {
            id: 'keto-default',
            name: 'Keto Diet',
            description: 'Low carb, high fat ketogenic diet',
            calories: { value: 2000, isMax: true },
            protein: { value: 80, isMax: false },
            carbs: { value: 20, isMax: true },
            fat: { value: 150, isMax: false },
            sugar: { value: 5, isMax: true },
            fiber: { value: 25, isMax: false },
            sodium: { value: 2300, isMax: true },
            satfat: { value: 50, isMax: true },
            cholesterol: { value: 300, isMax: true },
            dietary: 'keto',
            category: '',
            createdAt: new Date().toISOString()
        },
        {
            id: 'vlcd-default',
            name: 'VLCD',
            description: 'Very Low Calorie Diet for weight loss',
            calories: { value: 800, isMax: true },
            protein: { value: 60, isMax: false },
            carbs: { value: 100, isMax: true },
            fat: { value: 20, isMax: true },
            sugar: { value: 10, isMax: true },
            fiber: { value: 20, isMax: false },
            sodium: { value: 1500, isMax: true },
            satfat: { value: 7, isMax: true },
            cholesterol: { value: 200, isMax: true },
            dietary: '',
            category: '',
            createdAt: new Date().toISOString()
        },
        {
            id: 'mediterranean-default',
            name: 'Mediterranean',
            description: 'Heart-healthy Mediterranean diet',
            calories: { value: 2200, isMax: true },
            protein: { value: 70, isMax: false },
            carbs: { value: 250, isMax: true },
            fat: { value: 80, isMax: false },
            sugar: { value: 30, isMax: true },
            fiber: { value: 35, isMax: false },
            sodium: { value: 2000, isMax: true },
            satfat: { value: 20, isMax: true },
            cholesterol: { value: 250, isMax: true },
            dietary: '',
            category: '',
            createdAt: new Date().toISOString()
        }
    ];
}

// Display profiles in the list
function displayProfiles() {
    const profilesList = document.getElementById('profilesList');
    
    if (filteredProfiles.length === 0) {
        profilesList.innerHTML = `
            <div class="no-profiles">
                <p>No profiles found. Create your first nutritional profile!</p>
            </div>
        `;
        return;
    }

    profilesList.innerHTML = filteredProfiles.map(profile => `
        <div class="profile-card" onclick="showProfileDetails('${profile.id}')">
            <div class="profile-header">
                <h4>${profile.name}</h4>
                <div class="profile-actions">
                    <button class="btn-icon" onclick="event.stopPropagation(); editProfile('${profile.id}')" title="Edit Profile">✏️</button>
                    <button class="btn-icon" onclick="event.stopPropagation(); confirmDeleteProfile('${profile.id}')" title="Delete Profile">🗑️</button>
                </div>
            </div>
            ${profile.description ? `<p class="profile-description">${profile.description}</p>` : ''}
            <div class="profile-stats">
                <span class="stat">Calories: ${profile.calories?.value || 0} ${profile.calories?.isMax ? 'max' : 'min'}</span>
                <span class="stat">Protein: ${profile.protein?.value || 0}g ${profile.protein?.isMax ? 'max' : 'min'}</span>
                <span class="stat">Carbs: ${profile.carbs?.value || 0}g ${profile.carbs?.isMax ? 'max' : 'min'}</span>
            </div>
            <div class="profile-meta">
                <small>Created: ${new Date(profile.createdAt).toLocaleDateString()}</small>
            </div>
        </div>
    `).join('');
}

// Sort profiles
function sortProfiles() {
    const sortBy = document.getElementById('calorieSort').value;
    
    if (sortBy === 'none') {
        filteredProfiles = [...currentProfiles];
    } else if (sortBy === 'low-high') {
        filteredProfiles.sort((a, b) => (a.calories?.value || 0) - (b.calories?.value || 0));
    } else if (sortBy === 'high-low') {
        filteredProfiles.sort((a, b) => (b.calories?.value || 0) - (a.calories?.value || 0));
    }
    
    displayProfiles();
}

// Filter profiles by calorie range
function filterProfiles() {
    const minCalories = parseInt(document.getElementById('minCalories').value) || 0;
    const maxCalories = parseInt(document.getElementById('maxCalories').value) || Infinity;
    
    filteredProfiles = currentProfiles.filter(profile => {
        const calories = profile.calories?.value || 0;
        return calories >= minCalories && calories <= maxCalories;
    });
    
    displayProfiles();
}

// Clear filters
function clearFiltersSettings() {
    document.getElementById('calorieSort').value = 'none';
    document.getElementById('minCalories').value = '';
    document.getElementById('maxCalories').value = '';
    filteredProfiles = [...currentProfiles];
    displayProfiles();
}

// Show profile details modal
function showProfileDetails(profileId) {
    const profile = currentProfiles.find(p => p.id === profileId);
    if (!profile) return;
    
    selectedProfileId = profileId;
    document.getElementById('profileDetailTitle').textContent = profile.name;
    
    const content = document.getElementById('profileDetailContent');
    content.innerHTML = `
        <div class="profile-detail-grid">
            ${profile.description ? `<div class="detail-row"><strong>Description:</strong> ${profile.description}</div>` : ''}
            <div class="detail-row"><strong>Calories:</strong> ${profile.calories?.value || 0} kcal (${profile.calories?.isMax ? 'maximum' : 'minimum'})</div>
            <div class="detail-row"><strong>Protein:</strong> ${profile.protein?.value || 0}g (${profile.protein?.isMax ? 'maximum' : 'minimum'})</div>
            <div class="detail-row"><strong>Carbohydrates:</strong> ${profile.carbs?.value || 0}g (${profile.carbs?.isMax ? 'maximum' : 'minimum'})</div>
            <div class="detail-row"><strong>Fat:</strong> ${profile.fat?.value || 0}g (${profile.fat?.isMax ? 'maximum' : 'minimum'})</div>
            <div class="detail-row"><strong>Sugar:</strong> ${profile.sugar?.value || 0}g (${profile.sugar?.isMax ? 'maximum' : 'minimum'})</div>
            <div class="detail-row"><strong>Fiber:</strong> ${profile.fiber?.value || 0}g (${profile.fiber?.isMax ? 'maximum' : 'minimum'})</div>
            <div class="detail-row"><strong>Sodium:</strong> ${profile.sodium?.value || 0}mg (${profile.sodium?.isMax ? 'maximum' : 'minimum'})</div>
            <div class="detail-row"><strong>Saturated Fat:</strong> ${profile.satfat?.value || 0}g (${profile.satfat?.isMax ? 'maximum' : 'minimum'})</div>
            <div class="detail-row"><strong>Cholesterol:</strong> ${profile.cholesterol?.value || 0}mg (${profile.cholesterol?.isMax ? 'maximum' : 'minimum'})</div>
            ${profile.dietary ? `<div class="detail-row"><strong>Dietary:</strong> ${profile.dietary}</div>` : ''}
            ${profile.category ? `<div class="detail-row"><strong>Category:</strong> ${profile.category}</div>` : ''}
            <div class="detail-row"><strong>Created:</strong> ${new Date(profile.createdAt).toLocaleDateString()}</div>
        </div>
    `;
    
    document.getElementById('profileDetailModal').style.display = 'block';
}

// Close profile detail modal
function closeProfileDetailModal() {
    document.getElementById('profileDetailModal').style.display = 'none';
    selectedProfileId = null;
}

// Edit profile (redirect to nutritional search)
function editProfile(profileId = null) {
    const id = profileId || selectedProfileId;
    if (id) {
        localStorage.setItem('editProfileId', id);
        window.location.href = '../pages/nutritional-search.html';
    }
}

// Delete profile
function deleteProfile() {
    if (selectedProfileId) {
        confirmDeleteProfile(selectedProfileId);
    }
}

// Confirm delete profile
function confirmDeleteProfile(profileId) {
    selectedProfileId = profileId;
    const profile = currentProfiles.find(p => p.id === profileId);
    showConfirmModal(
        `Are you sure you want to delete "${profile.name}"? This action cannot be undone.`,
        () => {
            currentProfiles = currentProfiles.filter(p => p.id !== profileId);
            localStorage.setItem('nutritionProfiles', JSON.stringify(currentProfiles));
            loadProfiles();
            closeProfileDetailModal();
            closeConfirmModal();
        }
    );
}

// Confirm clear all profiles
function confirmClearAllProfiles() {
    showConfirmModal(
        'Are you sure you want to delete ALL profiles? This action cannot be undone.',
        () => {
            localStorage.removeItem('nutritionProfiles');
            currentProfiles = [];
            filteredProfiles = [];
            displayProfiles();
            closeConfirmModal();
        }
    );
}

// Show confirmation modal
function showConfirmModal(message, action) {
    document.getElementById('confirmMessage').textContent = message;
    confirmAction = action;
    document.getElementById('confirmModal').style.display = 'block';
}

// Close confirmation modal
function closeConfirmModal() {
    document.getElementById('confirmModal').style.display = 'none';
    confirmAction = null;
}

// Perform confirmed action
function performConfirmAction() {
    if (confirmAction) {
        confirmAction();
    }
}

// Initialize dark mode toggle
function initializeDarkModeToggle() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const isDarkMode = localStorage.getItem('theme') === 'dark';
    
    darkModeToggle.checked = isDarkMode;
    
    if (isDarkMode) {
        document.body.classList.add('dark-theme');
    }
}

// Toggle dark mode
function toggleDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const isDarkMode = darkModeToggle.checked;
    
    if (isDarkMode) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    }
    
    // Also update theme toggle button text
    updateThemeToggleText();
}

// Update theme toggle text
function updateThemeToggleText() {
    const themeToggle = document.querySelector('.theme-toggle');
    const isDarkMode = document.body.classList.contains('dark-theme');
    if (themeToggle) {
        themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    }
}

// Export data
function exportData() {
    const data = {
        nutritionProfiles: JSON.parse(localStorage.getItem('nutritionProfiles') || '[]'),
        savedMeals: JSON.parse(localStorage.getItem('savedMeals') || '[]'),
        userLocation: JSON.parse(localStorage.getItem('userLocation') || '{}'),
        selectedStores: JSON.parse(localStorage.getItem('selectedStores') || '[]'),
        recentlyUsedMeals: JSON.parse(localStorage.getItem('recentlyUsedMeals') || '[]'),
        favoriteFoods: JSON.parse(localStorage.getItem('favoriteFoods') || '[]'),
        theme: localStorage.getItem('theme') || 'light',
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nutrisearch-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Import data
function importData() {
    const file = document.getElementById('importFile').files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Validate data structure
            if (data.nutritionProfiles) {
                localStorage.setItem('nutritionProfiles', JSON.stringify(data.nutritionProfiles));
            }
            if (data.savedMeals) {
                localStorage.setItem('savedMeals', JSON.stringify(data.savedMeals));
            }
            if (data.userLocation) {
                localStorage.setItem('userLocation', JSON.stringify(data.userLocation));
            }
            if (data.selectedStores) {
                localStorage.setItem('selectedStores', JSON.stringify(data.selectedStores));
            }
            if (data.recentlyUsedMeals) {
                localStorage.setItem('recentlyUsedMeals', JSON.stringify(data.recentlyUsedMeals));
            }
            if (data.favoriteFoods) {
                localStorage.setItem('favoriteFoods', JSON.stringify(data.favoriteFoods));
            }
            if (data.theme) {
                localStorage.setItem('theme', data.theme);
            }
            
            alert('Data imported successfully!');
            location.reload();
        } catch (error) {
            alert('Error importing data: Invalid file format');
        }
    };
    reader.readAsText(file);
}

// Calculate storage usage
function calculateStorageUsage() {
    let totalSize = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            totalSize += localStorage[key].length;
        }
    }
    
    const sizeInKB = (totalSize / 1024).toFixed(2);
    const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
    
    document.getElementById('storageUsage').textContent = 
        `Using ${sizeInKB} KB (${sizeInMB} MB) of local storage`;
}

// Update storage usage display
function updateStorageUsage() {
    calculateStorageUsage();
}

// Optimize storage
function optimizeStorage() {
    // Remove old recently used meals (older than 30 days)
    const recentMeals = JSON.parse(localStorage.getItem('recentlyUsedMeals') || '[]');
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const optimizedMeals = recentMeals.filter(meal => 
        new Date(meal.lastUsed) > thirtyDaysAgo
    );
    
    localStorage.setItem('recentlyUsedMeals', JSON.stringify(optimizedMeals));
    
    calculateStorageUsage();
    alert('Storage optimized! Old data has been cleaned up.');
}

// Reset all data
function resetAllData() {
    showConfirmModal(
        'Are you sure you want to reset ALL data? This will permanently delete everything and cannot be undone.',
        () => {
            localStorage.clear();
            alert('All data has been reset.');
            location.reload();
        }
    );
}

// Close modals when clicking outside
window.onclick = function(event) {
    const confirmModal = document.getElementById('confirmModal');
    const profileDetailModal = document.getElementById('profileDetailModal');
    
    if (event.target === confirmModal) {
        closeConfirmModal();
    }
    if (event.target === profileDetailModal) {
        closeProfileDetailModal();
    }
};