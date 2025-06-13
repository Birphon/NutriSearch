// Nutritional search page functionality
let currentProfile = {};
let searchResults = [];
let allProfiles = [];
let foodDatabase = [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeFoodDatabase();
    loadProfiles();
    checkForEditProfile();
    setupToggleListeners();
});

// Sample food database for New Zealand
function initializeFoodDatabase() {
    foodDatabase = [
        // Fruits
        {
            id: 'apple-royal-gala',
            name: 'Royal Gala Apple',
            category: 'fruits',
            calories: 52,
            protein: 0.3,
            carbs: 14,
            fat: 0.2,
            sugar: 10,
            fiber: 2.4,
            sodium: 1,
            satfat: 0.1,
            cholesterol: 0,
            dietary: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
            stores: ['countdown', 'newworld', 'paknsave']
        },
        {
            id: 'banana-cavendish',
            name: 'Cavendish Banana',
            category: 'fruits',
            calories: 89,
            protein: 1.1,
            carbs: 23,
            fat: 0.3,
            sugar: 12,
            fiber: 2.6,
            sodium: 1,
            satfat: 0.1,
            cholesterol: 0,
            dietary: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
            stores: ['countdown', 'newworld', 'paknsave', 'freshchoice']
        },
        {
            id: 'kiwifruit-green',
            name: 'Green Kiwifruit',
            category: 'fruits',
            calories: 61,
            protein: 1.1,
            carbs: 15,
            fat: 0.5,
            sugar: 9,
            fiber: 3,
            sodium: 3,
            satfat: 0.1,
            cholesterol: 0,
            dietary: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
            stores: ['countdown', 'newworld', 'paknsave']
        },
        // Vegetables
        {
            id: 'broccoli-fresh',
            name: 'Fresh Broccoli',
            category: 'vegetables',
            calories: 34,
            protein: 2.8,
            carbs: 7,
            fat: 0.4,
            sugar: 1.5,
            fiber: 2.6,
            sodium: 33,
            satfat: 0.1,
            cholesterol: 0,
            dietary: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo'],
            stores: ['countdown', 'newworld', 'paknsave', 'freshchoice']
        },
        {
            id: 'spinach-baby',
            name: 'Baby Spinach',
            category: 'vegetables',
            calories: 23,
            protein: 2.9,
            carbs: 3.6,
            fat: 0.4,
            sugar: 0.4,
            fiber: 2.2,
            sodium: 79,
            satfat: 0.1,
            cholesterol: 0,
            dietary: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo'],
            stores: ['countdown', 'newworld', 'paknsave']
        },
        {
            id: 'kumara-orange',
            name: 'Orange Kumara',
            category: 'vegetables',
            calories: 86,
            protein: 1.6,
            carbs: 20,
            fat: 0.1,
            sugar: 4.2,
            fiber: 3,
            sodium: 54,
            satfat: 0.0,
            cholesterol: 0,
            dietary: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'paleo'],
            stores: ['countdown', 'newworld', 'paknsave', 'freshchoice']
        },
        // Meat & Poultry
        {
            id: 'chicken-breast',
            name: 'Chicken Breast (skinless)',
            category: 'meat',
            calories: 165,
            protein: 31,
            carbs: 0,
            fat: 3.6,
            sugar: 0,
            fiber: 0,
            sodium: 74,
            satfat: 1,
            cholesterol: 85,
            dietary: ['gluten-free', 'dairy-free', 'keto', 'paleo'],
            stores: ['countdown', 'newworld', 'paknsave']
        },
        {
            id: 'beef-mince-lean',
            name: 'Lean Beef Mince',
            category: 'meat',
            calories: 250,
            protein: 26,
            carbs: 0,
            fat: 15,
            sugar: 0,
            fiber: 0,
            sodium: 78,
            satfat: 6,
            cholesterol: 78,
            dietary: ['gluten-free', 'dairy-free', 'keto', 'paleo'],
            stores: ['countdown', 'newworld', 'paknsave']
        },
        {
            id: 'lamb-leg',
            name: 'Lamb Leg (lean)',
            category: 'meat',
            calories: 258,
            protein: 25,
            carbs: 0,
            fat: 16,
            sugar: 0,
            fiber: 0,
            sodium: 65,
            satfat: 7,
            cholesterol: 97,
            dietary: ['gluten-free', 'dairy-free', 'keto', 'paleo'],
            stores: ['countdown', 'newworld', 'paknsave']
        },
        // Fish & Seafood
        {
            id: 'salmon-farmed',
            name: 'Farmed Salmon Fillet',
            category: 'fish',
            calories: 208,
            protein: 25,
            carbs: 0,
            fat: 12,
            sugar: 0,
            fiber: 0,
            sodium: 59,
            satfat: 3,
            cholesterol: 55,
            dietary: ['gluten-free', 'dairy-free', 'keto', 'paleo'],
            stores: ['countdown', 'newworld', 'paknsave']
        },
        {
            id: 'snapper-fresh',
            name: 'Fresh Snapper',
            category: 'fish',
            calories: 128,
            protein: 26,
            carbs: 0,
            fat: 2,
            sugar: 0,
            fiber: 0,
            sodium: 48,
            satfat: 0.4,
            cholesterol: 47,
            dietary: ['gluten-free', 'dairy-free', 'keto', 'paleo'],
            stores: ['countdown', 'newworld', 'freshchoice']
        },
        {
            id: 'green-mussels',
            name: 'Green-lipped Mussels',
            category: 'fish',
            calories: 172,
            protein: 24,
            carbs: 7,
            fat: 4.6,
            sugar: 0,
            fiber: 0,
            sodium: 369,
            satfat: 0.9,
            cholesterol: 56,
            dietary: ['gluten-free', 'dairy-free', 'keto'],
            stores: ['countdown', 'newworld', 'paknsave']
        },
        // Dairy
        {
            id: 'milk-trim',
            name: 'Trim Milk',
            category: 'dairy',
            calories: 35,
            protein: 3.4,
            carbs: 5,
            fat: 0.1,
            sugar: 5,
            fiber: 0,
            sodium: 44,
            satfat: 0.1,
            cholesterol: 2,
            dietary: ['vegetarian', 'gluten-free'],
            stores: ['countdown', 'newworld', 'paknsave', 'freshchoice']
        },
        {
            id: 'greek-yogurt',
            name: 'Greek Yogurt (plain)',
            category: 'dairy',
            calories: 59,
            protein: 10,
            carbs: 3.6,
            fat: 0.4,
            sugar: 3.6,
            fiber: 0,
            sodium: 36,
            satfat: 0.3,
            cholesterol: 5,
            dietary: ['vegetarian', 'gluten-free', 'keto'],
            stores: ['countdown', 'newworld', 'paknsave']
        },
        {
            id: 'cheese-edam',
            name: 'Edam Cheese',
            category: 'dairy',
            calories: 357,
            protein: 25,
            carbs: 1.4,
            fat: 28,
            sugar: 1.4,
            fiber: 0,
            sodium: 965,
            satfat: 18,
            cholesterol: 89,
            dietary: ['vegetarian', 'gluten-free', 'keto'],
            stores: ['countdown', 'newworld', 'paknsave']
        },
        // Grains & Cereals
        {
            id: 'oats-rolled',
            name: 'Rolled Oats',
            category: 'grains',
            calories: 389,
            protein: 17,
            carbs: 66,
            fat: 7,
            sugar: 1,
            fiber: 11,
            sodium: 2,
            satfat: 1.2,
            cholesterol: 0,
            dietary: ['vegetarian', 'vegan'],
            stores: ['countdown', 'newworld', 'paknsave', 'freshchoice']
        },
        {
            id: 'quinoa-white',
            name: 'White Quinoa',
            category: 'grains',
            calories: 368,
            protein: 14,
            carbs: 64,
            fat: 6,
            sugar: 0,
            fiber: 7,
            sodium: 5,
            satfat: 0.7,
            cholesterol: 0,
            dietary: ['vegetarian', 'vegan', 'gluten-free'],
            stores: ['countdown', 'newworld', 'paknsave']
        },
        {
            id: 'brown-rice',
            name: 'Brown Rice',
            category: 'grains',
            calories: 370,
            protein: 7.9,
            carbs: 77,
            fat: 2.9,
            sugar: 0.7,
            fiber: 3.5,
            sodium: 7,
            satfat: 0.6,
            cholesterol: 0,
            dietary: ['vegetarian', 'vegan', 'gluten-free'],
            stores: ['countdown', 'newworld', 'paknsave', 'freshchoice']
        },
        // Nuts & Seeds
        {
            id: 'almonds-raw',
            name: 'Raw Almonds',
            category: 'nuts',
            calories: 579,
            protein: 21,
            carbs: 22,
            fat: 50,
            sugar: 4.4,
            fiber: 12,
            sodium: 1,
            satfat: 3.8,
            cholesterol: 0,
            dietary: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo'],
            stores: ['countdown', 'newworld', 'paknsave']
        },
        {
            id: 'walnuts-halves',
            name: 'Walnut Halves',
            category: 'nuts',
            calories: 654,
            protein: 15,
            carbs: 14,
            fat: 65,
            sugar: 2.6,
            fiber: 6.7,
            sodium: 2,
            satfat: 6.1,
            cholesterol: 0,
            dietary: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo'],
            stores: ['countdown', 'newworld', 'paknsave']
        },
        {
            id: 'chia-seeds',
            name: 'Chia Seeds',
            category: 'nuts',
            calories: 486,
            protein: 17,
            carbs: 42,
            fat: 31,
            sugar: 0,
            fiber: 34,
            sodium: 16,
            satfat: 3.3,
            cholesterol: 0,
            dietary: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo'],
            stores: ['countdown', 'newworld', 'paknsave']
        }
    ];
}

