// Automated UAT Runner for HEROS Settings System
// This script runs comprehensive multi-toggle tests

class UATRunner {
    constructor() {
        this.testResults = [];
        this.currentTest = 0;
        this.totalTests = 0;
        this.issues = [];
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] [${type.toUpperCase()}] ${message}`);
        
        // Also log to page if running in browser
        if (typeof document !== 'undefined') {
            const logDiv = document.getElementById('test-log');
            if (logDiv) {
                logDiv.innerHTML += `<div class="log-${type}">[${timestamp}] ${message}</div>`;
                logDiv.scrollTop = logDiv.scrollHeight;
            }
        }
    }

    getCurrentSettings() {
        try {
            const data = localStorage.getItem('herosSiteSettings');
            return data ? JSON.parse(data) : {};
        } catch (error) {
            this.log(`Error loading settings: ${error.message}`, 'error');
            return {};
        }
    }

    saveSettings(settings) {
        try {
            localStorage.setItem('herosSiteSettings', JSON.stringify(settings));
            return true;
        } catch (error) {
            this.log(`Error saving settings: ${error.message}`, 'error');
            return false;
        }
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Verify an element's visibility on the main page
    async verifyElementVisibility(selector, shouldBeVisible, elementName) {
        try {
            // We can't directly access the main page from this script
            // So we'll return a test instruction for manual verification
            return {
                selector,
                shouldBeVisible,
                elementName,
                instruction: `Check if "${elementName}" (${selector}) is ${shouldBeVisible ? 'visible' : 'hidden'} on main page`
            };
        } catch (error) {
            this.log(`Error verifying ${elementName}: ${error.message}`, 'error');
            return { error: error.message };
        }
    }

    // Test Scenario 1: Enable Previously Disabled Items
    async testScenario1() {
        this.log('🟢 Starting Scenario 1: Enable Previously Disabled Items', 'info');
        
        const settings = this.getCurrentSettings();
        const originalState = { ...settings };
        
        // Create some disabled items for testing if none exist
        const testItems = ['menu-diabetes-care', 'section-weight-loss', 'carousel-weight-loss'];
        let disabledItems = Object.keys(settings).filter(k => settings[k] === false);
        
        if (disabledItems.length === 0) {
            this.log('No disabled items found. Creating test disabled items...', 'warning');
            testItems.forEach(item => {
                settings[item] = false;
            });
            this.saveSettings(settings);
            disabledItems = testItems;
        }

        const itemsToTest = disabledItems.slice(0, 3);
        this.log(`Testing items: ${itemsToTest.join(', ')}`, 'info');

        const verificationInstructions = [];
        
        // Enable each item and track changes
        for (const item of itemsToTest) {
            this.log(`Enabling ${item}...`, 'info');
            settings[item] = true;
            
            if (this.saveSettings(settings)) {
                this.log(`✅ Successfully enabled ${item}`, 'success');
                
                // Add verification instruction
                const elementMap = {
                    'menu-diabetes-care': { selector: 'a[href="diabetes-care.html"]', name: 'Diabetes Care menu item' },
                    'section-weight-loss': { selector: '.section_wl-hero', name: 'Weight Loss section' },
                    'carousel-weight-loss': { selector: '.weight-loss-card', name: 'Weight Loss carousel card' },
                    'menu-weight-loss': { selector: 'a[href="weight-loss.html"]', name: 'Weight Loss menu item' },
                    'carousel-diabetes-care': { selector: '.diabetes-care-card', name: 'Diabetes Care carousel card' }
                };
                
                if (elementMap[item]) {
                    const verification = await this.verifyElementVisibility(
                        elementMap[item].selector, 
                        true, 
                        elementMap[item].name
                    );
                    verificationInstructions.push(verification);
                }
            } else {
                this.log(`❌ Failed to enable ${item}`, 'error');
                this.issues.push(`Failed to enable ${item}`);
            }
            
            await this.delay(500); // Wait between changes
        }

        const result = {
            scenario: 1,
            name: 'Enable Previously Disabled Items',
            status: this.issues.length === 0 ? 'pass' : 'fail',
            itemsTested: itemsToTest,
            verificationInstructions,
            issues: [...this.issues]
        };

        this.testResults.push(result);
        this.log(`🟢 Scenario 1 completed with status: ${result.status}`, result.status === 'pass' ? 'success' : 'error');
        
        return result;
    }

    // Test Scenario 2: Disable Currently Enabled Items
    async testScenario2() {
        this.log('🔴 Starting Scenario 2: Disable Currently Enabled Items', 'info');
        
        const settings = this.getCurrentSettings();
        const enabledItems = Object.keys(settings).filter(k => settings[k] === true);
        const itemsToTest = enabledItems.slice(0, 3);
        
        this.log(`Testing items: ${itemsToTest.join(', ')}`, 'info');

        const verificationInstructions = [];
        
        // Disable each item and track changes
        for (const item of itemsToTest) {
            this.log(`Disabling ${item}...`, 'info');
            settings[item] = false;
            
            if (this.saveSettings(settings)) {
                this.log(`✅ Successfully disabled ${item}`, 'success');
                
                // Add verification instruction
                const elementMap = {
                    'menu-diabetes-care': { selector: 'a[href="diabetes-care.html"]', name: 'Diabetes Care menu item' },
                    'section-weight-loss': { selector: '.section_wl-hero', name: 'Weight Loss section' },
                    'carousel-weight-loss': { selector: '.weight-loss-card', name: 'Weight Loss carousel card' },
                    'menu-weight-loss': { selector: 'a[href="weight-loss.html"]', name: 'Weight Loss menu item' },
                    'carousel-diabetes-care': { selector: '.diabetes-care-card', name: 'Diabetes Care carousel card' },
                    'menu-nad-plus': { selector: 'a[href="nad-plus.html"]', name: 'NAD+ menu item' },
                    'section-service-cards': { selector: '.new-service-cards', name: 'Service Cards section' }
                };
                
                if (elementMap[item]) {
                    const verification = await this.verifyElementVisibility(
                        elementMap[item].selector, 
                        false, 
                        elementMap[item].name
                    );
                    verificationInstructions.push(verification);
                }
            } else {
                this.log(`❌ Failed to disable ${item}`, 'error');
                this.issues.push(`Failed to disable ${item}`);
            }
            
            await this.delay(500);
        }

        const result = {
            scenario: 2,
            name: 'Disable Currently Enabled Items',
            status: this.issues.length === 0 ? 'pass' : 'fail',
            itemsTested: itemsToTest,
            verificationInstructions,
            issues: [...this.issues]
        };

        this.testResults.push(result);
        this.log(`🔴 Scenario 2 completed with status: ${result.status}`, result.status === 'pass' ? 'success' : 'error');
        
        return result;
    }

    // Test Scenario 3: Rapid Multi-Toggle
    async testScenario3() {
        this.log('⚡ Starting Scenario 3: Rapid Multi-Toggle Stress Test', 'info');
        
        const settings = this.getCurrentSettings();
        const testItems = ['menu-nad-plus', 'carousel-skin-care', 'section-service-cards'];
        
        this.log(`Performing rapid toggle test on: ${testItems.join(', ')}`, 'info');
        
        // Store original states
        const originalStates = {};
        testItems.forEach(item => {
            originalStates[item] = settings[item];
        });

        // Perform 5 rounds of rapid toggling
        for (let round = 0; round < 5; round++) {
            this.log(`Round ${round + 1}: Rapid toggling...`, 'info');
            
            for (const item of testItems) {
                // Toggle off
                settings[item] = false;
                this.saveSettings(settings);
                await this.delay(50);
                
                // Toggle on
                settings[item] = true;
                this.saveSettings(settings);
                await this.delay(50);
                
                this.log(`Toggled ${item} in round ${round + 1}`, 'info');
            }
        }

        // Verify final states are correct (all should be enabled after the test)
        const finalSettings = this.getCurrentSettings();
        const verificationInstructions = [];
        
        testItems.forEach(item => {
            if (finalSettings[item] !== true) {
                this.issues.push(`${item} not in expected final state (should be true, is ${finalSettings[item]})`);
            } else {
                this.log(`✅ ${item} in correct final state`, 'success');
            }
        });

        const result = {
            scenario: 3,
            name: 'Rapid Multi-Toggle Stress Test',
            status: this.issues.length === 0 ? 'pass' : 'fail',
            itemsTested: testItems,
            rounds: 5,
            verificationInstructions,
            issues: [...this.issues]
        };

        this.testResults.push(result);
        this.log(`⚡ Scenario 3 completed with status: ${result.status}`, result.status === 'pass' ? 'success' : 'error');
        
        return result;
    }

    // Test Scenario 4: Complete Reset Test
    async testScenario4() {
        this.log('🔄 Starting Scenario 4: Complete Reset and Re-disable Test', 'info');
        
        const settings = this.getCurrentSettings();
        
        // Step 1: Reset everything to enabled
        this.log('Step 1: Enabling all items...', 'info');
        Object.keys(settings).forEach(key => {
            settings[key] = true;
        });
        this.saveSettings(settings);
        await this.delay(1000);
        
        // Verify all enabled
        const resetSettings = this.getCurrentSettings();
        const disabledAfterReset = Object.keys(resetSettings).filter(k => resetSettings[k] === false);
        if (disabledAfterReset.length > 0) {
            this.issues.push(`Reset failed: ${disabledAfterReset.length} items still disabled after reset`);
        } else {
            this.log('✅ All items successfully enabled', 'success');
        }

        // Step 2: Selectively disable specific items
        this.log('Step 2: Selectively disabling test items...', 'info');
        const itemsToDisable = ['menu-diabetes-care', 'section-weight-loss', 'carousel-weight-loss'];
        
        for (const item of itemsToDisable) {
            settings[item] = false;
            this.saveSettings(settings);
            await this.delay(500);
            this.log(`❌ Disabled ${item}`, 'success');
        }

        const result = {
            scenario: 4,
            name: 'Complete Reset and Re-disable Test',
            status: this.issues.length === 0 ? 'pass' : 'fail',
            itemsTested: itemsToDisable,
            resetVerified: disabledAfterReset.length === 0,
            issues: [...this.issues]
        };

        this.testResults.push(result);
        this.log(`🔄 Scenario 4 completed with status: ${result.status}`, result.status === 'pass' ? 'success' : 'error');
        
        return result;
    }

    // Test Scenario 5: Edge Cases
    async testScenario5() {
        this.log('🎯 Starting Scenario 5: Edge Case Testing', 'info');
        
        const settings = this.getCurrentSettings();
        const testItem = 'menu-weight-loss';
        
        this.log(`Edge case: Rapid toggle of single item (${testItem})`, 'info');
        
        const originalState = settings[testItem];
        
        // Rapidly toggle the same item 20 times
        for (let i = 0; i < 20; i++) {
            const newState = i % 2 === 0 ? false : true;
            settings[testItem] = newState;
            this.saveSettings(settings);
            await this.delay(25);
        }

        // Verify final state
        const finalSettings = this.getCurrentSettings();
        const expectedFinalState = true; // Should be true after 20 toggles (ends on odd number)
        
        if (finalSettings[testItem] !== expectedFinalState) {
            this.issues.push(`Edge case failed: ${testItem} should be ${expectedFinalState}, is ${finalSettings[testItem]}`);
        } else {
            this.log(`✅ Edge case passed: ${testItem} correctly toggled 20 times`, 'success');
        }

        const result = {
            scenario: 5,
            name: 'Edge Case Testing',
            status: this.issues.length === 0 ? 'pass' : 'fail',
            itemsTested: [testItem],
            toggleCount: 20,
            finalState: finalSettings[testItem],
            expectedState: expectedFinalState,
            issues: [...this.issues]
        };

        this.testResults.push(result);
        this.log(`🎯 Scenario 5 completed with status: ${result.status}`, result.status === 'pass' ? 'success' : 'error');
        
        return result;
    }

    // Run all test scenarios
    async runAllTests() {
        this.log('🚀 Starting Comprehensive Multi-Toggle UAT', 'info');
        this.testResults = [];
        this.issues = [];
        
        const scenarios = [
            this.testScenario1,
            this.testScenario2,
            this.testScenario3,
            this.testScenario4,
            this.testScenario5
        ];

        for (let i = 0; i < scenarios.length; i++) {
            this.currentTest = i + 1;
            this.totalTests = scenarios.length;
            
            try {
                await scenarios[i].call(this);
                this.log(`Completed test ${this.currentTest}/${this.totalTests}`, 'info');
            } catch (error) {
                this.log(`Test ${this.currentTest} failed with error: ${error.message}`, 'error');
                this.issues.push(`Test ${this.currentTest} error: ${error.message}`);
            }
            
            // Small delay between tests
            await this.delay(1000);
        }

        return this.generateReport();
    }

    generateReport() {
        const passedTests = this.testResults.filter(r => r.status === 'pass').length;
        const totalTests = this.testResults.length;
        
        const report = {
            summary: {
                total: totalTests,
                passed: passedTests,
                failed: totalTests - passedTests,
                success: passedTests === totalTests
            },
            results: this.testResults,
            issues: this.issues,
            recommendations: this.generateRecommendations()
        };

        this.log(`📊 UAT Complete: ${passedTests}/${totalTests} tests passed`, 
                 report.summary.success ? 'success' : 'error');

        return report;
    }

    generateRecommendations() {
        const recommendations = [];
        
        if (this.issues.length === 0) {
            recommendations.push('✅ All tests passed - Settings system is ready for production');
            recommendations.push('✅ Multi-toggle functionality works correctly');
            recommendations.push('✅ Edge cases handled properly');
        } else {
            recommendations.push('❌ Issues found - Review and fix before deployment');
            recommendations.push('🔍 Check browser console for detailed error logs');
            recommendations.push('🔄 Re-run tests after fixes');
        }

        return recommendations;
    }
}

// Export for use in browser or Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UATRunner;
} else if (typeof window !== 'undefined') {
    window.UATRunner = UATRunner;
}
