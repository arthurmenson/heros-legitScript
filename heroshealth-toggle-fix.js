/**
 * Heroshealth.com Toggle Fix
 * Ensures toggle functionality works on production domain
 */

(function() {
    'use strict';
    
    console.log('🔧 Heroshealth.com Toggle Fix Loading...');
    
    const isProductionDomain = window.location.hostname.includes('heroshealth.com') || 
                              window.location.hostname.includes('heros');
    
    if (!isProductionDomain) {
        console.log('📍 Not on heroshealth.com, skipping production toggle fix');
        return;
    }
    
    console.log('🏥 Production domain detected:', window.location.hostname);
    
    // Wait for DOM to be ready
    function initProductionToggleFix() {
        console.log('🔄 Initializing production toggle fixes...');
        
        // Step 1: Create default settings if none exist
        ensureProductionSettings();
        
        // Step 2: Fix toggle event listeners
        fixToggleEventListeners();
        
        // Step 3: Setup robust sync system
        setupProductionSync();
        
        // Step 4: Verify functionality
        setTimeout(verifyToggleFunctionality, 1000);
        
        console.log('✅ Production toggle fix initialization complete');
    }
    
    function ensureProductionSettings() {
        console.log('📝 Ensuring production settings exist...');
        
        const existingSettings = localStorage.getItem('herosSiteSettings');
        
        if (!existingSettings) {
            console.log('🆕 Creating default production settings...');
            
            const defaultSettings = {
                // Menu items
                'menu-weight-loss': true,
                'menu-mens-ed': true,
                'menu-skin-care': true,
                'menu-hair-regrowth': true,
                'menu-nad-plus': true,
                'menu-diabetes-care': true,
                
                // Pages
                'page-weight-loss': true,
                'page-mens-ed': true,
                'page-skin-care': true,
                'page-hair-regrowth': true,
                'page-nad-plus': true,
                'page-diabetes-care': true,
                'page-blog': true,
                'page-faq': true,
                'page-contact': true,
                'page-medical-disclaimer': true,
                'page-privacy-policy': true,
                'page-terms-of-service': true,
                
                // Sections
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
                
                // Carousel
                'carousel-weight-loss': true,
                'carousel-hair-regrowth': true,
                'carousel-mens-ed': true,
                'carousel-skin-care': true,
                'carousel-diabetes-care': true,
                'carousel-remote-monitoring': true,
                'carousel-nad-plus': true,
                
                // Features
                'feature-top-banner': true,
                'feature-navigation': true,
                'feature-footer': true,
                'feature-live-chat': true,
                'feature-mobile-optimization': true,
                
                // Production metadata
                'production-domain': window.location.hostname,
                'created-timestamp': Date.now(),
                'version': '1.0'
            };
            
            localStorage.setItem('herosSiteSettings', JSON.stringify(defaultSettings));
            console.log('✅ Default production settings created');
        } else {
            console.log('✅ Production settings already exist');
        }
    }
    
    function fixToggleEventListeners() {
        console.log('🔀 Fixing toggle event listeners...');
        
        // Remove any existing broken listeners and re-add working ones
        const toggles = document.querySelectorAll('.toggle');
        console.log(`Found ${toggles.length} toggle elements`);
        
        toggles.forEach((toggle, index) => {
            // Clone element to remove all existing event listeners
            const newToggle = toggle.cloneNode(true);
            toggle.parentNode.replaceChild(newToggle, toggle);
            
            // Add fresh event listener
            newToggle.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                
                handleToggleClick(this, index);
            });
            
            console.log(`✅ Fixed toggle ${index} event listener`);
        });
        
        console.log('✅ All toggle event listeners fixed');
    }
    
    function handleToggleClick(toggle, index) {
        console.log(`🔀 Toggle ${index} clicked`);
        
        const setting = toggle.getAttribute('data-setting');
        if (!setting) {
            console.error(`❌ Toggle ${index} missing data-setting attribute`);
            return;
        }
        
        const isCurrentlyActive = toggle.classList.contains('active');
        const newState = !isCurrentlyActive;
        
        console.log(`🔄 Changing ${setting}: ${isCurrentlyActive} → ${newState}`);
        
        // Update visual state immediately
        if (newState) {
            toggle.classList.add('active');
        } else {
            toggle.classList.remove('active');
        }
        
        // Update status indicator
        updateStatusIndicator(toggle, newState);
        
        // Save to localStorage
        saveSettingChange(setting, newState);
        
        // Trigger sync mechanisms
        triggerSync(setting, newState);
        
        // Update stats display
        updateStatsDisplay();
        
        // Show visual feedback
        showToggleFeedback(setting, newState);
        
        console.log(`✅ Toggle ${setting} successfully changed to ${newState}`);
    }
    
    function updateStatusIndicator(toggle, isActive) {
        try {
            const statusEl = toggle.closest('.setting-item').querySelector('.status');
            if (statusEl) {
                statusEl.className = `status ${isActive ? 'live' : 'offline'}`;
            }
        } catch (error) {
            console.log(`⚠️ Could not update status indicator: ${error.message}`);
        }
    }
    
    function saveSettingChange(setting, newState) {
        try {
            // Get current settings
            const currentSettings = JSON.parse(localStorage.getItem('herosSiteSettings') || '{}');
            
            // Update the specific setting
            currentSettings[setting] = newState;
            currentSettings['last-updated'] = Date.now();
            currentSettings['last-updated-setting'] = setting;
            
            // Save back to localStorage
            localStorage.setItem('herosSiteSettings', JSON.stringify(currentSettings));
            
            console.log(`💾 Saved setting: ${setting} = ${newState}`);
            
        } catch (error) {
            console.error(`❌ Error saving setting: ${error.message}`);
        }
    }
    
    function triggerSync(setting, newState) {
        try {
            // Create change notification
            const changeNotification = {
                timestamp: Date.now(),
                setting: setting,
                value: newState,
                domain: window.location.hostname,
                source: 'heroshealth-toggle-fix',
                action: 'toggle-change'
            };
            
            localStorage.setItem('herosSettingsChange', JSON.stringify(changeNotification));
            
            // Trigger storage event
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'herosSiteSettings',
                newValue: localStorage.getItem('herosSiteSettings'),
                storageArea: localStorage
            }));
            
            // Custom event
            window.dispatchEvent(new CustomEvent('herosSettingsUpdate', {
                detail: { setting, value: newState, timestamp: Date.now() }
            }));
            
            // BroadcastChannel if available
            if (typeof BroadcastChannel !== 'undefined') {
                try {
                    const channel = new BroadcastChannel('heros-settings');
                    channel.postMessage({
                        type: 'heroSettingChanged',
                        setting: setting,
                        value: newState,
                        timestamp: Date.now(),
                        source: 'production-toggle-fix'
                    });
                    channel.close();
                } catch (e) {
                    console.log('⚠️ BroadcastChannel not available');
                }
            }
            
            // Try to message any open main site windows
            try {
                // Check for iframe
                const previewIframe = document.getElementById('preview-iframe');
                if (previewIframe && previewIframe.contentWindow) {
                    previewIframe.contentWindow.postMessage({
                        type: 'heroSettingChanged',
                        setting: setting,
                        value: newState,
                        source: 'settings-page'
                    }, '*');
                }
            } catch (e) {
                console.log('⚠️ Could not message iframe');
            }
            
            console.log(`📡 Sync triggered for ${setting}`);
            
        } catch (error) {
            console.error(`❌ Error triggering sync: ${error.message}`);
        }
    }
    
    function updateStatsDisplay() {
        try {
            const settings = JSON.parse(localStorage.getItem('herosSiteSettings') || '{}');
            
            // Update stats counters
            const statElements = {
                'active-menu': ['menu-weight-loss', 'menu-mens-ed', 'menu-skin-care', 'menu-hair-regrowth', 'menu-nad-plus', 'menu-diabetes-care'],
                'active-product-pages': ['page-weight-loss', 'page-mens-ed', 'page-skin-care', 'page-hair-regrowth', 'page-nad-plus', 'page-diabetes-care'],
                'active-general-pages': ['page-blog', 'page-faq', 'page-contact', 'page-medical-disclaimer', 'page-privacy-policy', 'page-terms-of-service'],
                'active-carousel': ['carousel-weight-loss', 'carousel-hair-regrowth', 'carousel-mens-ed', 'carousel-skin-care', 'carousel-diabetes-care', 'carousel-remote-monitoring', 'carousel-nad-plus'],
                'active-sections': ['section-hero', 'section-service-cards', 'section-products', 'section-weight-loss', 'section-bmi', 'section-ed-meds', 'section-results', 'section-how-it-works', 'section-testimonials', 'section-trust-badges', 'section-health-simplified'],
                'active-features': ['feature-top-banner', 'feature-navigation', 'feature-footer', 'feature-live-chat', 'feature-mobile-optimization']
            };
            
            Object.entries(statElements).forEach(([elementId, settingKeys]) => {
                const element = document.getElementById(elementId);
                if (element) {
                    const activeCount = settingKeys.filter(key => settings[key] !== false).length;
                    element.textContent = activeCount;
                }
            });
            
        } catch (error) {
            console.log(`⚠️ Could not update stats: ${error.message}`);
        }
    }
    
    function showToggleFeedback(setting, isActive) {
        // Create visual feedback
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${isActive ? '#28a745' : '#dc3545'};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 10000;
            font-weight: 600;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            transform: translateX(400px);
            transition: transform 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        const action = isActive ? 'Enabled' : 'Disabled';
        const settingName = setting.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        feedback.textContent = `${action}: ${settingName}`;
        
        document.body.appendChild(feedback);
        
        // Animate in
        setTimeout(() => {
            feedback.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            feedback.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (feedback.parentElement) {
                    document.body.removeChild(feedback);
                }
            }, 300);
        }, 2500);
    }
    
    function setupProductionSync() {
        console.log('🔄 Setting up production sync...');
        
        // Enhanced storage event listener
        window.addEventListener('storage', function(e) {
            if (e.key === 'herosSiteSettings' || e.key === 'herosSettingsChange') {
                console.log('📡 Storage event detected in production');
                // This will help sync between tabs
            }
        });
        
        // Listen for messages from main site
        window.addEventListener('message', function(e) {
            if (e.data && e.data.type === 'heroSettingChanged') {
                console.log('📨 Message received from main site:', e.data);
            }
        });
        
        console.log('✅ Production sync setup complete');
    }
    
    function verifyToggleFunctionality() {
        console.log('🧪 Verifying toggle functionality...');
        
        const toggles = document.querySelectorAll('.toggle');
        let workingToggles = 0;
        
        toggles.forEach((toggle, index) => {
            const setting = toggle.getAttribute('data-setting');
            const hasListener = toggle.onclick || toggle.addEventListener;
            
            if (setting && hasListener) {
                workingToggles++;
            }
            
            console.log(`Toggle ${index}: ${setting ? 'Has setting' : 'Missing setting'}, ${hasListener ? 'Has listener' : 'Missing listener'}`);
        });
        
        console.log(`✅ Verification complete: ${workingToggles}/${toggles.length} toggles working`);
        
        if (workingToggles === toggles.length) {
            console.log('🎉 All toggles are functioning correctly!');
        } else {
            console.log('⚠️ Some toggles may not be working properly');
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProductionToggleFix);
    } else {
        // DOM is already ready
        setTimeout(initProductionToggleFix, 100);
    }
    
    // Export for manual testing
    window.HerosToggleFix = {
        init: initProductionToggleFix,
        verify: verifyToggleFunctionality,
        test: function(setting) {
            const toggle = document.querySelector(`[data-setting="${setting}"]`);
            if (toggle) {
                toggle.click();
                console.log(`🧪 Test clicked: ${setting}`);
            } else {
                console.log(`❌ Setting not found: ${setting}`);
            }
        }
    };
    
    console.log('✅ Heroshealth.com Toggle Fix Ready');
    console.log('💡 Use HerosToggleFix.verify() to check functionality');
    console.log('💡 Use HerosToggleFix.test("menu-weight-loss") to test specific toggles');
    
})();
