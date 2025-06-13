// NutriSearch Frontend JavaScript
// Handles all interactions for the landing page

class NutriSearchFrontend {
    constructor() {
        this.init();
        this.selectedProfile = null;
        this.userPreferences = this.loadUserPreferences();
    }

    init() {
        this.bindEventListeners();
        this.setupIntersectionObserver();
        this.setupScrollEffects();
        this.setupProfileSelection();
        this.loadSelectedProfile();
    }

    bindEventListeners() {
        // Mobile menu toggle
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileToggle && navLinks) {
            mobileToggle.addEventListener('click', () => {
                this.toggleMobileMenu(mobileToggle, navLinks);
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
                    this.closeMobileMenu(mobileToggle, navLinks);
                }
            });

            // Close mobile menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeMobileMenu(mobileToggle, navLinks);
                }
            });
        }

        // Smooth scrolling for anchor links
        this.setupSmoothScrolling();

        // CTA button analytics
        this.setupAnalytics();

        // Profile selection buttons
        this.setupProfileButtons();

        // Keyboard navigation
        this.setupKeyboardNavigation();
    }

    toggleMobileMenu(toggle, nav) {
        const isActive = toggle.classList.contains('active');
        
        if (isActive) {
            this.closeMobileMenu(toggle, nav);
        } else {
            this.openMobileMenu(toggle, nav);
        }
    }

    openMobileMenu(toggle, nav) {
        toggle.classList.add('active');
        nav.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        
        // Focus trap
        const firstLink = nav.querySelector('a');
        if (firstLink) firstLink.focus();
    }

    closeMobileMenu(toggle, nav) {
        toggle.classList.remove('active');
        nav.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update URL without jumping
                    history.pushState(null, null, anchor.getAttribute('href'));
                }
            });
        });
    }

    setupScrollEffects() {
        let ticking = false;
        
        const updateScrollEffects = () => {
            const header = document.querySelector('.header');
            const scrolled = window.scrollY;
            
            if (scrolled > 100) {
                header.style.boxShadow = '0 4px 30px rgba(45, 90, 39, 0.15)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.boxShadow = '0 2px 20px rgba(45, 90, 39, 0.1)';
                header.style.backdropFilter = 'none';
            }
            
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        });
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Add staggered animation for multiple items
                    if (entry.target.classList.contains('profile-card')) {
                        const cards = Array.from(document.querySelectorAll('.profile-card'));
                        const index = cards.indexOf(entry.target);
                        entry.target.style.animationDelay = `${index * 0.2}s`;
                    }
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const elementsToObserve = document.querySelectorAll(
            '.feature-card, .step, .profile-card'
        );
        
        elementsToObserve.forEach(el => {
            // Set initial state for animation
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    setupProfileSelection() {
        const profileCards = document.querySelectorAll('.profile-card');
        
        profileCards.forEach(card => {
            // Make cards focusable
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', 
                `Select ${card.querySelector('h3').textContent} profile`
            );

            // Click and keyboard selection
            const selectProfile = () => {
                this.selectProfile(card);
            };

            card.addEventListener('click', selectProfile);
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectProfile();
                }
            });

            // Enhanced hover effects
            card.addEventListener('mouseenter', () => {
                if (!card.classList.contains('selected')) {
                    card.style.transform = 'translateY(-8px) scale(1.02)';
                    card.style.borderColor = 'var(--accent-green)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (!card.classList.contains('selected')) {
                    card.style.transform = 'translateY(0) scale(1)';
                    card.style.borderColor = 'var(--border-light)';
                }
            });
        });
    }

    setupProfileButtons() {
        const profileButtons = document.querySelectorAll('.profile-select-btn');
        
        profileButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click
                const profileId = button.getAttribute('data-profile-id');
                const card = button.closest('.profile-card');
                
                this.selectProfile(card, profileId);
                this.showProfileSelectedFeedback(button);
            });
        });
    }

    selectProfile(card, profileId = null) {
        // Remove previous selection
        document.querySelectorAll('.profile-card.selected').forEach(c => {
            c.classList.remove('selected');
            c.style.transform = 'translateY(0) scale(1)';
            c.style.borderColor = 'var(--border-light)';
        });

        // Add selection to current card
        card.classList.add('selected');
        card.style.transform = 'translateY(-5px) scale(1.05)';
        card.style.borderColor = 'var(--primary-green)';
        card.style.boxShadow = '0 12px 40px rgba(45, 90, 39, 0.2)';

        // Store selection
        const profile = profileId || card.getAttribute('data-profile');
        this.selectedProfile = profile;
        this.saveSelectedProfile(profile);

        // Analytics
        this.trackEvent('profile_selected', { profile });

        // Show success message
        this.showNotification(`${card.querySelector('h3').textContent} profile selected!`, 'success');
    }

    showProfileSelectedFeedback(button) {
        const originalText = button.textContent;
        button.textContent = '✓ Selected!';
        button.style.background = 'var(--success-green)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }

    setupAnalytics() {
        const ctaButtons = document.querySelectorAll('.cta-button');
        const featureLinks = document.querySelectorAll('.feature-link');
        
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const analyticsId = button.getAttribute('data-analytics');
                this.trackEvent('cta_clicked', { 
                    location: analyticsId,
                    text: button.textContent.trim(),
                    url: button.href
                });
                
                // Show loading if navigating to another page
                if (button.href && !button.href.includes('#')) {
                    this.showLoadingIndicator();
                }
            });
        });

        featureLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.trackEvent('feature_link_clicked', {
                    feature: link.closest('.feature-card').querySelector('h3').textContent,
                    url: link.href
                });
            });
        });
    }

    setupKeyboardNavigation() {
        // Enhanced keyboard navigation for cards
        const cards = document.querySelectorAll('.feature-card, .profile-card');
        
        cards.forEach(card => {
            card.addEventListener('keydown', (e) => {
                switch(e.key) {
                    case 'ArrowRight':
                    case 'ArrowDown':
                        e.preventDefault();
                        this.focusNextCard(card);
                        break;
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        this.focusPreviousCard(card);
                        break;
                }
            });
        });
    }

    focusNextCard(currentCard) {
        const allCards = Array.from(document.querySelectorAll('.feature-card, .profile-card'));
        const currentIndex = allCards.indexOf(currentCard);
        const nextCard = allCards[currentIndex + 1] || allCards[0];
        nextCard.focus();
    }

    focusPreviousCard(currentCard) {
        const allCards = Array.from(document.querySelectorAll('.feature-card, .profile-card'));
        const currentIndex = allCards.indexOf(currentCard);
        const prevCard = allCards[currentIndex - 1] || allCards[allCards.length - 1];
        prevCard.focus();
    }

    // Utility functions
    showLoadingIndicator() {
        const indicator = document.getElementById('loadingIndicator');
        if (indicator) {
            indicator.style.display = 'flex';
        }
    }

    hideLoadingIndicator() {
        const indicator = document.getElementById('loadingIndicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    showNotification(message, type = 'info', duration = 3000) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        `;

        // Set background color based on type
        const colors = {
            success: 'var(--success-green)',
            warning: 'var(--warning-orange)',
            error: 'var(--error-red)',
            info: 'var(--primary-green)'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        // Add to DOM and animate in
        document.body.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    trackEvent(eventName, eventData = {}) {
        // Analytics tracking - replace with your analytics service
        console.log('Event tracked:', eventName, eventData);
        
        // Example integration with Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }
        
        // Example integration with custom analytics
        if (typeof analytics !== 'undefined') {
            analytics.track(eventName, eventData);
        }
    }

    saveSelectedProfile(profile) {
        try {
            localStorage.setItem('nutrisearch_selected_profile', profile);
        } catch (e) {
            console.warn('Could not save profile to localStorage:', e);
        }
    }

    loadSelectedProfile() {
        try {
            const profile = localStorage.getItem('nutrisearch_selected_profile');
            if (profile) {
                const card = document.querySelector(`[data-profile="${profile}"]`);
                if (card) {
                    this.selectProfile(card, profile);
                }
            }
        } catch (e) {
            console.warn('Could not load profile from localStorage:', e);
        }
    }

    loadUserPreferences() {
        try {
            const prefs = localStorage.getItem('nutrisearch_preferences');
            return prefs ? JSON.parse(prefs) : {};
        } catch (e) {
            console.warn('Could not load user preferences:', e);
            return {};
        }
    }

    saveUserPreferences(preferences) {
        try {
            const merged = { ...this.userPreferences, ...preferences };
            localStorage.setItem('nutrisearch_preferences', JSON.stringify(merged));
            this.userPreferences = merged;
        } catch (e) {
            console.warn('Could not save user preferences:', e);
        }
    }

    // Error handling
    handleError(error, context = 'general') {
        console.error(`NutriSearch Error (${context}):`, error);
        this.showNotification('Something went wrong. Please try again.', 'error');
        
        // Track error for debugging
        this.trackEvent('error_occurred', {
            context,
            error: error.message,
            stack: error.stack
        });
    }

    // Performance monitoring
    measurePerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    this.trackEvent('page_performance', {
                        loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                        firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0
                    });
                }, 0);
            });
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        const app = new NutriSearchFrontend();
        
        // Make available globally for debugging
        window.NutriSearchApp = app;
        
        // Performance monitoring
        app.measurePerformance();
        
        console.log('NutriSearch Frontend initialized successfully');
    } catch (error) {
        console.error('Failed to initialize NutriSearch Frontend:', error);
    }
});

// Service Worker registration for future PWA features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Handle offline/online status
window.addEventListener('online', () => {
    document.body.classList.remove('offline');
    if (window.NutriSearchApp) {
        window.NutriSearchApp.showNotification('Back online!', 'success');
    }
});

window.addEventListener('offline', () => {
    document.body.classList.add('offline');
    if (window.NutriSearchApp) {
        window.NutriSearchApp.showNotification('You are offline', 'warning');
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NutriSearchFrontend;
}