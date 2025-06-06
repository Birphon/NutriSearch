// Meal planner functionality
let currentNutritionalCriteria = {};
let generatedMeals = [];
let savedMeals = [];
let currentWeekStart = new Date();
let mealDatabase = [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeMealDatabase();
    loadSavedMeals();
    setupMealTypeCheckboxes();
    setCurrentWeek();
});

// Sample meal database for New Zealand
function initializeMealDatabase() {
    mealDatabase = [
        // Breakfast meals
        {
            id: 'porridge-berries',
            name: 'Berry Porridge',
            type: 'breakfast',
            description: 'Warm oats with mixed berries and honey',
            ingredients: ['rolled oats', 'mixed berries', 'milk', 'honey'],
            calories: 320,
            protein: 12,
            carbs: 58,
            fat: 6,
            sugar: 18,
            fiber: 8,
            sodium: 45,
            satfat: 1.2,
            cholesterol: 5,
            dietary: ['vegetarian'],
            prepTime: 10,
            cookTime: 5,
            servings: 1,
            difficulty: 'easy',
            stores: ['countdown', 'newworld', 'paknsave']
        },
        {
            id: 'eggs-avocado-toast',
            name: 'Avocado Toast with Eggs',
            type: 'breakfast',
            description: 'Smashed avocado on wholegrain bread with poached eggs',
            ingredients: ['wholegrain bread', 'avocado', 'eggs', 'lemon', 'salt', 'pepper'],
            calories: 425,
            protein: 18,
            carbs: 28,
            fat: 28,
            sugar: 3,
            fiber: 12,
            sodium: 380,
            satfat: 6,
            cholesterol: 372,
            dietary: ['vegetarian'],
            prepTime: 5,
            cookTime: 8,
            servings: 1,
            difficulty: 'easy',
            stores: ['countdown', 'newworld', 'paknsave', 'freshchoice']
        },
        {
            id: 'green-smoothie',
            name: 'Green Power Smoothie',
            type: 'breakfast',
            description: 'Spinach, banana, protein powder and almond milk blend',
            ingredients: ['baby spinach', 'banana', 'protein powder', 'almond milk', 'chia seeds'],
            calories: 280,
            protein: 25,
            carbs: 32,
            fat: 8,
            sugar: 20,
            fiber: 9,
            sodium: 180,
            satfat: 1,
            cholesterol: 0,
            dietary: ['vegetarian', 'dairy-free', 'keto'],
            prepTime: 5,
            cookTime: 0,
            servings: 1,
            difficulty: 'easy',
            stores: ['countdown', 'newworld', 'paknsave']
        },
        // Lunch meals
        {
            id: 'chicken-salad-bowl',
            name: 'Grilled Chicken Salad Bowl',
            type: 'lunch',
            description: 'Mixed greens with grilled chicken, cherry tomatoes and olive oil dressing',
            ingredients: ['chicken breast', 'mixed salad greens', 'cherry tomatoes', 'cucumber', 'olive oil', 'balsamic vinegar'],
            calories: 385,
            protein: 32,
            carbs: 12,
            fat: 22,
            sugar: 8,
            fiber: 4,
            sodium: 285,
            satfat: 4,
            cholesterol: 85,
            dietary: ['gluten-free', 'dairy-free', 'keto', 'paleo'],
            prepTime: 10,
            cookTime: 15,
            servings: 1,
            difficulty: 'medium',
            stores: ['countdown', 'newworld', 'paknsave']
        },
        {
            id: 'kumara-lentil-soup',
            name: 'Kumara and Red Lentil Soup',
            type: 'lunch',
            description: 'Hearty soup with roasted kumara, red lentils and coconut milk',
            ingredients: ['orange kumara', 'red lentils', 'coconut milk', 'onion', 'garlic', 'vegetable stock'],
            calories: 295,
            protein: 14,
            carbs: 45,
            fat: 8,
            sugar: 12,
            fiber: 16,
            sodium: 420,
            satfat: 6,
            cholesterol: 0,
            dietary: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
            prepTime: 15,
            cookTime: 30,
            servings: 2,
            difficulty: 'medium',
            stores: ['countdown', 'newworld', 'paknsave', 'freshchoice']
        },
        {
            id: 'quinoa-tuna-salad',
            name: 'Quinoa Tuna Salad',
            type: 'lunch',
            description: 'Protein-rich quinoa with tuna, vegetables and lemon dressing',
            ingredients: ['quinoa', 'canned tuna', 'bell peppers', 'red onion', 'lemon', 'olive oil'],
            calories: 420,
            protein: 28,
            carbs: 38,
            fat: 18,
            sugar: 6,
            fiber: 6,
            sodium: 520,
            satfat: 3,
            cholesterol: 25,
            dietary: ['gluten-free', 'dairy-free'],
            prepTime: 20,
            cookTime: 15,
            servings: 1,
            difficulty: 'medium',
            stores: ['countdown', 'newworld', 'paknsave']
        },
        // Dinner meals
        {
            id: 'salmon-broccoli',
            name: 'Baked Salmon with Broccoli',
            type: 'dinner',
            description: 'Herb-crusted salmon fillet with steamed broccoli and lemon',
            ingredients: ['salmon fillet', 'fresh broccoli', 'herbs', 'lemon', 'olive oil', 'garlic'],
            calories: 445,
            protein: 35,
            carbs: 8,
            fat: 28,
            sugar: 3,
            fiber: 4,
            sodium: 120,
            satfat: 5,
            cholesterol: 75,
            dietary: ['gluten-free', 'dairy-free', 'keto', 'paleo'],
            prepTime: 10,
            cookTime: 20,
            servings: 1,
            difficulty: 'medium',
            stores: ['countdown', 'newworld', 'paknsave']
        },
        {
            id: 'beef-stir-fry',
            name: 'Lean Beef Stir-fry',
            type: 'dinner',
            description: 'Strips of lean beef with mixed vegetables in Asian-style sauce',
            ingredients: ['lean beef strips', 'mixed vegetables', 'soy sauce', 'ginger', 'garlic', 'sesame oil'],
            calories: 380,
            protein: 28,
            carbs: 15,
            fat: 22,
            sugar: 8,
            fiber: 5,
            sodium: 890,
            satfat: 8,
            cholesterol: 75,
            dietary: ['dairy-free'],
            prepTime: 15,
            cookTime: 10,
            servings: 1,
            difficulty: 'medium',
            stores: ['countdown', 'newworld', 'paknsave']
        },
        {
            id: 'veggie-curry',
            name: 'Vegetable Curry with Brown Rice',
            type: 'dinner',
            description: 'Spiced mixed vegetable curry served with brown rice',
            ingredients: ['mixed vegetables', 'coconut milk', 'curry spices', 'brown rice', 'onion', 'garlic'],
            calories: 385,
            protein: 12,
            carbs: 68,
            fat: 12,
            sugar: 15,
            fiber: 8,
            sodium: 320,
            satfat: 9,
            cholesterol: 0,
            dietary: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
            prepTime: 20,
            cookTime: 25,
            servings: 2,
            difficulty: 'medium',
            stores: ['countdown', 'newworld', 'paknsave', 'freshchoice']
        },
        // Snack meals
        {
            id: 'greek-yogurt-nuts',
            name: 'Greek Yogurt with Nuts',
            type: 'snack',
            description: 'Creamy Greek yogurt topped with mixed nuts and a drizzle of honey',
            ingredients: ['greek yogurt', 'mixed nuts', 'honey'],
            calories: 240,
            protein: 15,
            carbs: 18,
            fat: 12,
            sugar: 16,
            fiber: 2,
            sodium: 45,
            satfat: 3,
            cholesterol: 10,
            dietary: ['vegetarian', 'gluten-free', 'keto'],
            prepTime: 2,
            cookTime: 0,
            servings: 1,
            difficulty: 'easy',
            stores: ['countdown', 'newworld', 'paknsave']
        },
        {
            id: 'apple-almond-butter',
            name: 'Apple with Almond Butter',
            type: 'snack',
            description: 'Sliced green apple with natural almond butter',
            ingredients: ['green apple', 'almond butter'],
            calories: 195,
            protein: 6,
            carbs: 22,
            fat: 11,
            sugar: 16,
            fiber: 5,
            sodium: 2,
            satfat: 1,
            cholesterol: 0,
            dietary: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'paleo'],
            prepTime: 3,
            cookTime: 0,
            servings: 1,
            difficulty: 'easy',
            stores: ['countdown', 'newworld', 'paknsave']
        },
        {
            id: 'protein-balls',
            name: 'Chia Protein Balls',
            type: 'snack',
            description: 'No-bake energy balls with chia seeds, dates and protein powder',
            ingredients: ['dates', 'chia seeds', 'protein powder', 'coconut', 'vanilla'],
            calories: 165,
            protein: 8,
            carbs: 22,
            fat: 6,
            sugar: 18,
            fiber: 4,
            sodium: 25,
            satfat: 4,
            cholesterol: 0,
            dietary: ['vegetarian', 'gluten-free', 'dairy-free'],
            prepTime: 15,
            cookTime: 0,
            servings: 3,
            difficulty: 'easy',
            stores: ['countdown', 'newworld', 'paknsave']
        }
    ];
}

