/**
 * Production Preview Fix for heroshealth.com
 * Fixes preview functionality in settings.html on production domains
 */

(function() {
    'use strict';
    
    console.log('🔧 Production Preview Fix Loading...');
    
    const isProductionDomain = window.location.hostname.includes('heroshealth.com') || 
                              window.location.hostname.includes('heros');
    const isSettingsPage = window.location.pathname.includes('settings.html');
    
    if (!isSettingsPage) {
        console.log('📍 Not on settings page, skipping preview fix');
        return;
    }
    
    console.log('🌐 Production domain detected:', window.location.hostname);
    
    // Enhanced preview functionality for production
    function initProductionPreviewFix() {
        console.log('🖼️ Initializing production preview fixes...');
        
        // Fix 1: Enhanced iframe source handling
        enhanceIframeFunctionality();
        
        // Fix 2: Production-specific URL handling  
        fixProductionURLHandling();
        
        // Fix 3: Enhanced error handling and diagnostics
        setupPreviewDiagnostics();
        
        // Fix 4: Auto-retry mechanism for failed previews
        setupPreviewRetry();
        
        console.log('✅ Production preview fixes ready');
    }
    
    function enhanceIframeFunctionality() {
        // Override the preview functions to work better on production
        
        // Enhanced toggle preview function
        window.togglePreview = function() {
            console.log('🔄 Enhanced toggle preview called');
            
            const previewSection = document.getElementById('preview-section');
            const isVisible = previewSection && previewSection.style.display !== 'none';
            
            if (isVisible) {
                previewSection.style.display = 'none';
                console.log('📴 Preview closed');
            } else {
                if (!previewSection) {
                    console.error('❌ Preview section not found');
                    return;
                }
                
                previewSection.style.display = 'block';
                
                // Enhanced refresh for production
                setTimeout(() => {
                    enhancedRefreshPreview();
                }, 300);
                
                console.log('📺 Preview opened');
            }
        };
        
        // Enhanced refresh preview function
        window.refreshPreview = enhancedRefreshPreview;
        
        function enhancedRefreshPreview() {
            console.log('🔄 Enhanced refresh preview called');
            
            try {
                const iframe = document.getElementById('preview-iframe');
                if (!iframe) {
                    console.error('❌ Preview iframe not found');
                    return;
                }
                
                // Production-specific URL construction
                const baseURL = window.location.origin;
                const indexPath = '/index.html';
                const fullURL = baseURL + indexPath;
                
                // Add cache busting and production flags
                const params = new URLSearchParams();
                params.set('preview', 'true');
                params.set('source', 'settings');
                params.set('timestamp', Date.now().toString());
                params.set('domain', window.location.hostname);
                
                const finalURL = `${fullURL}?${params.toString()}`;
                
                console.log('🌐 Loading preview URL:', finalURL);
                
                // Clear and reload iframe
                iframe.src = 'about:blank';
                
                setTimeout(() => {
                    iframe.src = finalURL;
                    console.log('✅ Preview iframe source updated');
                    
                    // Monitor iframe loading
                    monitorIframeLoading(iframe);
                }, 200);
                
            } catch (error) {
                console.error('❌ Error refreshing preview:', error);
                
                // Show user-friendly error
                showPreviewError(error.message);
            }
        }
        
        console.log('✅ Iframe functionality enhanced');
    }
    
    function fixProductionURLHandling() {
        // Production-specific URL fixes
        
        // Override test main site function for production
        window.testMainSite = function() {
            console.log('🧪 Enhanced test main site for production');
            
            try {
                // Save current settings first
                if (typeof saveSettings === 'function') {
                    saveSettings();
                }
                
                // Production URL construction
                const productionURL = window.location.origin + '/index.html';
                
                // Add production test parameters
                const params = new URLSearchParams();
                params.set('test', 'true');
                params.set('source', 'settings');
                params.set('timestamp', Date.now().toString());
                
                const testURL = `${productionURL}?${params.toString()}`;
                
                console.log('🌐 Opening production test URL:', testURL);
                
                const newWindow = window.open(testURL, '_blank', 'noopener,noreferrer');
                
                if (newWindow) {
                    console.log('✅ Production test window opened');
                    
                    // Enhanced feedback for production
                    showProductionTestFeedback();
                } else {
                    console.error('❌ Could not open test window - popup blocked');
                    alert('❌ Could not open test window. Please check your popup blocker settings and try again.');
                }
                
            } catch (error) {
                console.error('❌ Error testing main site:', error);
                alert(`Error opening main site: ${error.message}`);
            }
        };
        
        console.log('✅ Production URL handling fixed');
    }
    
    function setupPreviewDiagnostics() {
        // Enhanced diagnostic capabilities for production
        
        function diagnosePrevieIssues() {
            console.log('🔍 Running production preview diagnostics...');
            
            const results = {
                domain: window.location.hostname,
                protocol: window.location.protocol,
                pathname: window.location.pathname,
                settingsPage: isSettingsPage,
                productionDomain: isProductionDomain,
                previewSection: !!document.getElementById('preview-section'),
                previewIframe: !!document.getElementById('preview-iframe'),
                localStorage: checkLocalStorageAccess(),
                settingsData: checkSettingsData(),
                timestamp: new Date().toISOString()
            };
            
            console.log('📊 Production preview diagnostics:', results);
            
            // Store diagnostics for support purposes
            try {
                localStorage.setItem('heros-preview-diagnostics', JSON.stringify(results));
            } catch (e) {
                console.log('⚠️ Could not store diagnostics');
            }
            
            return results;
        }
        
        function checkLocalStorageAccess() {
            try {
                const testKey = 'heros-test-' + Date.now();
                localStorage.setItem(testKey, 'test');
                const retrieved = localStorage.getItem(testKey);
                localStorage.removeItem(testKey);
                return retrieved === 'test';
            } catch (e) {
                return false;
            }
        }
        
        function checkSettingsData() {
            try {
                const settings = localStorage.getItem('herosSiteSettings');
                if (settings) {
                    const parsed = JSON.parse(settings);
                    return {
                        exists: true,
                        count: Object.keys(parsed).length,
                        hasProduction: !!parsed['production-quickfix']
                    };
                }
                return { exists: false };
            } catch (e) {
                return { exists: false, error: e.message };
            }
        }
        
        // Auto-run diagnostics
        setTimeout(diagnosePrevieIssues, 1000);
        
        // Export for manual use
        window.runPreviewDiagnostics = diagnosePrevieIssues;
        
        console.log('✅ Preview diagnostics setup complete');
    }
    
    function setupPreviewRetry() {
        // Auto-retry mechanism for failed preview loads
        
        function monitorIframeLoading(iframe) {
            let loadTimeout;
            let loadSuccessful = false;
            
            function onLoad() {
                clearTimeout(loadTimeout);
                loadSuccessful = true;
                console.log('✅ Preview iframe loaded successfully');
                hidePreviewError();
            }
            
            function onError() {
                clearTimeout(loadTimeout);
                console.error('❌ Preview iframe failed to load');
                showPreviewError('Failed to load preview. Retrying...');
                
                // Auto-retry after delay
                setTimeout(() => {
                    if (!loadSuccessful) {
                        console.log('🔄 Auto-retrying preview load...');
                        enhancedRefreshPreview();
                    }
                }, 2000);
            }
            
            // Set up listeners
            iframe.addEventListener('load', onLoad);
            iframe.addEventListener('error', onError);
            
            // Timeout fallback
            loadTimeout = setTimeout(() => {
                if (!loadSuccessful) {
                    console.log('⏰ Preview load timeout, retrying...');
                    onError();
                }
            }, 10000); // 10 second timeout
        }
        
        // Expose monitoring function globally
        window.monitorIframeLoading = monitorIframeLoading;
        
        console.log('✅ Preview retry mechanism setup complete');
    }
    
    function showPreviewError(message) {
        let errorDiv = document.getElementById('preview-error');
        
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'preview-error';
            errorDiv.style.cssText = `
                background: #f8d7da;
                color: #721c24;
                padding: 12px;
                border-radius: 6px;
                margin: 15px 0;
                border: 1px solid #f5c6cb;
                display: none;
            `;
            
            const previewSection = document.getElementById('preview-section');
            if (previewSection) {
                const card = previewSection.querySelector('.card');
                if (card) {
                    card.insertBefore(errorDiv, card.querySelector('iframe').parentElement);
                }
            }
        }
        
        errorDiv.textContent = `⚠️ ${message}`;
        errorDiv.style.display = 'block';
        
        console.log('⚠️ Preview error shown:', message);
    }
    
    function hidePreviewError() {
        const errorDiv = document.getElementById('preview-error');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }
    
    function showProductionTestFeedback() {
        // Enhanced feedback for production test
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 10000;
            text-align: center;
            max-width: 400px;
        `;
        
        feedback.innerHTML = `
            <h3 style="margin-top: 0; color: #28a745;">🧪 Production Test Opened</h3>
            <p style="margin: 15px 0; color: #666;">
                A new window has opened with your main site. 
                Make changes here and see them update instantly!
            </p>
            <button onclick="this.parentElement.remove()" style="
                background: #28a745;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            ">Got it!</button>
        `;
        
        document.body.appendChild(feedback);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (feedback.parentElement) {
                feedback.remove();
            }
        }, 10000);
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProductionPreviewFix);
    } else {
        setTimeout(initProductionPreviewFix, 500);
    }
    
    // Export utilities
    window.ProductionPreviewFix = {
        enhance: initProductionPreviewFix,
        refresh: () => window.refreshPreview(),
        diagnose: () => window.runPreviewDiagnostics(),
        test: () => window.testMainSite()
    };
    
    console.log('✅ Production Preview Fix Ready');
    console.log('💡 Use ProductionPreviewFix.diagnose() for detailed diagnostics');
    
})();