// Load saved profiles
function loadProfiles() {
    const profiles = JSON.parse(localStorage.getItem('nutritionProfiles') || '[]');
    allProfiles = profiles.length > 0 ? profiles : getDefaultProfiles();
    displayProfilesList();
}

// Get default profiles
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

// Display profiles in sidebar
function displayProfilesList() {
    const profilesList = document.getElementById('profilesList');
    
    if (allProfiles.length === 0) {
        profilesList.innerHTML = `
            <div class="no-profiles">
                <p>No saved profiles yet</p>
            </div>
        `;
        return;
    }

    profilesList.innerHTML = allProfiles.map(profile => `
        <div class="profile-item" onclick="loadProfile('${profile.id}')">
            <div class="profile-name">${profile.name}</div>
            ${profile.description ? `<div class="profile-desc">${profile.description}</div>` : ''}
            <div class="profile-stats">
                <span>${profile.calories?.value || 0} cal</span>
                <span>${profile.protein?.value || 0}g protein</span>
                <span>${profile.carbs?.value || 0}g carbs</span>
            </div>
        </div>
    `).join('');
}

// Load profile into editor
function loadProfile(profileId) {
    const profile = allProfiles.find(p => p.id === profileId);
    if (!profile) return;

    currentProfile = { ...profile };
    
    // Update profile name and description
    document.getElementById('profileName').value = profile.name || '';
    document.getElementById('profileDescription').value = profile.description || '';
    
    // Update nutrition inputs
    const nutrients = ['calories', 'protein', 'carbs', 'fat', 'sugar', 'fiber', 'sodium', 'satfat', 'cholesterol'];
    
    nutrients.forEach(nutrient => {
        const input = document.getElementById(nutrient);
        const toggle = document.querySelector(`[data-nutrient="${nutrient}"]`);
        
        if (profile[nutrient]) {
            input.value = profile[nutrient].value || '';
            toggle.checked = !profile[nutrient].isMax;
            updateToggleText(toggle);
        }
    });
    
    // Update dietary filter
    document.getElementById('dietaryFilter').value = profile.dietary || '';
    document.getElementById('categoryFilter').value = profile.category || '';
}