// Load saved meals
function loadSavedMeals() {
    savedMeals = JSON.parse(localStorage.getItem('savedMeals') || '[]');
}

// Setup meal type checkboxes
function setupMealTypeCheckboxes() {
    const checkboxes = document.querySelectorAll('.meal-checkboxes input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateMealTypeDropdown);
    });
}

// Update meal type dropdown based on checkboxes
function updateMealTypeDropdown() {
    const checkboxes = document.querySelectorAll('.meal-checkboxes input[type="checkbox"]:checked');
    const selectedTypes = Array.from(checkboxes).map(cb => cb.value);
    
    const dropdown = document.getElementById('mealTypeDropdown');
    dropdown.innerHTML = '<option value="">All Selected Types</option>';
    
    selectedTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        dropdown.appendChild(option);
    });
}

// Generate meals based on current settings
function generateMeals() {
    const timeFrame = document.getElementById('timeFrame').value;
    const dietaryRequirements = document.getElementById('dietaryRequirements').value;
    const selectedMealTypes = getSelectedMealTypes();
    const loadedProfile = document.getElementById('loadProfile').value;
    
    if (selectedMealTypes.length === 0) {
        alert('Please select at least one meal type');
        return;
    }
    
    // Get number of days
    const days = getNumberOfDays(timeFrame);
    
    // Filter meals based on criteria
    let availableMeals = filterMealsByCriteria(dietaryRequirements, loadedProfile);
    
    // Generate meal plan
    generatedMeals = generateMealPlan(availableMeals, selectedMealTypes, days);
    
    displayGeneratedMeals();
}

