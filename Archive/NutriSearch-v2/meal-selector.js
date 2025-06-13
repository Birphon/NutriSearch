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

const sampleMeals = [
    {
        name: "Grilled Chicken Salad",
        type: "lunch",
        description: "Fresh mixed greens with grilled chicken breast, cherry tomatoes, and olive oil dressing",
        ingredients: "Mixed greens, grilled chicken breast (150g), cherry tomatoes, cucumber, red onion, olive oil, balsamic vinegar, salt, pepper",
        calories: 320,
        protein: 35,
        carbs: 12,
        fat: 15
    },
    {
        name: "Greek Yogurt Berry Bowl",
        type: "breakfast",
        description: "High-protein Greek yogurt topped with fresh berries and a sprinkle of granola",
        ingredients: "Greek yogurt (200g), mixed berries (100g), granola (30g), honey, chia seeds",
        calories: 280,
        protein: 20,
        carbs: 25,
        fat: 8
    },
    {
        name: "Mixed Nuts & Seeds",
        type: "snacks",
        description: "A handful of almonds, walnuts, and pumpkin seeds for healthy fats and protein",
        ingredients: "Almonds (15g), walnuts (15g), pumpkin seeds (10g), sunflower seeds (10g)",
        calories: 180,
        protein: 6,
        carbs: 6,
        fat: 16
    }
];

// State
let currentProfile = null;
let selectedMealType = 'all';
let selectedDuration = 7;
let savedMeals = [];
let filteredMeals = [...sampleMeals];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderMeals();
    updateSavedMealsList();
});

function loadProfile() {
    const profileId = document.getElementById('profileSelect').value;
    currentProfile = profileId ? profiles[profileId] : null;
    updateActiveProfileDisplay();
    applyFilters();
}

function updateActiveProfileDisplay() {
    const profileDiv = document.getElementById('activeProfile');
    
    if (!currentProfile) {
        profileDiv.innerHTML = `
            <div class="profile-name">No profile selected</div>
            <div class="profile-limits">
                <div class="profile-limit">
                    <span class="limit-name">Select a profile to see limits</span>
                </div>
            </div>
        `;
        return;
    }

    profileDiv.innerHTML = `
        <div class="profile-name">${currentProfile.name}</div>
        <div class="profile-limits">
            <div class="profile-limit">
                <span class="limit-name">Calories</span>
                <span class="limit-value">≤${currentProfile.maxCalories} kcal</span>
            </div>
            <div class="profile-limit">
                <span class="limit-name">Protein</span>
                <span class="limit-value">${currentProfile.minProtein}-${currentProfile.maxProtein}g</span>
            </div>
            <div class="profile-limit">
                <span class="limit-name">Carbs</span>
                <span class="limit-value">${currentProfile.minCarbs}-${currentProfile.maxCarbs}g</span>
            </div>
            <div class="profile-limit">
                <span class="limit-name">Fat</span>
                <span class="limit-value">${currentProfile.minFat}-${currentProfile.maxFat}g</span>
            </div>
        </div>
    `;
}

function selectMealType(type) {
    selectedMealType = type;
    document.querySelectorAll('.meal-type-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.meal === type);
    });
}

function selectDuration(duration) {
    selectedDuration = duration;
    document.querySelectorAll('.duration-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.duration) === duration);
    });
}

function applyFilters() {
    filteredMeals = sampleMeals.filter(meal => {
        // Filter by meal type
        if (selectedMealType !== 'all' && meal.type !== selectedMealType) {
            return false;
        }

        // Filter by profile if selected
        if (currentProfile) {
            if (meal.calories > currentProfile.maxCalories) return false;
            if (meal.protein > currentProfile.maxProtein || meal.protein < currentProfile.minProtein) return false;
            if (meal.carbs > currentProfile.maxCarbs || meal.carbs < currentProfile.minCarbs) return false;
            if (meal.fat > currentProfile.maxFat || meal.fat < currentProfile.minFat) return false;
        }

        // Filter out already saved meals
        const isAlreadySaved = savedMeals.some(savedMeal => savedMeal.name === meal.name);
        if (isAlreadySaved) {
            return false;
        }

        return true;
    });

    renderMeals();
}

