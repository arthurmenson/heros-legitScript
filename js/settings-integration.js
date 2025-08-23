/**
 * Heros Health Settings Integration
 * This script reads settings from localStorage and applies them to the main site
 */

(function() {
    'use strict';
    
    let settings = {};
    let isInitialized = false;
    
    // Mapping of settings to their corresponding selectors
    const settingsMap = {
        // Menu items
        'menu-weight-loss': 'nav a[href="weight-loss.html"], .navbar a[href="weight-loss.html"]',
        'menu-mens-ed': 'nav a[href="mens-ed.html"], .navbar a[href="mens-ed.html"]',
        'menu-skin-care': 'nav a[href="skin-care.html"], .navbar a[href="skin-care.html"]',
        'menu-hair-regrowth': 'nav a[href="hair-regrowth.html"], .navbar a[href="hair-regrowth.html"]',
        'menu-nad-plus': 'nav a[href="nad-plus.html"], .navbar a[href="nad-plus.html"]',
        'menu-diabetes-care': 'nav a[href="diabetes-care.html"], .navbar a[href="diabetes-care.html"]',
        
        // Homepage sections
        'section-hero': '.hero, .hero-section, .main-hero, [class*="hero"]',
        'section-service-cards': '.new-service-cards, .service-cards, [class*="service-card"]',
        'section-products': '.products-carousel, .our-products, [class*="product-carousel"]',
        'section-weight-loss': '.section_wl-hero, .weight-loss-section, [class*="weight-loss"]',
        'section-bmi': '.bmi-calculator, [class*="bmi"]',
        'section-ed-meds': '.ed-meds-grid, .ed-section, [class*="ed-med"]',
        'section-results': '.results-section, [class*="result"]',
        'section-how-it-works': '.how-it-works, [class*="how-it-works"]',
        'section-testimonials': '.testimonials, [class*="testimonial"]',
        'section-trust-badges': '.trust-badges, [class*="trust"]',
        'section-health-simplified': '.health-simplified, [class*="health-simplified"]',
        
        // Carousel items (more specific selectors)
        'carousel-weight-loss': '.products-carousel .link-block-4, .weight-loss-card',
        'carousel-hair-regrowth': '.products-carousel .link-block-5, .hair-regrowth-card',
        'carousel-mens-ed': '.products-carousel .link-block-6, .mens-ed-card',
        'carousel-skin-care': '.products-carousel .link-block-7, .skin-care-card',
        'carousel-diabetes-care': '.products-carousel .link-block-8, .diabetes-care-card',
        'carousel-remote-monitoring': '.products-carousel .link-block-9, .remote-monitoring-card',
        'carousel-nad-plus': '.products-carousel .link-block-10, .nad-card',
        
        // Site features
        'feature-top-banner': '.bunner_component, .top-banner, [class*="banner"]',
        'feature-navigation': '.nav, .navbar, nav',
        'feature-footer': 'footer, .footer',
        'feature-live-chat': '.chat-widget, [class*="chat"]',
        'feature-mobile-optimization': '.mobile-optimized'
    };
    
    // Load settings from localStorage
    function loadSettings() {
        try {
            const saved = localStorage.getItem('herosSiteSettings');
            if (saved) {
                settings = JSON.parse(saved);
                console.log('[Heros Settings] Loaded settings:', Object.keys(settings).length, 'items');
                return true;
            } else {
                console.log('[Heros Settings] No saved settings found');
                return false;
            }
        } catch (error) {
            console.error('[Heros Settings] Error loading settings:', error);
            return false;
        }
    }
    
    // Apply a single setting to the page
    function applySetting(settingKey, isEnabled) {
        const selectors = settingsMap[settingKey];
        if (!selectors) {
            console.log('[Heros Settings] No selector found for:', settingKey);
            return;
        }
        
        try {
            const elements = document.querySelectorAll(selectors);
            let appliedCount = 0;
            
            elements.forEach(element => {
                if (isEnabled) {
                    // Show element
                    element.style.removeProperty('display');
                    element.style.removeProperty('visibility');
                    element.style.removeProperty('opacity');
                    element.removeAttribute('data-heros-hidden');
                    element.classList.remove('heros-force-hidden');
                    appliedCount++;
                } else {
                    // Hide element
                    element.style.setProperty('display', 'none', 'important');
                    element.setAttribute('data-heros-hidden', 'true');
                    element.classList.add('heros-force-hidden');
                    appliedCount++;
                }
            });
            
            if (appliedCount > 0) {
                console.log(`[Heros Settings] ${isEnabled ? 'Enabled' : 'Disabled'} ${appliedCount} elements for:`, settingKey);
            }
            
        } catch (error) {
            console.error('[Heros Settings] Error applying setting:', settingKey, error);
        }
    }
    
    // Apply all settings to the page
    function applyAllSettings() {
        console.log('[Heros Settings] Applying all settings...');
        
        Object.keys(settings).forEach(settingKey => {
            const isEnabled = settings[settingKey] !== false; // Default to true if not explicitly false
            applySetting(settingKey, isEnabled);
        });
        
        console.log('[Heros Settings] All settings applied');
    }
    
    // Watch for setting changes
    function watchForChanges() {
        // Listen for storage events (changes from other tabs/windows)
        window.addEventListener('storage', function(e) {
            if (e.key === 'herosSiteSettings') {
                console.log('[Heros Settings] Settings changed in another tab, reloading...');
                loadSettings();
                applyAllSettings();
            } else if (e.key === 'herosSettingsChange') {
                // Handle individual setting changes
                try {
                    const change = JSON.parse(e.newValue);
                    console.log('[Heros Settings] Individual setting changed:', change);
                    applySetting(change.setting, change.value);
                    
                    // Update our local settings object
                    settings[change.setting] = change.value;
                } catch (error) {
                    console.error('[Heros Settings] Error handling setting change:', error);
                }
            }
        });
        
        // Listen for messages from settings page
        window.addEventListener('message', function(e) {
            if (e.data && e.data.type === 'heroSettingChanged') {
                console.log('[Heros Settings] Received setting change message:', e.data);
                applySetting(e.data.setting, e.data.value);
                
                // Update our local settings object
                settings[e.data.setting] = e.data.value;
            }
        });
        
        // Periodic check for changes (fallback)
        setInterval(function() {
            const changeNotification = localStorage.getItem('herosSettingsChange');
            if (changeNotification) {
                try {
                    const change = JSON.parse(changeNotification);
                    if (change.timestamp > (window.herosLastChangeCheck || 0)) {
                        console.log('[Heros Settings] Detected change via periodic check:', change);
                        applySetting(change.setting, change.value);
                        settings[change.setting] = change.value;
                        window.herosLastChangeCheck = change.timestamp;
                    }
                } catch (error) {
                    console.error('[Heros Settings] Error in periodic check:', error);
                }
            }
        }, 1000); // Check every second
    }
    
    // Initialize the settings system
    function init() {
        if (isInitialized) {
            console.log('[Heros Settings] Already initialized');
            return;
        }
        
        console.log('[Heros Settings] Initializing...');
        
        const hasSettings = loadSettings();
        
        if (hasSettings) {
            applyAllSettings();
        } else {
            console.log('[Heros Settings] No settings to apply, all elements remain visible');
        }
        
        watchForChanges();
        isInitialized = true;
        
        console.log('[Heros Settings] Initialization complete');
        
        // Mark initialization timestamp
        window.herosLastChangeCheck = Date.now();
    }
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM is already ready
        setTimeout(init, 100); // Small delay to ensure other scripts have loaded
    }
    
    // Export functions for manual control
    window.HerosSettings = {
        init: init,
        loadSettings: loadSettings,
        applyAllSettings: applyAllSettings,
        applySetting: applySetting,
        getSettings: function() { return { ...settings }; },
        isInitialized: function() { return isInitialized; }
    };
    
})();