// Get selected meal types from checkboxes
function getSelectedMealTypes() {
    const checkboxes = document.querySelectorAll('.meal-checkboxes input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

// Get number of days from timeframe
function getNumberOfDays(timeFrame) {
    const timeFrameMap = {
        '1-day': 1,
        '3-days': 3,
        '5-days': 5,
        '1-week': 7,
        '2-weeks': 14,
        '4-weeks': 28
    };
    return timeFrameMap[timeFrame] || 1;
}

// Filter meals by dietary requirements and profile
function filterMealsByCriteria(dietaryRequirements, loadedProfile) {
    let filtered = [...mealDatabase];
    
    // Filter by dietary requirements
    if (dietaryRequirements) {
        filtered = filtered.filter(meal => 
            meal.dietary.includes(dietaryRequirements)
        );
    }
    
    // Filter by loaded profile nutritional criteria
    if (loadedProfile && currentNutritionalCriteria[loadedProfile]) {
        const criteria = currentNutritionalCriteria[loadedProfile];
        filtered = filtered.filter(meal => {
            // Check each nutritional constraint
            for (const [nutrient, constraint] of Object.entries(criteria)) {
                if (constraint.isMax && meal[nutrient] > constraint.value) {
                    return false;
                }
                if (!constraint.isMax && meal[nutrient] < constraint.value) {
                    return false;
                }
            }
            return true;
        });
    }
    
    return filtered;
}

// Generate meal plan for specified days and meal types
function generateMealPlan(availableMeals, mealTypes, days) {
    const mealPlan = [];
    const recentlyUsed = JSON.parse(localStorage.getItem('recentlyUsedMeals') || '[]');
    const now = new Date();
    
    // Filter out recently used meals (within 3 days)
    const recentMealIds = recentlyUsed
        .filter(recent => {
            const usedDate = new Date(recent.lastUsed);
            const daysDiff = (now - usedDate) / (1000 * 60 * 60 * 24);
            return daysDiff < 3;
        })
        .map(recent => recent.mealId);
    
    for (let day = 0; day < days; day++) {
        const dayMeals = {};
        
        mealTypes.forEach(mealType => {
            // Get available meals for this type
            const mealsForType = availableMeals.filter(meal => 
                meal.type === mealType && !recentMealIds.includes(meal.id)
            );
            
            if (mealsForType.length > 0) {
                // Randomly select a meal
                const randomIndex = Math.floor(Math.random() * mealsForType.length);
                const selectedMeal = mealsForType[randomIndex];
                dayMeals[mealType] = selectedMeal;
                
                // Add to recently used
                recentMealIds.push(selectedMeal.id);
            }
        });
        
        mealPlan.push({
            day: day + 1,
            date: new Date(now.getTime() + day * 24 * 60 * 60 * 1000),
            meals: dayMeals
        });
    }
    
    // Update recently used meals in localStorage
    const updatedRecentlyUsed = [
        ...recentlyUsed.filter(recent => {
            const usedDate = new Date(recent.lastUsed);
            const daysDiff = (now - usedDate) / (1000 * 60 * 60 * 24);
            return daysDiff < 7; // Keep for 7 days
        }),
        ...Object.values(mealPlan.flatMap(day => Object.values(day.meals)))
            .map(meal => ({
                mealId: meal.id,
                lastUsed: now.toISOString()
            }))
    ];
    
    localStorage.setItem('recentlyUsedMeals', JSON.stringify(updatedRecentlyUsed));
    
    return mealPlan;
}

// Display generated meals
function displayGeneratedMeals() {
    const mealsGrid = document.getElementById('mealsGrid');
    
    if (generatedMeals.length === 0) {
        mealsGrid.innerHTML = `
            <div class="no-meals">
                <h3>No meals generated</h3>
                <p>Try adjusting your criteria or meal type selection.</p>
            </div>
        `;
        return;
    }
    
    mealsGrid.innerHTML = generatedMeals.map(dayPlan => `
        <div class="day-plan">
            <div class="day-header">
                <h3>Day ${dayPlan.day}</h3>
                <span class="day-date">${dayPlan.date.toLocaleDateString()}</span>
            </div>
            <div class="day-meals">
                ${Object.entries(dayPlan.meals).map(([mealType, meal]) => `
                    <div class="meal-card">
                        <div class="meal-header">
                            <div class="meal-type">${mealType.charAt(0).toUpperCase() + mealType.slice(1)}</div>
                            <button class="btn-icon" onclick="saveMeal('${meal.id}')" title="Save meal">💾</button>
                        </div>
                        <h4>${meal.name}</h4>
                        <p class="meal-description">${meal.description}</p>
                        <div class="meal-nutrition">
                            <div class="nutrition-item">
                                <span class="nutrition-label">Calories:</span>
                                <span class="nutrition-value">${meal.calories}</span>
                            </div>
                            <div class="nutrition-item">
                                <span class="nutrition-label">Protein:</span>
                                <span class="nutrition-value">${meal.protein}g</span>
                            </div>
                            <div class="nutrition-item">
                                <span class="nutrition-label">Carbs:</span>
                                <span class="nutrition-value">${meal.carbs}g</span>
                            </div>
                            <div class="nutrition-item">
                                <span class="nutrition-label">Fat:</span>
                                <span class="nutrition-value">${meal.fat}g</span>
                            </div>
                        </div>
                        <div class="meal-meta">
                            <span class="prep-time">⏱️ ${meal.prepTime + meal.cookTime} min</span>
                            <span class="difficulty">📊 ${meal.difficulty}</span>
                            <span class="servings">🍽️ ${meal.servings}</span>
                        </div>
                        <div class="meal-dietary">
                            ${meal.dietary.map(diet => `<span class="dietary-tag">${diet}</span>`).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="day-totals">
                <h5>Daily Totals:</h5>
                <div class="totals-grid">
                    <span>Calories: ${calculateDayTotal(dayPlan.meals, 'calories')}</span>
                    <span>Protein: ${calculateDayTotal(dayPlan.meals, 'protein')}g</span>
                    <span>Carbs: ${calculateDayTotal(dayPlan.meals, 'carbs')}g</span>
                    <span>Fat: ${calculateDayTotal(dayPlan.meals, 'fat')}g</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Calculate daily nutrition totals
function calculateDayTotal(dayMeals, nutrient) {
    return Object.values(dayMeals).reduce((total, meal) => total + meal[nutrient], 0);
}

// Save individual meal
function saveMeal(mealId) {
    const meal = mealDatabase.find(m => m.id === mealId);
    if (!meal) return;
    
    const savedMealEntry = {
        ...meal,
        savedAt: new Date().toISOString(),
        savedId: 'saved-' + Date.now()
    };
    
    savedMeals.push(savedMealEntry);
    localStorage.setItem('savedMeals', JSON.stringify(savedMeals));
    
    alert(`"${meal.name}" saved to your meal collection!`);
}

// Show nutritional search modal
function showNutritionalSearchModal() {
    document.getElementById('nutritionalSearchModal').style.display = 'block';
}

// Close nutritional search modal
function closeNutritionalSearchModal() {
    document.getElementById('nutritionalSearchModal').style.display = 'none';
}

// Search nutrition from modal
function searchNutrition() {
    // Get criteria from modal
    const criteria = {};
    const modalInputs = document.querySelectorAll('#nutritionalSearchModal .nutrition-input');
    const modalToggles = document.querySelectorAll('#nutritionalSearchModal .toggle-input');
    
    modalInputs.forEach((input, index) => {
        const toggle = modalToggles[index];
        const value = parseFloat(input.value);
        
        if (!isNaN(value) && value > 0) {
            const nutrient = toggle.dataset.nutrient;
            criteria[nutrient] = {
                value: value,
                isMax: !toggle.checked
            };
        }
    });
    
    currentNutritionalCriteria.modal = criteria;
    closeNutritionalSearchModal();
    
    // Regenerate meals with new criteria
    generateMeals();
}

// Save nutritional criteria as profile
function saveAsProfile() {
    const profileName = prompt('Enter profile name:');
    if (!profileName) return;
    
    const criteria = {};
    const modalInputs = document.querySelectorAll('#nutritionalSearchModal .nutrition-input');
    const modalToggles = document.querySelectorAll('#nutritionalSearchModal .toggle-input');
    
    modalInputs.forEach((input, index) => {
        const toggle = modalToggles[index];
        const value = parseFloat(input.value);
        
        if (!isNaN(value) && value > 0) {
            const nutrient = toggle.dataset.nutrient;
            criteria[nutrient] = {
                value: value,
                isMax: !toggle.checked
            };
        }
    });
    
    const profile = {
        id: 'profile-' + Date.now(),
        name: profileName,
        description: 'Created from meal planner',
        createdAt: new Date().toISOString(),
        ...criteria
    };
    
    const profiles = JSON.parse(localStorage.getItem('nutritionProfiles') || '[]');
    profiles.push(profile);
    localStorage.setItem('nutritionProfiles', JSON.stringify(profiles));
    
    alert('Profile saved successfully!');
}

// Show meals planner modal
function showMealsPlannerModal() {
    loadSavedMealsModal();
    document.getElementById('mealsPlannerModal').style.display = 'block';
}

// Close meals planner modal
function closeMealsPlannerModal() {
    document.getElementById('mealsPlannerModal').style.display = 'none';
}

// Load saved meals in modal
function loadSavedMealsModal() {
    const listView = document.querySelector('#listView .saved-meals-list');
    
    if (savedMeals.length === 0) {
        listView.innerHTML = `
            <div class="no-saved-meals">
                <p>No saved meals yet. Generate and save meals to see them here!</p>
            </div>
        `;
        return;
    }
    
    listView.innerHTML = savedMeals.map(meal => `
        <div class="saved-meal-item">
            <div class="meal-info">
                <h4>${meal.name}</h4>
                <p>${meal.description}</p>
                <div class="meal-meta">
                    <span class="meal-type">${meal.type}</span>
                    <span class="meal-time">⏱️ ${meal.prepTime + meal.cookTime} min</span>
                    <span class="meal-calories">🔥 ${meal.calories} cal</span>
                </div>
            </div>
            <div class="meal-actions">
                <button class="btn-secondary btn-small" onclick="removeSavedMeal('${meal.savedId}')">Remove</button>
            </div>
        </div>
    `).join('');
}

// Remove saved meal
function removeSavedMeal(savedId) {
    savedMeals = savedMeals.filter(meal => meal.savedId !== savedId);
    localStorage.setItem('savedMeals', JSON.stringify(savedMeals));
    loadSavedMealsModal();
}

// Show planner tab
function showPlannerTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });
    document.querySelector(`[onclick="showPlannerTab('${tabName}')"]`).classList.add('active');
    document.querySelector(`[onclick="showPlannerTab('${tabName}')"]`).setAttribute('aria-selected', 'true');
    
    // Show/hide views
    document.getElementById('listView').style.display = tabName === 'list' ? 'block' : 'none';
    document.getElementById('calendarView').style.display = tabName === 'calendar' ? 'block' : 'none';
    
    if (tabName === 'calendar') {
        loadCalendarView();
    }
}

// Set current week
function setCurrentWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() + mondayOffset);
    updateWeekDisplay();
}

