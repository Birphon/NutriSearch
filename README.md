# NutriSearch

Smart Nutrition Planning for New Zealand

## Overview

NutriSearch is a static web application designed for smart nutrition planning tailored to New Zealand consumers. The application helps users plan meals based on nutritional requirements and local supermarket availability.

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

## Implementation Status

### ✅ HTML Files (COMPLETED)
All HTML files have been created with proper structure, accessibility features, and correct file path references:
- **index.html**: Home page with navigation cards and location modal
- **pages/meal-planner.html**: Meal planning interface with 3x2 control grid and modals
- **pages/nutritional-search.html**: Seek.co.nz-style layout with sidebar profiles and main editor
- **pages/settings.html**: Profile management, data export/import, and app settings

### ✅ CSS Files (COMPLETED)
The CSS file structure has been planned and implemented. All styles should be organized into the modular structure outlined above.

### ❌ JavaScript Files (NEEDS IMPLEMENTATION)  
JavaScript functionality has been designed but needs to be implemented across five separate files for optimal loading and maintainability. Any examples to be made are to be limited to 3 examples i.e. 3 locations, 3 meals, 3 foods etc

## Technical Requirements

### Static Website Constraint
**CRITICAL**: This must remain a static website compatible with GitHub Pages hosting. This means:
- No server-side processing or databases
- All functionality must be client-side JavaScript
- Data storage limited to localStorage only
- No Node.js, PHP, or other server technologies
- All assets must be static files (HTML, CSS, JS, images)

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript features acceptable
- CSS Grid and Flexbox for layouts
- CSS Custom Properties for theming

### Accessibility Requirements
- WCAG 2.1 AA compliance
- Full keyboard navigation support
- Screen reader compatibility
- Proper ARIA labels and roles
- High contrast support for dark/light themes

### Design Theme

In terms of CSS:
Design a clean, modern, and user-friendly web interface for a nutrition and meal planning application tailored to New Zealand consumers. The theme should emphasize health, freshness, and simplicity. Use a color palette inspired by nature—greens, whites, and soft earth tones. Include elements that represent local food culture (e.g. kiwi fruit, flax leaves, or local supermarket icons) subtly in icons or illustrations. Prioritize accessibility, readability, and intuitive filtering/navigation. Incorporate cards or panels for nutritional info, meal planning, and product filters. The overall vibe should feel trustworthy, community-focused, and helpful—like a tool for empowering healthier food choices.


## License

© 2025 NutriSearch. All rights reserved.
