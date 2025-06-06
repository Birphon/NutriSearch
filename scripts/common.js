// Common functionality shared across all pages
let isInitialized = false;

// Initialize common functionality
document.addEventListener('DOMContentLoaded', function() {
    if (!isInitialized) {
        initializeTheme();
        initializeNavigation();
        initializeAccessibility();
        isInitialized = true;
    }
});

// Theme management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    updateThemeToggleState();
}

// Apply theme to document
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    }
    updateThemeToggleText();
}

// Toggle theme
function toggleTheme() {
    const isDarkMode = document.body.classList.contains('dark-theme');
    const newTheme = isDarkMode ? 'light' : 'dark';
    applyTheme(newTheme);
}

// Update theme toggle button text
function updateThemeToggleText() {
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const isDarkMode = document.body.classList.contains('dark-theme');
    
    themeToggles.forEach(toggle => {
        toggle.textContent = isDarkMode ? '☀️' : '🌙';
        toggle.setAttribute('aria-label', isDarkMode ? 'Switch to light mode' : 'Switch to dark mode');
    });
}

// Update theme toggle state for settings page
function updateThemeToggleState() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.checked = document.body.classList.contains('dark-theme');
    }
}

// Navigation management
function initializeNavigation() {
    // Add active state to current page navigation
    const currentPage = getCurrentPageName();
    highlightCurrentNavigation(currentPage);
    
    // Setup mobile navigation if needed
    setupMobileNavigation();
}

// Get current page name from URL
function getCurrentPageName() {
    const path = window.location.pathname;
    const fileName = path.split('/').pop();
    
    if (fileName === 'index.html' || fileName === '') {
        return 'home';
    }
    
    // Remove .html extension and return page name
    return fileName.replace('.html', '');
}

// Highlight current navigation item
function highlightCurrentNavigation(currentPage) {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const linkPage = href.split('/').pop().replace('.html', '');
        
        if (
            (currentPage === 'home' && (href === '../index.html' || href === 'index.html')) ||
            (currentPage === linkPage) ||
            (currentPage === 'nutritional-search' && linkPage === 'search') ||
            (href.includes(currentPage))
        ) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

// Setup mobile navigation (for future responsive enhancements)
function setupMobileNavigation() {
    // This function can be expanded for mobile menu functionality
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-links');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('nav-open');
            this.setAttribute('aria-expanded', navMenu.classList.contains('nav-open'));
        });
    }
}

// Accessibility enhancements
function initializeAccessibility() {
    // Setup focus management
    setupFocusManagement();
    
    // Setup keyboard navigation
    setupKeyboardNavigation();
    
    // Setup ARIA live regions
    setupLiveRegions();
    
    // Setup skip links
    setupSkipLinks();
}

// Focus management for modals and interactive elements
function setupFocusManagement() {
    // Track modal focus
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (modal.style.display === 'block') {
                        // Modal opened - focus first focusable element
                        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                        if (firstFocusable) {
                            setTimeout(() => firstFocusable.focus(), 100);
                        }
                        
                        // Trap focus within modal
                        trapFocusInModal(modal);
                    }
                }
            });
        });
        
        observer.observe(modal, { attributes: true });
    });
}

// Trap focus within modal
function trapFocusInModal(modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    function handleTabKey(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                // Tab
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }
        
        // Close modal on Escape
        if (e.key === 'Escape') {
            const closeButton = modal.querySelector('.close, [onclick*="close"]');
            if (closeButton) {
                closeButton.click();
            }
        }
    }
    
    modal.addEventListener('keydown', handleTabKey);
    
    // Remove event listener when modal is closed
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                if (modal.style.display === 'none' || modal.style.display === '') {
                    modal.removeEventListener('keydown', handleTabKey);
                    observer.disconnect();
                }
            }
        });
    });
    
    observer.observe(modal, { attributes: true });
}

// Keyboard navigation enhancements
function setupKeyboardNavigation() {
    // Enable Enter and Space for clickable elements with role="button"
    document.addEventListener('keydown', function(event) {
        const target = event.target;
        
        if ((event.key === 'Enter' || event.key === ' ') && 
            (target.getAttribute('role') === 'button' || 
             target.classList.contains('primary-card') || 
             target.classList.contains('secondary-card') ||
             target.classList.contains('profile-item') ||
             target.classList.contains('meal-card'))) {
            
            event.preventDefault();
            target.click();
        }
    });
    
    // Arrow key navigation for grid items
    setupArrowKeyNavigation();
}

