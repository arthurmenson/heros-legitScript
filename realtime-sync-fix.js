/**
 * Bulletproof Real-time Sync Fix for Heros Health
 * This script ensures settings changes are immediately visible across all tabs/windows
 */

(function() {
    'use strict';
    
    console.log('🔧 Bulletproof Real-time Sync Loading...');
    
    // Global variables for tracking
    let isSettingsPage = window.location.pathname.includes('settings.html');
    let isMainSite = !isSettingsPage;
    let lastSettingsCheck = '';
    let syncActive = false;
    
    // Bulletproof real-time sync implementation
    function initBulletproofSync() {
        console.log(`📍 Page type: ${isSettingsPage ? 'Settings Page' : 'Main Site'}`);
        
        if (isMainSite) {
            initMainSiteSync();
        } else {
            initSettingsPageSync();
        }
        
        // Universal sync methods that work everywhere
        initUniversalSync();
    }
    
    // Main site sync initialization
    function initMainSiteSync() {
        console.log('🌐 Initializing main site real-time sync...');
        
        // Method 1: Aggressive polling
        startAggressivePolling();
        
        // Method 2: Storage events
        window.addEventListener('storage', handleStorageChange);
        
        // Method 3: Window messages
        window.addEventListener('message', handleWindowMessage);
        
        // Method 4: Focus events
        window.addEventListener('focus', handleWindowFocus);
        
        // Method 5: Visibility change
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        console.log('✅ Main site sync initialized');
    }
    
    // Settings page sync initialization
    function initSettingsPageSync() {
        console.log('⚙️ Initializing settings page broadcasting...');
        
        // Override any existing toggle functions
        setTimeout(() => {
            setupSettingsPageBroadcast();
        }, 1000);
        
        console.log('✅ Settings page broadcasting initialized');
    }
    
    // Universal sync methods
    function initUniversalSync() {
        // BroadcastChannel if available
        if (typeof BroadcastChannel !== 'undefined') {
            try {
                const channel = new BroadcastChannel('heros-realtime-sync');
                channel.addEventListener('message', (e) => {
                    if (e.data && e.data.type === 'settings-changed') {
                        console.log('📡 BroadcastChannel sync received');
                        if (isMainSite) {
                            forceApplySettings();
                        }
                    }
                });
                
                // Store channel globally for settings page to use
                window.herosSyncChannel = channel;
            } catch (error) {
                console.log('⚠️ BroadcastChannel not available');
            }
        }
        
        // Custom events
        window.addEventListener('heros-force-sync', () => {
            if (isMainSite) {
                forceApplySettings();
            }
        });
    }
    
    // Aggressive polling for main site
    function startAggressivePolling() {
        function checkForChanges() {
            const currentSettings = localStorage.getItem('herosSiteSettings');
            
            if (currentSettings !== lastSettingsCheck) {
                console.log('⚡ Polling detected settings change');
                lastSettingsCheck = currentSettings;
                forceApplySettings();
            }
            
            // Check for change notifications
            const changeNotification = localStorage.getItem('herosSettingsChange');
            if (changeNotification) {
                try {
                    const change = JSON.parse(changeNotification);
                    if (change.timestamp && change.timestamp > (window.herosLastSync || 0)) {
                        console.log('🔔 Change notification detected:', change);
                        window.herosLastSync = change.timestamp;
                        forceApplySettings();
                    }
                } catch (e) {
                    // Invalid JSON, ignore
                }
            }
        }
        
        // Check every 100ms for maximum responsiveness
        setInterval(checkForChanges, 100);
        
        // Initial check
        lastSettingsCheck = localStorage.getItem('herosSiteSettings');
    }
    
    // Storage change handler
    function handleStorageChange(e) {
        if (e.key === 'herosSiteSettings' || e.key === 'herosSettingsChange') {
            console.log('💾 Storage event detected:', e.key);
            forceApplySettings();
        }
    }
    
    // Window message handler
    function handleWindowMessage(e) {
        if (e.data && e.data.type === 'heros-settings-changed') {
            console.log('📨 Window message received');
            forceApplySettings();
        }
    }
    
    // Window focus handler
    function handleWindowFocus() {
        console.log('👁️ Window focused, checking for changes');
        forceApplySettings();
    }
    
    // Visibility change handler
    function handleVisibilityChange() {
        if (!document.hidden) {
            console.log('📱 Page became visible, checking for changes');
            forceApplySettings();
        }
    }
    
    // Force apply settings with error handling
    function forceApplySettings() {
        try {
            if (typeof applySettings === 'function') {
                applySettings();
                console.log('✅ Settings applied successfully');
            } else {
                console.log('⚠️ applySettings function not found, retrying...');
                // Retry after a short delay
                setTimeout(() => {
                    if (typeof applySettings === 'function') {
                        applySettings();
                        console.log('✅ Settings applied on retry');
                    }
                }, 500);
            }
        } catch (error) {
            console.error('❌ Error applying settings:', error);
        }
    }
    
    // Setup settings page broadcasting (non-invasive approach)
    function setupSettingsPageBroadcast() {
        console.log('🔧 Setting up non-invasive settings page broadcasting...');

        // Don't replace existing toggles - just monitor localStorage changes
        let lastSettingsState = localStorage.getItem('herosSiteSettings');
        let lastChangeTime = 0;

        // Monitor localStorage changes more aggressively
        setInterval(() => {
            const currentState = localStorage.getItem('herosSiteSettings');
            if (currentState !== lastSettingsState) {
                console.log('📊 Settings page detected localStorage change');
                lastSettingsState = currentState;
                lastChangeTime = Date.now();
                broadcastSettingsChange();
            }

            // Also check for change notifications
            const changeNotification = localStorage.getItem('herosSettingsChange');
            if (changeNotification) {
                try {
                    const change = JSON.parse(changeNotification);
                    if (change.timestamp && change.timestamp > lastChangeTime) {
                        console.log('🔔 Change notification detected on settings page');
                        lastChangeTime = change.timestamp;
                        broadcastSettingsChange();
                    }
                } catch (e) {
                    // Invalid JSON, ignore
                }
            }
        }, 50); // Very frequent checking on settings page

        // Add non-invasive click listeners to document
        document.addEventListener('click', function(e) {
            if (e.target && (e.target.classList.contains('toggle') || e.target.hasAttribute('data-setting'))) {
                console.log('🔀 Toggle click detected via document listener');
                // Wait a bit for the original handler to process
                setTimeout(() => {
                    broadcastSettingsChange();
                }, 100);
            }
        }, true); // Use capture phase to ensure we get the event

        console.log('✅ Non-invasive settings broadcasting setup complete');
    }
    
    // Broadcast settings change to all main site instances
    function broadcastSettingsChange() {
        console.log('📢 Broadcasting settings change...');
        
        // Method 1: Update change notification
        const notification = {
            timestamp: Date.now(),
            source: 'realtime-sync-fix',
            action: 'broadcast-change'
        };
        localStorage.setItem('herosSettingsChange', JSON.stringify(notification));
        
        // Method 2: BroadcastChannel
        if (window.herosSyncChannel) {
            try {
                window.herosSyncChannel.postMessage({
                    type: 'settings-changed',
                    timestamp: Date.now()
                });
            } catch (error) {
                console.log('Error with BroadcastChannel:', error);
            }
        }
        
        // Method 3: Try to message parent/opener windows
        try {
            if (window.opener && !window.opener.closed) {
                window.opener.postMessage({
                    type: 'heros-settings-changed',
                    timestamp: Date.now()
                }, '*');
            }
            
            if (window.parent !== window) {
                window.parent.postMessage({
                    type: 'heros-settings-changed',
                    timestamp: Date.now()
                }, '*');
            }
        } catch (error) {
            console.log('Window messaging not available');
        }
        
        // Method 4: Custom events
        window.dispatchEvent(new CustomEvent('heros-force-sync'));
        
        // Method 5: Force storage event
        try {
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'herosSiteSettings',
                newValue: localStorage.getItem('herosSiteSettings'),
                storageArea: localStorage
            }));
        } catch (error) {
            console.log('Storage event dispatch failed');
        }
        
        console.log('✅ Settings change broadcast complete');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBulletproofSync);
    } else {
        initBulletproofSync();
    }
    
    // Export utilities for manual testing
    window.HerosSyncFix = {
        forceSync: forceApplySettings,
        broadcast: broadcastSettingsChange,
        status: () => {
            console.log('🔍 Sync Status:');
            console.log('- Page type:', isSettingsPage ? 'Settings' : 'Main Site');
            console.log('- Last settings check:', lastSettingsCheck ? 'Valid' : 'None');
            console.log('- Sync active:', syncActive);
            console.log('- applySettings available:', typeof applySettings === 'function');
        },
        test: () => {
            console.log('🧪 Running sync test...');
            if (isSettingsPage) {
                broadcastSettingsChange();
            } else {
                forceApplySettings();
            }
        }
    };
    
    console.log('✅ Bulletproof Real-time Sync Ready');
    console.log('💡 Use HerosSyncFix.test() to manually test sync');
    console.log('💡 Use HerosSyncFix.status() to check sync status');
    
})();
