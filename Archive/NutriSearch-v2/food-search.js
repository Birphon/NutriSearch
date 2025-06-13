// Sample data
const profiles = {
    vlcd: { 
        name: 'VLCD (Very Low Calorie Diet)',
        maxCalories: 800, 
        maxProtein: 100, 
        maxCarbs: 100, 
        maxFat: 20,
        minProtein: 70,
        minCarbs: 50,
        minFat: 15
    },
    highprotein: { 
        name: 'High Protein (Gym Focused)',
        maxCalories: 2800, 
        maxProtein: 200, 
        maxCarbs: 300, 
        maxFat: 80,
        minProtein: 150,
        minCarbs: 200,
        minFat: 60
    },
    lowcarb: { 
        name: 'Low Carb Diet',
        maxCalories: 2000, 
        maxProtein: 150, 
        maxCarbs: 50, 
        maxFat: 150,
        minProtein: 100,
        minCarbs: 20,
        minFat: 100
    }
};

const sampleFoods = [
    {
        name: "Greek Yogurt",
        brand: "Anchor",
        calories: 59,
        protein: 10,
        carbs: 4,
        fat: 0,
        saturatedFat: 0,
        sugar: 4,
        sodium: 36,
        fiber: 0,
        ingredients: "Pasteurised milk, live yogurt cultures (L. bulgaricus, S. thermophilus, L. acidophilus, Bifidus, L. casei)"
    },
    {
        name: "Wholemeal Bread",
        brand: "Vogels",
        calories: 247,
        protein: 13,
        carbs: 37,
        fat: 5,
        saturatedFat: 1,
        sugar: 3,
        sodium: 380,
        fiber: 7,
        ingredients: "Wholemeal wheat flour, kibbled wheat, water, wheat gluten, yeast, salt, vinegar, soy flour, emulsifier (481), flour treatment agent (300)"
    },
    {
        name: "Salmon Fillet",
        brand: "Fresh Choice",
        calories: 208,
        protein: 25,
        carbs: 0,
        fat: 12,
        saturatedFat: 3,
        sugar: 0,
        sodium: 59,
        fiber: 0,
        ingredients: "Fresh Atlantic Salmon"
    }
];

const nutrients = [
    { name: 'Calories', unit: 'kcal', key: 'calories' },
    { name: 'Protein', unit: 'g', key: 'protein' },
    { name: 'Carbohydrates', unit: 'g', key: 'carbs' },
    { name: 'Fat', unit: 'g', key: 'fat' },
    { name: 'Saturated Fat', unit: 'g', key: 'saturatedFat' },
    { name: 'Sugar', unit: 'g', key: 'sugar' },
    { name: 'Sodium', unit: 'mg', key: 'sodium' },
    { name: 'Fiber', unit: 'g', key: 'fiber' }
];

// State
let currentProfile = null;
let currentView = 'search';
let filterType = 'daily';
let nutritionalCriteria = {};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    generateNutrientControls();
});

function switchView(view) {
    currentView = view;
    
    // Update toggle buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Show/hide views
    document.getElementById('searchView').classList.toggle('active', view === 'search');
    document.getElementById('filterView').classList.toggle('active', view === 'filter');
}

function loadProfile() {
    const profileId = document.getElementById('profileSelect').value;
    currentProfile = profileId ? profiles[profileId] : null;
    
    // If a profile is loaded, show products grid immediately
    if (currentProfile) {
        showProductsGrid();
    } else {
        // Clear products grid if no profile
        clearProductsGrid();
    }
    
    // Refresh results if we have any
    if (currentView === 'search') {
        const results = document.getElementById('searchResults');
        if (results.children.length > 0 && !results.querySelector('.no-results')) {
            searchItems();
        }
    } else {
        const results = document.getElementById('filterResults');
        if (results.children.length > 0 && !results.querySelector('.no-results')) {
            applyNutritionalFilter();
        }
    }
}

function showProductsGrid() {
    const resultsContainer = document.getElementById('searchResults');
    
    // Create products grid showing all foods as product cards
    resultsContainer.innerHTML = `
        <div class="products-grid-header">
            <h3>Available Products (${currentProfile.name})</h3>
            <p>Click on any product to view detailed nutritional information</p>
        </div>
        <div class="products-grid">
            ${sampleFoods.map(food => createProductCard(food)).join('')}
        </div>
    `;
}

function clearProductsGrid() {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '<div class="no-results">Enter a food item name above to search our database</div>';
}

function createProductCard(food) {
    const matchesProfile = currentProfile ? checkProfileMatch(food) : null;
    const matchClass = matchesProfile === true ? 'good-match' : matchesProfile === false ? 'bad-match' : '';
    const matchIndicator = matchesProfile === true ? '<div class="product-match-indicator good">✓</div>' :
                         matchesProfile === false ? '<div class="product-match-indicator bad">✗</div>' : '';
    
    return `
        <div class="product-card ${matchClass}" onclick="showFoodModal('${food.name}')">
            ${matchIndicator}
            <div class="product-image">
                <img src="https://via.placeholder.com/150x150/E8F5E8/2D5A27?text=${encodeURIComponent(food.name.split(' ')[0])}" alt="${food.name}" />
            </div>
            <div class="product-info">
                <div class="product-name">${food.name}</div>
                <div class="product-brand">${food.brand}</div>
                <div class="product-calories">${food.calories} kcal/100g</div>
            </div>
        </div>
    `;
}