function clearFilters() {
    document.getElementById('profileSelect').value = '';
    currentProfile = null;
    selectedMealType = 'all';
    selectedDuration = 7;
    
    document.querySelectorAll('.meal-type-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.meal === 'all');
    });
    
    document.querySelectorAll('.duration-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.duration) === 7);
    });
    
    updateActiveProfileDisplay();
    filteredMeals = [...sampleMeals];
    renderMeals();
}

function mealMatchesProfile(meal) {
    if (!currentProfile) return false;
    
    return meal.calories <= currentProfile.maxCalories &&
           meal.protein >= currentProfile.minProtein && meal.protein <= currentProfile.maxProtein &&
           meal.carbs >= currentProfile.minCarbs && meal.carbs <= currentProfile.maxCarbs &&
           meal.fat >= currentProfile.minFat && meal.fat <= currentProfile.maxFat;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function renderMeals() {
    const mealsGrid = document.getElementById('mealsGrid');
    const resultsCount = document.getElementById('resultsCount');
    
    resultsCount.textContent = `Showing ${filteredMeals.length} meals`;
    
    if (filteredMeals.length === 0) {
        mealsGrid.innerHTML = '<div class="empty-state">No meals match your current filters. Try adjusting your criteria.</div>';
        return;
    }

    mealsGrid.innerHTML = filteredMeals.map(meal => {
        const matchesProfile = mealMatchesProfile(meal);
        return `
            <div class="meal-card ${matchesProfile ? 'matches-profile' : ''}">
                ${matchesProfile ? '<div class="match-indicator">Profile Match</div>' : ''}
                <div class="meal-header">
                    <div class="meal-info">
                        <div class="meal-name">${meal.name}</div>
                        <div class="meal-type">${capitalizeFirst(meal.type)}</div>
                        <div class="meal-description">${meal.description}</div>
                    </div>
                </div>
                
                <div class="nutrition-grid">
                    <div class="nutrition-stat">
                        <div class="nutrition-value">${meal.calories}</div>
                        <div class="nutrition-label">kcal</div>
                    </div>
                    <div class="nutrition-stat">
                        <div class="nutrition-value">${meal.protein}g</div>
                        <div class="nutrition-label">Protein</div>
                    </div>
                    <div class="nutrition-stat">
                        <div class="nutrition-value">${meal.carbs}g</div>
                        <div class="nutrition-label">Carbs</div>
                    </div>
                    <div class="nutrition-stat">
                        <div class="nutrition-value">${meal.fat}g</div>
                        <div class="nutrition-label">Fat</div>
                    </div>
                </div>
                
                <div class="meal-actions">
                    <button class="action-btn save" onclick="saveMeal('${meal.name}', '${meal.type}', ${meal.calories}, ${meal.protein}, ${meal.carbs}, ${meal.fat})">Save</button>
                    <button class="action-btn view" onclick="viewMealDetails('${meal.name}')">Details</button>
                </div>
            </div>
        `;
    }).join('');
}

function saveMeal(name, type, calories, protein, carbs, fat) {
    const existingMeal = savedMeals.find(meal => meal.name === name);
    if (existingMeal) {
        return;
    }

    savedMeals.push({
        name: name,
        type: type,
        calories: calories,
        protein: protein,
        carbs: carbs,
        fat: fat
    });

    updateSavedMealsList();
    applyFilters(); // Refresh the available meals to hide the saved meal
}

function removeSavedMeal(name) {
    savedMeals = savedMeals.filter(meal => meal.name !== name);
    updateSavedMealsList();
    applyFilters(); // Refresh the available meals to show the removed meal again
}

function clearSavedMeals() {
    if (savedMeals.length === 0) return;
    
    savedMeals = [];
    updateSavedMealsList();
    applyFilters(); // Refresh the available meals to show all meals again
}

function updateSavedMealsList() {
    const savedMealsList = document.getElementById('savedMealsList');
    
    if (savedMeals.length === 0) {
        savedMealsList.innerHTML = `
            <div class="empty-state">
                No meals saved yet. Save meals from the results to build your list.
            </div>
        `;
        return;
    }

    savedMealsList.innerHTML = savedMeals.map(meal => `
        <div class="saved-meal-item">
            <div class="saved-meal-info">
                <div class="saved-meal-name">${meal.name}</div>
                <div class="saved-meal-details">${capitalizeFirst(meal.type)} • ${meal.calories} kcal</div>
            </div>
            <div class="saved-meal-actions">
                <button class="small-btn" onclick="viewMealDetails('${meal.name}')">View</button>
                <button class="small-btn" onclick="removeSavedMeal('${meal.name}')">Remove</button>
            </div>
        </div>
    `).join('');
}

function viewMealDetails(mealName) {
    const meal = sampleMeals.find(m => m.name === mealName) || savedMeals.find(m => m.name === mealName);
    if (meal) {
        showMealModal(meal);
    }
}

function showMealModal(meal) {
    // Create modal backdrop
    const modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'modal-backdrop';
    modalBackdrop.onclick = closeMealModal;

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.onclick = (e) => e.stopPropagation();

    modalContent.innerHTML = `
        <div class="modal-header">
            <h2>${meal.name}</h2>
            <button class="modal-close" onclick="closeMealModal()">&times;</button>
        </div>
        <div class="modal-body">
            <div class="meal-type-badge">${capitalizeFirst(meal.type)}</div>
            
            <div class="modal-section">
                <h3>Description</h3>
                <p>${meal.description}</p>
            </div>
            
            <div class="modal-section">
                <h3>Ingredients</h3>
                <p>${meal.ingredients}</p>
            </div>
            
            <div class="modal-section">
                <h3>Nutritional Information</h3>
                <div class="modal-nutrition-grid">
                    <div class="modal-nutrition-stat">
                        <div class="modal-nutrition-value">${meal.calories}</div>
                        <div class="modal-nutrition-label">Calories</div>
                    </div>
                    <div class="modal-nutrition-stat">
                        <div class="modal-nutrition-value">${meal.protein}g</div>
                        <div class="modal-nutrition-label">Protein</div>
                    </div>
                    <div class="modal-nutrition-stat">
                        <div class="modal-nutrition-value">${meal.carbs}g</div>
                        <div class="modal-nutrition-label">Carbohydrates</div>
                    </div>
                    <div class="modal-nutrition-stat">
                        <div class="modal-nutrition-value">${meal.fat}g</div>
                        <div class="modal-nutrition-label">Fat</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    modalBackdrop.appendChild(modalContent);
    document.body.appendChild(modalBackdrop);
    document.body.style.overflow = 'hidden';
}

function closeMealModal() {
    const modal = document.querySelector('.modal-backdrop');
    if (modal) {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    }
}

function sortMeals() {
    const sortBy = document.getElementById('sortSelect').value;
    
    switch(sortBy) {
        case 'name':
            filteredMeals.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'calories':
            filteredMeals.sort((a, b) => a.calories - b.calories);
            break;
        case 'protein':
            filteredMeals.sort((a, b) => b.protein - a.protein);
            break;
        case 'match':
            filteredMeals.sort((a, b) => {
                const aMatches = mealMatchesProfile(a);
                const bMatches = mealMatchesProfile(b);
                if (aMatches && !bMatches) return -1;
                if (!aMatches && bMatches) return 1;
                return 0;
            });
            break;
    }
    
    renderMeals();
}