/**
 * Production Quick Fix for Heros Health Settings
 * This script fixes real-time sync issues on production domains
 * 
 * Usage: Include this script on heroshealth.com or run in console
 */

(function() {
    'use strict';
    
    console.log('🚀 Heros Health Production Quick Fix Loading...');
    
    // Production domain-specific fixes
    function initProductionFixes() {
        const domain = window.location.hostname;
        const isProduction = domain.includes('heroshealth.com') || domain.includes('heros');
        
        console.log(`🌐 Domain: ${domain}, Production: ${isProduction}`);
        
        // Fix 1: Ensure settings exist on production domain
        const settingsData = localStorage.getItem('herosSiteSettings');
        if (!settingsData) {
            console.log('📝 No settings found on production domain, creating defaults...');
            createProductionSettings();
        } else {
            console.log('✅ Settings found on production domain');
        }
        
        // Fix 2: Enhanced real-time monitoring for production
        setupProductionMonitoring();
        
        // Fix 3: Ensure all communication channels work
        setupProductionCommunication();
        
        // Fix 4: Force immediate settings application
        if (typeof applySettings === 'function') {
            applySettings();
            console.log('⚡ Applied settings immediately');
        }
    }
    
    function createProductionSettings() {
        const productionSettings = {
            // All menu items enabled by default
            'menu-weight-loss': true,
            'menu-mens-ed': true,
            'menu-skin-care': true,
            'menu-hair-regrowth': true,
            'menu-nad-plus': true,
            'menu-diabetes-care': true,
            
            // All sections enabled by default
            'section-hero': true,
            'section-service-cards': true,
            'section-products': true,
            'section-weight-loss': true,
            'section-bmi': true,
            'section-ed-meds': true,
            'section-results': true,
            'section-how-it-works': true,
            'section-testimonials': true,
            'section-trust-badges': true,
            'section-health-simplified': true,
            
            // All carousel items enabled by default
            'carousel-weight-loss': true,
            'carousel-hair-regrowth': true,
            'carousel-mens-ed': true,
            'carousel-skin-care': true,
            'carousel-diabetes-care': true,
            'carousel-remote-monitoring': true,
            'carousel-nad-plus': true,
            
            // All features enabled by default
            'feature-top-banner': true,
            'feature-navigation': true,
            'feature-footer': true,
            'feature-live-chat': true,
            'feature-mobile-optimization': true,
            
            // Production metadata
            'production-quickfix': true,
            'created-timestamp': Date.now(),
            'domain': window.location.hostname,
            'version': '1.0'
        };
        
        try {
            localStorage.setItem('herosSiteSettings', JSON.stringify(productionSettings));
            
            const changeNotification = {
                timestamp: Date.now(),
                setting: 'production-quickfix',
                action: 'create-production-defaults',
                domain: window.location.hostname
            };
            localStorage.setItem('herosSettingsChange', JSON.stringify(changeNotification));
            
            console.log('✅ Production settings created successfully');
            
        } catch (error) {
            console.error('❌ Error creating production settings:', error);
        }
    }
    
    function setupProductionMonitoring() {
        // Super aggressive monitoring for production
        let lastCheck = 0;
        
        function checkForChanges() {
            const changeNotification = localStorage.getItem('herosSettingsChange');
            if (changeNotification) {
                try {
                    const change = JSON.parse(changeNotification);
                    if (change.timestamp > lastCheck) {
                        console.log('⚡ Production change detected:', change);
                        
                        // Apply settings if function exists
                        if (typeof applySettings === 'function') {
                            applySettings();
                        }
                        
                        lastCheck = change.timestamp;
                    }
                } catch (error) {
                    console.error('Error processing change:', error);
                }
            }
        }
        
        // Check every 200ms for production responsiveness
        setInterval(checkForChanges, 200);
        
        // Storage event listener
        window.addEventListener('storage', function(e) {
            if (e.key === 'herosSiteSettings' || e.key === 'herosSettingsChange') {
                console.log('📡 Production storage event:', e.key);
                if (typeof applySettings === 'function') {
                    applySettings();
                }
            }
        });
        
        console.log('✅ Production monitoring setup complete');
    }
    
    function setupProductionCommunication() {
        // Enhanced message listening for production
        window.addEventListener('message', function(e) {
            if (e.data && e.data.type === 'heroSettingChanged') {
                console.log('📨 Production message received:', e.data);
                if (typeof applySettings === 'function') {
                    applySettings();
                }
            }
        });
        
        // BroadcastChannel for cross-tab communication
        if (typeof BroadcastChannel !== 'undefined') {
            try {
                const channel = new BroadcastChannel('heros-settings');
                channel.addEventListener('message', function(e) {
                    if (e.data && e.data.type === 'heroSettingChanged') {
                        console.log('📡 Production broadcast received:', e.data);
                        if (typeof applySettings === 'function') {
                            applySettings();
                        }
                    }
                });
                console.log('✅ Production BroadcastChannel setup');
            } catch (error) {
                console.log('⚠️ BroadcastChannel not available');
            }
        }
        
        // Custom event listener
        window.addEventListener('herosSettingsUpdate', function(e) {
            if (e.detail) {
                console.log('🎯 Production custom event:', e.detail);
                if (typeof applySettings === 'function') {
                    applySettings();
                }
            }
        });
        
        console.log('✅ Production communication channels setup');
    }
    
    // Initialize fixes when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProductionFixes);
    } else {
        initProductionFixes();
    }
    
    // Export functions for manual use
    window.HerosProductionFix = {
        init: initProductionFixes,
        createSettings: createProductionSettings,
        setupMonitoring: setupProductionMonitoring,
        setupCommunication: setupProductionCommunication,
        
        // Utility functions
        checkSettings: function() {
            const settings = localStorage.getItem('herosSiteSettings');
            if (settings) {
                const parsed = JSON.parse(settings);
                console.log('Current production settings:', parsed);
                return parsed;
            } else {
                console.log('No settings found on production domain');
                return null;
            }
        },
        
        forceUpdate: function() {
            if (typeof applySettings === 'function') {
                applySettings();
                console.log('⚡ Forced settings update');
            } else {
                console.log('❌ applySettings function not found');
            }
        },
        
        createTestSettings: function() {
            const testSettings = JSON.parse(localStorage.getItem('herosSiteSettings') || '{}');
            testSettings['menu-diabetes-care'] = false;
            testSettings['section-weight-loss'] = false;
            testSettings['production-test'] = true;
            testSettings['test-timestamp'] = Date.now();
            
            localStorage.setItem('herosSiteSettings', JSON.stringify(testSettings));
            
            const changeNotification = {
                timestamp: Date.now(),
                setting: 'production-test',
                action: 'manual-test-creation'
            };
            localStorage.setItem('herosSettingsChange', JSON.stringify(changeNotification));
            
            console.log('✅ Test settings created - Diabetes Care and Weight Loss disabled');
            
            if (typeof applySettings === 'function') {
                applySettings();
            }
        }
    };
    
    console.log('✅ Heros Health Production Quick Fix Ready');
    console.log('💡 Use HerosProductionFix.checkSettings() to see current settings');
    console.log('💡 Use HerosProductionFix.createTestSettings() to create test settings');
    
})();