function handleSearchKeyPress(event) {
    if (event.key === 'Enter') {
        searchItems();
    }
}

function searchItems() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('searchResults');
    
    if (!searchTerm) {
        resultsContainer.innerHTML = '<div class="no-results">Enter a food item name to search</div>';
        return;
    }
    
    const matchingFoods = sampleFoods.filter(food => 
        food.name.toLowerCase().includes(searchTerm) || 
        food.brand.toLowerCase().includes(searchTerm) ||
        (food.ingredients && food.ingredients.toLowerCase().includes(searchTerm))
    );
    
    if (matchingFoods.length === 0) {
        resultsContainer.innerHTML = '<div class="no-results">No food items found matching your search</div>';
        return;
    }
    
    resultsContainer.innerHTML = matchingFoods.map(food => createFoodCard(food)).join('');
}

function generateNutrientControls() {
    const nutrientsGrid = document.getElementById('nutrientsGrid');
    
    nutrientsGrid.innerHTML = nutrients.map(nutrient => `
        <div class="nutrient-control">
            <div class="nutrient-header">
                <span class="nutrient-name">${nutrient.name}</span>
                <span class="nutrient-unit">${nutrient.unit}</span>
            </div>
            <div class="value-controls">
                <input type="number" class="value-input" id="${nutrient.key}Value" placeholder="Value" min="0" step="0.1">
                <select class="constraint-selector" id="${nutrient.key}Constraint">
                    <option value="min">Min</option>
                    <option value="exact">Exact</option>
                    <option value="max">Max</option>
                </select>
            </div>
        </div>
    `).join('');
}

function toggleFilterType(type) {
    filterType = type;
    document.querySelectorAll('.toggle-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === type);
    });
}

function applyNutritionalFilter() {
    // Collect criteria
    nutritionalCriteria = {};
    
    nutrients.forEach(nutrient => {
        const value = parseFloat(document.getElementById(`${nutrient.key}Value`).value);
        const constraint = document.getElementById(`${nutrient.key}Constraint`).value;
        
        if (!isNaN(value)) {
            nutritionalCriteria[nutrient.key] = { value, constraint };
        }
    });
    
    if (Object.keys(nutritionalCriteria).length === 0) {
        document.getElementById('filterResults').innerHTML = '<div class="no-results">Set at least one nutritional criterion to filter foods</div>';
        return;
    }
    
    // Filter foods
    const matchingFoods = sampleFoods.filter(food => {
        return Object.entries(nutritionalCriteria).every(([key, criteria]) => {
            const foodValue = food[key];
            
            switch (criteria.constraint) {
                case 'min':
                    return foodValue >= criteria.value;
                case 'max':
                    return foodValue <= criteria.value;
                case 'exact':
                    return Math.abs(foodValue - criteria.value) <= (criteria.value * 0.1); // 10% tolerance
                default:
                    return true;
            }
        });
    });
    
    const resultsContainer = document.getElementById('filterResults');
    
    if (matchingFoods.length === 0) {
        resultsContainer.innerHTML = '<div class="no-results">No foods match your nutritional criteria</div>';
        return;
    }
    
    resultsContainer.innerHTML = matchingFoods.map(food => createFoodCard(food)).join('');
}

function clearNutritionalFilter() {
    nutrients.forEach(nutrient => {
        document.getElementById(`${nutrient.key}Value`).value = '';
        document.getElementById(`${nutrient.key}Constraint`).value = 'min';
    });
    
    nutritionalCriteria = {};
    document.getElementById('filterResults').innerHTML = '<div class="no-results">Set your nutritional criteria above and click "Apply Filter" to find matching foods</div>';
}

function createFoodCard(food) {
    const matchesProfile = currentProfile ? checkProfileMatch(food) : null;
    const matchClass = matchesProfile === true ? 'good-match' : matchesProfile === false ? 'bad-match' : '';
    const matchIndicator = matchesProfile === true ? '<div class="match-indicator good">Profile Match ✓</div>' :
                         matchesProfile === false ? '<div class="match-indicator bad">Not Suitable ✗</div>' : '';
    
    return `
        <div class="food-card ${matchClass}" onclick="showFoodModal('${food.name}')">
            ${matchIndicator}
            <div class="food-header">
                <div class="food-name">${food.name}</div>
                <div class="food-brand">${food.brand}</div>
            </div>
            
            <div class="nutrition-table">
                <h4>Nutritional Information (per 100g)</h4>
                <div class="nutrition-row">
                    <span class="nutrition-label">Calories</span>
                    <span class="nutrition-value">${food.calories} kcal</span>
                </div>
                <div class="nutrition-row">
                    <span class="nutrition-label">Protein</span>
                    <span class="nutrition-value">${food.protein}g</span>
                </div>
                <div class="nutrition-row">
                    <span class="nutrition-label">Carbohydrates</span>
                    <span class="nutrition-value">${food.carbs}g</span>
                </div>
                <div class="nutrition-row">
                    <span class="nutrition-label">Fat</span>
                    <span class="nutrition-value">${food.fat}g</span>
                </div>
                <div class="nutrition-row">
                    <span class="nutrition-label">Saturated Fat</span>
                    <span class="nutrition-value">${food.saturatedFat}g</span>
                </div>
                <div class="nutrition-row">
                    <span class="nutrition-label">Sugar</span>
                    <span class="nutrition-value">${food.sugar}g</span>
                </div>
                <div class="nutrition-row">
                    <span class="nutrition-label">Sodium</span>
                    <span class="nutrition-value">${food.sodium}mg</span>
                </div>
                <div class="nutrition-row">
                    <span class="nutrition-label">Fiber</span>
                    <span class="nutrition-value">${food.fiber}g</span>
                </div>
            </div>
            
            ${food.ingredients ? `
                <div class="ingredients-section">
                    <h4>Ingredients</h4>
                    <div class="ingredients-list">${food.ingredients}</div>
                </div>
            ` : ''}
        </div>
    `;
}