// Arrow key navigation for grids and lists
function setupArrowKeyNavigation() {
    const gridContainers = document.querySelectorAll('.primary-actions, .results-grid, .profiles-list');
    
    gridContainers.forEach(container => {
        const items = container.querySelectorAll('[tabindex="0"], button, [role="button"]');
        
        container.addEventListener('keydown', function(event) {
            const currentIndex = Array.from(items).indexOf(document.activeElement);
            let nextIndex;
            
            switch (event.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    nextIndex = (currentIndex + 1) % items.length;
                    event.preventDefault();
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    nextIndex = (currentIndex - 1 + items.length) % items.length;
                    event.preventDefault();
                    break;
                case 'Home':
                    nextIndex = 0;
                    event.preventDefault();
                    break;
                case 'End':
                    nextIndex = items.length - 1;
                    event.preventDefault();
                    break;
                default:
                    return;
            }
            
            if (items[nextIndex]) {
                items[nextIndex].focus();
            }
        });
    });
}

// Setup ARIA live regions for dynamic content updates
function setupLiveRegions() {
    // Create live regions if they don't exist
    if (!document.getElementById('announcements')) {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'announcements';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);
    }
}

// Announce message to screen readers
function announceToScreenReader(message, priority = 'polite') {
    const liveRegion = document.getElementById('announcements');
    if (liveRegion) {
        liveRegion.setAttribute('aria-live', priority);
        liveRegion.textContent = message;
        
        // Clear after announcement
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }
}

// Setup skip links for better navigation
function setupSkipLinks() {
    // Add skip to main content link if it doesn't exist
    if (!document.querySelector('.skip-link')) {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.position = 'absolute';
        skipLink.style.top = '-40px';
        skipLink.style.left = '6px';
        skipLink.style.background = 'var(--primary-color)';
        skipLink.style.color = 'white';
        skipLink.style.padding = '8px';
        skipLink.style.textDecoration = 'none';
        skipLink.style.zIndex = '1000';
        
        skipLink.addEventListener('focus', function() {
            this.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    // Ensure main content has ID
    const mainContent = document.querySelector('main, .main-content');
    if (mainContent && !mainContent.id) {
        mainContent.id = 'main-content';
    }
}

// Utility functions
function showNotification(message, type = 'info', duration = 3000) {
    // Create notification if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification';
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '12px 20px';
        notification.style.borderRadius = '4px';
        notification.style.zIndex = '10000';
        notification.style.maxWidth = '400px';
        notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        notification.style.transform = 'translateX(100%)';
        notification.style.transition = 'transform 0.3s ease';
        document.body.appendChild(notification);
    }
    
    // Set message and type
    notification.textContent = message;
    notification.className = `notification notification-${type}`;
    
    // Set colors based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#10b981';
            notification.style.color = 'white';
            break;
        case 'error':
            notification.style.backgroundColor = '#ef4444';
            notification.style.color = 'white';
            break;
        case 'warning':
            notification.style.backgroundColor = '#f59e0b';
            notification.style.color = 'white';
            break;
        default:
            notification.style.backgroundColor = '#3b82f6';
            notification.style.color = 'white';
    }
    
    // Show notification
    notification.style.transform = 'translateX(0)';
    
    // Announce to screen readers
    announceToScreenReader(message);
    
    // Hide after duration
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
    }, duration);
}

// Format numbers for display
function formatNumber(num, decimals = 1) {
    if (num === null || num === undefined) return '0';
    return Number(num).toFixed(decimals).replace(/\.0$/, '');
}

// Format date for display
function formatDate(date, options = {}) {
    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    
    const formatOptions = { ...defaultOptions, ...options };
    return new Date(date).toLocaleDateString('en-NZ', formatOptions);
}

// Debounce function for performance
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Local storage helpers with error handling
function safeLocalStorageGet(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.warn(`Error reading from localStorage for key "${key}":`, error);
        return defaultValue;
    }
}

function safeLocalStorageSet(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.warn(`Error writing to localStorage for key "${key}":`, error);
        return false;
    }
}

// Export functions for use in other scripts
window.NutriSearch = {
    toggleTheme,
    announceToScreenReader,
    showNotification,
    formatNumber,
    formatDate,
    debounce,
    safeLocalStorageGet,
    safeLocalStorageSet
};

// Handle theme preference changes from system
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    // Only apply system preference if user hasn't manually set a theme
    if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
    }
});

// Performance monitoring
function trackPageLoad() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log(`Page load time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
                }
            }, 0);
        });
    }
}

// Initialize performance tracking
trackPageLoad();