// Check if editing existing profile
function checkForEditProfile() {
    const editProfileId = localStorage.getItem('editProfileId');
    if (editProfileId) {
        loadProfile(editProfileId);
        localStorage.removeItem('editProfileId');
    }
}

// Setup toggle listeners
function setupToggleListeners() {
    const toggles = document.querySelectorAll('.toggle-input');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            updateToggleText(this);
        });
        updateToggleText(toggle);
    });
}

// Update toggle text based on state
function updateToggleText(toggle) {
    const container = toggle.closest('.toggle-switch-container');
    const text = container.querySelector('.toggle-text');
    text.textContent = toggle.checked ? 'Min' : 'Max';
}

// Create new profile
function createNewProfile() {
    currentProfile = {};
    document.getElementById('profileName').value = '';
    document.getElementById('profileDescription').value = '';
    
    // Clear all inputs
    const inputs = document.querySelectorAll('.nutrition-input');
    inputs.forEach(input => input.value = '');
    
    document.getElementById('dietaryFilter').value = '';
    document.getElementById('categoryFilter').value = '';
    
    // Reset toggles to default
    const toggles = document.querySelectorAll('.toggle-input');
    toggles.forEach(toggle => {
        const nutrient = toggle.dataset.nutrient;
        if (nutrient === 'protein' || nutrient === 'fiber') {
            toggle.checked = true; // Min for protein and fiber
        } else {
            toggle.checked = false; // Max for others
        }
        updateToggleText(toggle);
    });
}

