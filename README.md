# NutriSearch

Smart Nutrition Planning for New Zealand

## Overview

NutriSearch is a web application designed to help New Zealand consumers plan their meals based on nutritional requirements and local supermarket availability.

## Project Structure

```
NutriSearch/
├── index.html                          # Home page 
├── pages/                              # Additional HTML pages
│   ├── meal-planner.html               # Meal planning interface 
│   ├── nutritional-search.html         # Food search by nutrition 
│   └── settings.html                   # Settings and profile management 
├── scripts/                            # JavaScript files 
│   ├── common.js                       # Shared functionality across pages
│   ├── home.js                         # Home page specific functionality
│   ├── meal-planner.js                 # Meal planner logic and interactions
│   ├── nutritional-search.js           # Search functionality and filtering
│   └── settings.js                     # Settings page functionality
├── css/                                # Stylesheets 
│   ├── styles.css                      # Main stylesheet (imports all components)
│   ├── base/                           # Foundation styles
│   │   ├── variables.css               # CSS custom properties and theme colors
│   │   └── base.css                    # Reset, typography, base elements
│   ├── components/                     # Reusable UI components
│   │   ├── buttons.css                 # Button styles and interactions
│   │   ├── forms.css                   # Form elements and inputs
│   │   ├── header.css                  # Header and navigation styling
│   │   ├── cards.css                   # Card components for meals/foods
│   │   └── modals.css                  # Modal dialogs and overlays
│   ├── layout/                         # Page-specific layouts
│   │   ├── home.css                    # Home page grid and hero section
│   │   ├── meal-planner.css            # Meal planner interface layout
│   │   ├── nutritional-search.css      # Search page sidebar + main layout
│   │   └── settings.css                # Settings page organization
│   └── utilities/                      # Helper classes and responsive design
│       ├── responsive.css              # Media queries for all breakpoints
│       └── utilities.css               # Utility classes and helpers
└── README.md                           # Project documentation
```

## Features

- 🍽️ **Meal Planner** - Create custom meal plans based on nutritional requirements
- 🔍 **Nutritional Search** - Find foods matching specific nutritional criteria
- 📍 **Location Services** - Find nearby New Zealand supermarkets
- ⚙️ **Settings** - Manage nutritional profiles and preferences

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Custom Properties, CSS Grid, Flexbox
- **Storage**: localStorage (client-side)
- **Deployment**: GitHub Pages compatible

## Getting Started

1. Open index.html in a web browser
2. Set your location to find nearby stores
3. Create nutritional profiles
4. Start planning meals!

## Target Integration

Designed for integration with New Zealand supermarket APIs:
- Foodstuffs (New World, PAK'nSAVE)
- Woolworths (Countdown)
- FreshChoice
- SuperValue

## Development

This is a static website optimized for GitHub Pages deployment. All functionality is client-side using modern JavaScript and CSS.

## License

© 2025 NutriSearch. All rights reserved.