// Update week display
function updateWeekDisplay() {
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(currentWeekStart.getDate() + 6);
    
    document.getElementById('weekDisplay').textContent = 
        `Week of ${currentWeekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
}

// Previous week
function previousWeek() {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    updateWeekDisplay();
    loadCalendarView();
}

// Next week
function nextWeek() {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    updateWeekDisplay();
    loadCalendarView();
}

// Load calendar view
function loadCalendarView() {
    const calendarGrid = document.querySelector('.calendar-grid');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    let calendarHTML = '<div class="calendar-header-row">';
    days.forEach(day => {
        calendarHTML += `<div class="calendar-day-header">${day}</div>`;
    });
    calendarHTML += '</div>';
    
    // Create 7 day columns
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const dayDate = new Date(currentWeekStart);
        dayDate.setDate(currentWeekStart.getDate() + dayIndex);
        
        calendarHTML += `
            <div class="calendar-day" data-date="${dayDate.toISOString().split('T')[0]}">
                <div class="calendar-date">${dayDate.getDate()}</div>
                <div class="calendar-meals">
                    <div class="meal-slot" data-type="breakfast">
                        <span class="meal-type-label">Breakfast</span>
                        <div class="meal-placeholder">Click to add meal</div>
                    </div>
                    <div class="meal-slot" data-type="lunch">
                        <span class="meal-type-label">Lunch</span>
                        <div class="meal-placeholder">Click to add meal</div>
                    </div>
                    <div class="meal-slot" data-type="dinner">
                        <span class="meal-type-label">Dinner</span>
                        <div class="meal-placeholder">Click to add meal</div>
                    </div>
                    <div class="meal-slot" data-type="snack">
                        <span class="meal-type-label">Snack</span>
                        <div class="meal-placeholder">Click to add meal</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    calendarGrid.innerHTML = calendarHTML;
}

// Close modals when clicking outside
window.onclick = function(event) {
    const nutritionalModal = document.getElementById('nutritionalSearchModal');
    const mealsModal = document.getElementById('mealsPlannerModal');
    
    if (event.target === nutritionalModal) {
        closeNutritionalSearchModal();
    }
    if (event.target === mealsModal) {
        closeMealsPlannerModal();
    }
};