// Clear current profile
function clearCurrentProfile() {
    createNewProfile();
}

// Save current profile
function saveCurrentProfile() {
    const name = document.getElementById('profileName').value.trim();
    if (!name) {
        alert('Please enter a profile name');
        return;
    }

    const profile = {
        id: currentProfile.id || 'profile-' + Date.now(),
        name: name,
        description: document.getElementById('profileDescription').value.trim(),
        createdAt: currentProfile.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // Save nutrition values
    const nutrients = ['calories', 'protein', 'carbs', 'fat', 'sugar', 'fiber', 'sodium', 'satfat', 'cholesterol'];
    
    nutrients.forEach(nutrient => {
        const input = document.getElementById(nutrient);
        const toggle = document.querySelector(`[data-nutrient="${nutrient}"]`);
        
        const value = parseFloat(input.value);
        if (!isNaN(value) && value > 0) {
            profile[nutrient] = {
                value: value,
                isMax: !toggle.checked
            };
        }
    });

    // Save filters
    profile.dietary = document.getElementById('dietaryFilter').value;
    profile.category = document.getElementById('categoryFilter').value;

    // Update or add profile
    const existingIndex = allProfiles.findIndex(p => p.id === profile.id);
    if (existingIndex >= 0) {
        allProfiles[existingIndex] = profile;
    } else {
        allProfiles.push(profile);
    }

    // Save to localStorage
    localStorage.setItem('nutritionProfiles', JSON.stringify(allProfiles));
    
    currentProfile = profile;
    displayProfilesList();
    alert('Profile saved successfully!');
}

// Search with current criteria
function searchWithCurrentCriteria() {
    const criteria = getCurrentCriteria();
    searchResults = filterFoods(criteria);
    displaySearchResults();
}

// Get current search criteria
function getCurrentCriteria() {
    const criteria = {
        dietary: document.getElementById('dietaryFilter').value,
        category: document.getElementById('categoryFilter').value,
        nutrition: {}
    };

    const nutrients = ['calories', 'protein', 'carbs', 'fat', 'sugar', 'fiber', 'sodium', 'satfat', 'cholesterol'];
    
    nutrients.forEach(nutrient => {
        const input = document.getElementById(nutrient);
        const toggle = document.querySelector(`[data-nutrient="${nutrient}"]`);
        
        const value = parseFloat(input.value);
        if (!isNaN(value) && value > 0) {
            criteria.nutrition[nutrient] = {
                value: value,
                isMax: !toggle.checked
            };
        }
    });

    return criteria;
}

// Filter foods based on criteria
function filterFoods(criteria) {
    return foodDatabase.filter(food => {
        // Category filter
        if (criteria.category && food.category !== criteria.category) {
            return false;
        }

        // Dietary filter
        if (criteria.dietary && !food.dietary.includes(criteria.dietary)) {
            return false;
        }

        // Nutrition filters
        for (const [nutrient, constraint] of Object.entries(criteria.nutrition)) {
            const foodValue = food[nutrient] || 0;
            
            if (constraint.isMax && foodValue > constraint.value) {
                return false;
            }
            if (!constraint.isMax && foodValue < constraint.value) {
                return false;
            }
        }

        return true;
    });
}

// Display search results
function displaySearchResults() {
    const resultsGrid = document.getElementById('resultsGrid');
    const resultsCount = document.getElementById('resultsCount');
    
    if (searchResults.length === 0) {
        resultsGrid.innerHTML = `
            <div class="no-results">
                <div class="placeholder-icon">🚫</div>
                <h4>No foods found</h4>
                <p>Try adjusting your nutritional criteria or dietary filters to find matching foods.</p>
            </div>
        `;
        resultsCount.textContent = 'No results found';
        return;
    }

    resultsCount.textContent = `Found ${searchResults.length} matching foods`;
    
    resultsGrid.innerHTML = searchResults.map(food => `
        <div class="food-card">
            <div class="food-header">
                <h4>${food.name}</h4>
                <div class="food-category">${food.category}</div>
            </div>
            <div class="nutrition-details">
                <div class="nutrition-row">
                    <span class="nutrition-label">Calories:</span>
                    <span class="nutrition-value">${food.calories} kcal</span>
                </div>
                <div class="nutrition-row">
                    <span class="nutrition-label">Protein:</span>
                    <span class="nutrition-value">${food.protein}g</span>
                </div>
                <div class="nutrition-row">
                    <span class="nutrition-label">Carbs:</span>
                    <span class="nutrition-value">${food.carbs}g</span>
                </div>
                <div class="nutrition-row">
                    <span class="nutrition-label">Fat:</span>
                    <span class="nutrition-value">${food.fat}g</span>
                </div>
                <div class="nutrition-row">
                    <span class="nutrition-label">Fiber:</span>
                    <span class="nutrition-value">${food.fiber}g</span>
                </div>
                <div class="nutrition-row">
                    <span class="nutrition-label">Sugar:</span>
                    <span class="nutrition-value">${food.sugar}g</span>
                </div>
            </div>
            <div class="food-stores">
                ${food.stores.map(store => `<span class="store-tag">${store}</span>`).join('')}
            </div>
            <div class="food-dietary">
                ${food.dietary.map(diet => `<span class="dietary-tag">${diet}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

// Sort results
function sortResults() {
    const sortBy = document.getElementById('sortBy').value;
    
    switch (sortBy) {
        case 'name':
            searchResults.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'calories':
            searchResults.sort((a, b) => a.calories - b.calories);
            break;
        case 'protein':
            searchResults.sort((a, b) => b.protein - a.protein);
            break;
        case 'carbs':
            searchResults.sort((a, b) => a.carbs - b.carbs);
            break;
    }
    
    displaySearchResults();
}

// Apply quick search presets
function applyQuickSearch(type) {
    clearCurrentProfile();
    
    switch (type) {
        case 'low-calorie':
            document.getElementById('calories').value = '200';
            document.querySelector('[data-nutrient="calories"]').checked = false;
            break;
        case 'high-protein':
            document.getElementById('protein').value = '20';
            document.querySelector('[data-nutrient="protein"]').checked = true;
            break;
        case 'low-carb':
            document.getElementById('carbs').value = '10';
            document.querySelector('[data-nutrient="carbs"]').checked = false;
            break;
        case 'high-fiber':
            document.getElementById('fiber').value = '5';
            document.querySelector('[data-nutrient="fiber"]').checked = true;
            break;
    }
    
    // Update toggle texts
    const toggles = document.querySelectorAll('.toggle-input');
    toggles.forEach(toggle => updateToggleText(toggle));
    
    searchWithCurrentCriteria();
}

// Export search results
function exportSearchResults() {
    if (searchResults.length === 0) {
        alert('No search results to export');
        return;
    }

    const csvHeaders = ['Name', 'Category', 'Calories', 'Protein(g)', 'Carbs(g)', 'Fat(g)', 'Sugar(g)', 'Fiber(g)', 'Sodium(mg)', 'Stores', 'Dietary'];
    
    const csvData = searchResults.map(food => [
        food.name,
        food.category,
        food.calories,
        food.protein,
        food.carbs,
        food.fat,
        food.sugar,
        food.fiber,
        food.sodium,
        food.stores.join(';'),
        food.dietary.join(';')
    ]);

    const csvContent = [csvHeaders, ...csvData]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nutrisearch-results-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}