function checkProfileMatch(food) {
    if (!currentProfile) return null;
    
    // Check basic nutrients that exist in profile
    if (currentProfile.maxCalories && food.calories > currentProfile.maxCalories) return false;
    if (currentProfile.minProtein && food.protein < currentProfile.minProtein) return false;
    if (currentProfile.maxProtein && food.protein > currentProfile.maxProtein) return false;
    if (currentProfile.minCarbs && food.carbs < currentProfile.minCarbs) return false;
    if (currentProfile.maxCarbs && food.carbs > currentProfile.maxCarbs) return false;
    if (currentProfile.minFat && food.fat < currentProfile.minFat) return false;
    if (currentProfile.maxFat && food.fat > currentProfile.maxFat) return false;
    
    return true;
}

function showFoodModal(foodName) {
    const food = sampleFoods.find(f => f.name === foodName);
    if (!food) return;
    
    // Create modal backdrop
    const modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'modal-backdrop';
    modalBackdrop.onclick = closeFoodModal;

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.onclick = (e) => e.stopPropagation();

    const matchesProfile = currentProfile ? checkProfileMatch(food) : null;
    const profileSection = currentProfile ? `
        <div class="modal-section">
            <h3>Profile Compatibility</h3>
            <div class="profile-match ${matchesProfile ? 'good' : 'bad'}">
                ${matchesProfile ? '✓ Compatible with ' + currentProfile.name : '✗ Not suitable for ' + currentProfile.name}
            </div>
        </div>
    ` : '';

    modalContent.innerHTML = `
        <div class="modal-header">
            <h2>${food.name}</h2>
            <button class="modal-close" onclick="closeFoodModal()">&times;</button>
        </div>
        <div class="modal-body">
            <div class="food-brand-badge">${food.brand}</div>
            
            <div class="modal-section">
                <h3>Nutritional Information (per 100g)</h3>
                <div class="modal-nutrition-grid">
                    <div class="modal-nutrition-stat">
                        <div class="modal-nutrition-value">${food.calories}</div>
                        <div class="modal-nutrition-label">Calories</div>
                    </div>
                    <div class="modal-nutrition-stat">
                        <div class="modal-nutrition-value">${food.protein}g</div>
                        <div class="modal-nutrition-label">Protein</div>
                    </div>
                    <div class="modal-nutrition-stat">
                        <div class="modal-nutrition-value">${food.carbs}g</div>
                        <div class="modal-nutrition-label">Carbohydrates</div>
                    </div>
                    <div class="modal-nutrition-stat">
                        <div class="modal-nutrition-value">${food.fat}g</div>
                        <div class="modal-nutrition-label">Fat</div>
                    </div>
                    <div class="modal-nutrition-stat">
                        <div class="modal-nutrition-value">${food.saturatedFat}g</div>
                        <div class="modal-nutrition-label">Saturated Fat</div>
                    </div>
                    <div class="modal-nutrition-stat">
                        <div class="modal-nutrition-value">${food.sugar}g</div>
                        <div class="modal-nutrition-label">Sugar</div>
                    </div>
                    <div class="modal-nutrition-stat">
                        <div class="modal-nutrition-value">${food.sodium}mg</div>
                        <div class="modal-nutrition-label">Sodium</div>
                    </div>
                    <div class="modal-nutrition-stat">
                        <div class="modal-nutrition-value">${food.fiber}g</div>
                        <div class="modal-nutrition-label">Fiber</div>
                    </div>
                </div>
            </div>
            
            ${food.ingredients ? `
                <div class="modal-section">
                    <h3>Ingredients</h3>
                    <p>${food.ingredients}</p>
                </div>
            ` : ''}
            
            ${profileSection}
        </div>
    `;

    modalBackdrop.appendChild(modalContent);
    document.body.appendChild(modalBackdrop);
    document.body.style.overflow = 'hidden';
}

function closeFoodModal() {
    const modal = document.querySelector('.modal-backdrop');
    if (modal) {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    }
}