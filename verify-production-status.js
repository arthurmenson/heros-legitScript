/**
 * Production Status Verification Script
 * Comprehensive check for preview functionality on heroshealth.com
 * 
 * Usage: Include on settings.html or run in browser console
 */

(function() {
    'use strict';
    
    console.log('🔍 Starting Production Status Verification...');
    
    const isProduction = window.location.hostname.includes('heroshealth.com') || 
                        window.location.hostname.includes('heros');
    const isSettingsPage = window.location.pathname.includes('settings.html');
    
    // Main verification function
    function verifyProductionStatus() {
        console.log('📊 Production Status Verification Report');
        console.log('=========================================');
        
        const results = {
            environment: verifyEnvironment(),
            files: verifyFileAccess(),
            dom: verifyDOMElements(),
            functions: verifyFunctions(),
            storage: verifyStorage(),
            preview: verifyPreviewFunctionality(),
            sync: verifyRealtimeSync(),
            overall: null
        };
        
        // Calculate overall status
        const criticalTests = ['environment', 'dom', 'functions', 'storage', 'preview'];
        const passed = criticalTests.filter(test => results[test].status === 'pass').length;
        const total = criticalTests.length;
        
        results.overall = {
            status: passed === total ? 'pass' : passed >= (total * 0.8) ? 'warning' : 'fail',
            score: `${passed}/${total}`,
            message: passed === total 
                ? '✅ All critical systems operational'
                : passed >= (total * 0.8)
                ? '⚠️ Minor issues detected, preview should work'
                : '❌ Critical issues found, preview may not work'
        };
        
        // Display results
        displayResults(results);
        
        return results;
    }
    
    function verifyEnvironment() {
        console.log('🌐 Checking Environment...');
        
        const domain = window.location.hostname;
        const protocol = window.location.protocol;
        const pathname = window.location.pathname;
        
        const checks = {
            domain: domain.includes('heroshealth.com') || domain.includes('heros'),
            https: protocol === 'https:',
            settingsPage: pathname.includes('settings.html'),
            modernBrowser: 'localStorage' in window && 'postMessage' in window
        };
        
        const passed = Object.values(checks).filter(Boolean).length;
        const total = Object.keys(checks).length;
        
        console.log(`   Domain: ${domain} (${checks.domain ? 'Production' : 'Non-production'})`);
        console.log(`   Protocol: ${protocol} (${checks.https ? 'Secure' : 'Insecure'})`);
        console.log(`   Page: ${pathname} (${checks.settingsPage ? 'Settings' : 'Other'})`);
        console.log(`   Browser: ${checks.modernBrowser ? 'Modern' : 'Legacy'}`);
        
        return {
            status: passed === total ? 'pass' : passed >= 3 ? 'warning' : 'fail',
            score: `${passed}/${total}`,
            details: checks,
            message: `Environment: ${domain} on ${pathname}`
        };
    }
    
    function verifyFileAccess() {
        console.log('📁 Checking File Access...');
        
        const requiredFiles = [
            'production-preview-fix.js',
            'realtime-sync-fix.js',
            'production-quickfix.js',
            'index.html'
        ];
        
        const results = {};
        let completedChecks = 0;
        
        return new Promise((resolve) => {
            requiredFiles.forEach(file => {
                fetch(file, { method: 'HEAD' })
                    .then(response => {
                        results[file] = response.ok;
                        console.log(`   ${file}: ${response.ok ? 'Available' : 'Missing'}`);
                    })
                    .catch(() => {
                        results[file] = false;
                        console.log(`   ${file}: Error accessing`);
                    })
                    .finally(() => {
                        completedChecks++;
                        if (completedChecks === requiredFiles.length) {
                            const passed = Object.values(results).filter(Boolean).length;
                            const total = requiredFiles.length;
                            
                            resolve({
                                status: passed === total ? 'pass' : passed >= 3 ? 'warning' : 'fail',
                                score: `${passed}/${total}`,
                                details: results,
                                message: `File access: ${passed}/${total} files available`
                            });
                        }
                    });
            });
        });
    }
    
    function verifyDOMElements() {
        console.log('🏗️ Checking DOM Elements...');
        
        const requiredElements = {
            'preview-section': document.getElementById('preview-section'),
            'preview-iframe': document.getElementById('preview-iframe'),
            'debug-panel': document.getElementById('debug-panel')
        };
        
        const toggles = document.querySelectorAll('.toggle');
        requiredElements.toggles = toggles.length > 0 ? toggles : null;
        
        const passed = Object.values(requiredElements).filter(Boolean).length;
        const total = Object.keys(requiredElements).length;
        
        Object.entries(requiredElements).forEach(([name, element]) => {
            const status = element ? 'Found' : 'Missing';
            const count = name === 'toggles' ? ` (${toggles.length})` : '';
            console.log(`   ${name}: ${status}${count}`);
        });
        
        return {
            status: passed === total ? 'pass' : passed >= 3 ? 'warning' : 'fail',
            score: `${passed}/${total}`,
            details: Object.fromEntries(Object.entries(requiredElements).map(([k, v]) => [k, !!v])),
            message: `DOM elements: ${passed}/${total} required elements found`
        };
    }
    
    function verifyFunctions() {
        console.log('⚙️ Checking Functions...');
        
        const requiredFunctions = {
            togglePreview: window.togglePreview,
            refreshPreview: window.refreshPreview,
            saveSettings: window.saveSettings,
            applySettings: window.applySettings
        };
        
        const passed = Object.values(requiredFunctions).filter(fn => typeof fn === 'function').length;
        const total = Object.keys(requiredFunctions).length;
        
        Object.entries(requiredFunctions).forEach(([name, fn]) => {
            const status = typeof fn === 'function' ? 'Available' : 'Missing';
            console.log(`   ${name}: ${status}`);
        });
        
        return {
            status: passed === total ? 'pass' : passed >= 3 ? 'warning' : 'fail',
            score: `${passed}/${total}`,
            details: Object.fromEntries(Object.entries(requiredFunctions).map(([k, v]) => [k, typeof v === 'function'])),
            message: `Functions: ${passed}/${total} required functions available`
        };
    }
    
    function verifyStorage() {
        console.log('💾 Checking Storage...');
        
        const checks = {
            localStorage: (() => {
                try {
                    localStorage.setItem('test', 'test');
                    const result = localStorage.getItem('test') === 'test';
                    localStorage.removeItem('test');
                    return result;
                } catch (e) {
                    return false;
                }
            })(),
            
            settingsData: (() => {
                try {
                    const settings = localStorage.getItem('herosSiteSettings');
                    return settings && JSON.parse(settings) && typeof JSON.parse(settings) === 'object';
                } catch (e) {
                    return false;
                }
            })(),
            
            changeNotifications: (() => {
                const notification = localStorage.getItem('herosSettingsChange');
                return notification !== null;
            })(),
            
            storageEvents: 'addEventListener' in window && 'StorageEvent' in window
        };
        
        const passed = Object.values(checks).filter(Boolean).length;
        const total = Object.keys(checks).length;
        
        Object.entries(checks).forEach(([name, result]) => {
            console.log(`   ${name}: ${result ? 'Working' : 'Failed'}`);
        });
        
        // Additional storage info
        try {
            const settings = localStorage.getItem('herosSiteSettings');
            if (settings) {
                const parsed = JSON.parse(settings);
                console.log(`   Settings count: ${Object.keys(parsed).length}`);
            }
        } catch (e) {
            console.log('   Settings count: 0 (invalid data)');
        }
        
        return {
            status: passed === total ? 'pass' : passed >= 3 ? 'warning' : 'fail',
            score: `${passed}/${total}`,
            details: checks,
            message: `Storage: ${passed}/${total} storage features working`
        };
    }
    
    function verifyPreviewFunctionality() {
        console.log('🖼️ Checking Preview Functionality...');
        
        const previewSection = document.getElementById('preview-section');
        const previewIframe = document.getElementById('preview-iframe');
        
        const checks = {
            previewSectionExists: !!previewSection,
            previewIframeExists: !!previewIframe,
            togglePreviewFunction: typeof window.togglePreview === 'function',
            refreshPreviewFunction: typeof window.refreshPreview === 'function',
            iframeSrcAccessible: (() => {
                if (!previewIframe) return false;
                try {
                    const src = previewIframe.src;
                    return src && src !== 'about:blank';
                } catch (e) {
                    return false;
                }
            })()
        };
        
        const passed = Object.values(checks).filter(Boolean).length;
        const total = Object.keys(checks).length;
        
        Object.entries(checks).forEach(([name, result]) => {
            console.log(`   ${name}: ${result ? 'OK' : 'Failed'}`);
        });
        
        // Test preview toggle if possible
        if (checks.previewSectionExists && checks.togglePreviewFunction) {
            try {
                const initialDisplay = previewSection.style.display;
                console.log(`   Preview section display: ${initialDisplay || 'default'}`);
            } catch (e) {
                console.log('   Preview section display: Error accessing');
            }
        }
        
        return {
            status: passed === total ? 'pass' : passed >= 4 ? 'warning' : 'fail',
            score: `${passed}/${total}`,
            details: checks,
            message: `Preview: ${passed}/${total} preview features working`
        };
    }
    
    function verifyRealtimeSync() {
        console.log('⚡ Checking Real-time Sync...');
        
        const checks = {
            settingsChange: (() => {
                const notification = localStorage.getItem('herosSettingsChange');
                if (!notification) return false;
                try {
                    const change = JSON.parse(notification);
                    return change.timestamp && typeof change.timestamp === 'number';
                } catch (e) {
                    return false;
                }
            })(),
            
            storageEventSupport: 'addEventListener' in window,
            
            broadcastChannelSupport: typeof BroadcastChannel !== 'undefined',
            
            postMessageSupport: 'postMessage' in window,
            
            syncScripts: (() => {
                return typeof window.HerosSyncFix !== 'undefined' ||
                       typeof window.ProductionPreviewFix !== 'undefined' ||
                       typeof window.HerosProductionFix !== 'undefined';
            })()
        };
        
        const passed = Object.values(checks).filter(Boolean).length;
        const total = Object.keys(checks).length;
        
        Object.entries(checks).forEach(([name, result]) => {
            console.log(`   ${name}: ${result ? 'Available' : 'Missing'}`);
        });
        
        return {
            status: passed >= 4 ? 'pass' : passed >= 3 ? 'warning' : 'fail',
            score: `${passed}/${total}`,
            details: checks,
            message: `Sync: ${passed}/${total} sync mechanisms available`
        };
    }
    
    function displayResults(results) {
        console.log('\n📋 VERIFICATION SUMMARY');
        console.log('=======================');
        
        Object.entries(results).forEach(([category, result]) => {
            if (category === 'overall') return;
            
            const icon = result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
            const score = result.score || 'N/A';
            
            console.log(`${icon} ${category.toUpperCase()}: ${score} - ${result.message}`);
        });
        
        console.log('\n🎯 OVERALL STATUS');
        console.log('=================');
        const overall = results.overall;
        const icon = overall.status === 'pass' ? '✅' : overall.status === 'warning' ? '⚠️' : '❌';
        console.log(`${icon} ${overall.message} (${overall.score})`);
        
        // Recommendations
        console.log('\n💡 RECOMMENDATIONS');
        console.log('==================');
        
        if (overall.status === 'pass') {
            console.log('✅ Preview functionality should work correctly on production');
            console.log('🧪 Test the preview by clicking "Live Preview" button');
        } else if (overall.status === 'warning') {
            console.log('⚠️ Minor issues detected - preview may work with limitations');
            console.log('🔧 Consider running production fixes for optimal performance');
            console.log('📋 Run production test plan for detailed diagnostics');
        } else {
            console.log('❌ Critical issues found - preview likely will not work');
            console.log('🚨 Run immediate fixes or contact technical support');
            console.log('📞 Provide this verification report for faster resolution');
        }
        
        // Quick fixes
        if (overall.status !== 'pass') {
            console.log('\n🔧 QUICK FIXES TO TRY');
            console.log('=====================');
            
            if (!results.files || results.files.status !== 'pass') {
                console.log('📁 Files missing - Check deployment or CDN issues');
            }
            
            if (!results.dom || results.dom.status !== 'pass') {
                console.log('🏗️ DOM issues - Clear cache and refresh page');
            }
            
            if (!results.functions || results.functions.status !== 'pass') {
                console.log('⚙️ Function issues - Load production-preview-fix.js manually');
            }
            
            if (!results.storage || results.storage.status !== 'pass') {
                console.log('💾 Storage issues - Check browser privacy settings');
            }
            
            if (!results.preview || results.preview.status !== 'pass') {
                console.log('🖼️ Preview issues - Run: ProductionPreviewFix.enhance()');
            }
        }
        
        // Store results
        try {
            localStorage.setItem('heros-verification-results', JSON.stringify({
                timestamp: new Date().toISOString(),
                domain: window.location.hostname,
                results: results
            }));
            console.log('\n💾 Results saved to localStorage as "heros-verification-results"');
        } catch (e) {
            console.log('\n⚠️ Could not save verification results to localStorage');
        }
    }
    
    // Auto-run verification
    function autoVerify() {
        if (isProduction && isSettingsPage) {
            console.log('🏥 Production settings page detected - running verification...');
            setTimeout(verifyProductionStatus, 1000);
        } else if (isProduction) {
            console.log('🌐 Production domain detected');
            console.log('💡 This verification is designed for settings.html');
            console.log('🔗 Go to /settings.html to run full verification');
        } else {
            console.log('📍 Non-production environment detected');
            console.log('💡 This verification is designed for heroshealth.com');
        }
    }
    
    // Export for manual use
    window.verifyProductionStatus = verifyProductionStatus;
    
    // Export individual verification functions
    window.ProductionVerification = {
        full: verifyProductionStatus,
        environment: verifyEnvironment,
        files: verifyFileAccess,
        dom: verifyDOMElements,
        functions: verifyFunctions,
        storage: verifyStorage,
        preview: verifyPreviewFunctionality,
        sync: verifyRealtimeSync
    };
    
    console.log('✅ Production Status Verification Ready');
    console.log('💡 Use verifyProductionStatus() or ProductionVerification.full() to run verification');
    
    // Auto-run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoVerify);
    } else {
        autoVerify();
    }
    
})();
