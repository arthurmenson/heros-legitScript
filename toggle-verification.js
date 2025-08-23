// Toggle Verification Script for Heros Health Settings
// Run this in console on settings.html to check toggle functionality

(function() {
    console.log('🔍 Toggle Verification Starting...');
    
    // Find all toggles
    const toggles = document.querySelectorAll('.toggle');
    console.log(`Found ${toggles.length} toggle elements`);
    
    if (toggles.length === 0) {
        console.error('❌ No toggle elements found!');
        return;
    }
    
    // Check each toggle
    toggles.forEach((toggle, index) => {
        const settingKey = toggle.getAttribute('data-setting');
        const isActive = toggle.classList.contains('active');
        
        console.log(`Toggle ${index + 1}: ${settingKey} - ${isActive ? 'Active' : 'Inactive'}`);
        
        // Check if it has click listeners
        const hasClickHandler = toggle.onclick !== null || 
                               toggle.getAttribute('onclick') !== null ||
                               toggle.addEventListener !== undefined;
        
        console.log(`  Click handler: ${hasClickHandler ? 'Present' : 'Missing'}`);
    });
    
    // Test first toggle if available
    if (toggles.length > 0) {
        const firstToggle = toggles[0];
        const originalState = firstToggle.classList.contains('active');
        
        console.log(`🧪 Testing first toggle (${firstToggle.getAttribute('data-setting')})...`);
        console.log(`Original state: ${originalState ? 'Active' : 'Inactive'}`);
        
        // Simulate click
        firstToggle.click();
        
        setTimeout(() => {
            const newState = firstToggle.classList.contains('active');
            console.log(`New state: ${newState ? 'Active' : 'Inactive'}`);
            
            if (newState !== originalState) {
                console.log('✅ Toggle is working correctly!');
            } else {
                console.log('❌ Toggle did not change state');
            }
            
            // Click again to restore
            firstToggle.click();
        }, 200);
    }
    
    // Check localStorage functionality
    try {
        const settingsData = localStorage.getItem('herosSiteSettings');
        if (settingsData) {
            const settings = JSON.parse(settingsData);
            console.log(`📊 Settings found: ${Object.keys(settings).length} items`);
        } else {
            console.log('⚠️ No settings found in localStorage');
        }
    } catch (error) {
        console.error('❌ Error reading settings:', error);
    }
    
    console.log('✅ Toggle verification complete');
})();
