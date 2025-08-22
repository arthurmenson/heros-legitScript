/**
 * Dynamic Toggle Panel for HEROS Settings
 * Provides real-time toggle controls that can be accessed from any page
 */

class HerosDynamicTogglePanel {
    constructor() {
        this.isVisible = false;
        this.settings = this.loadSettings();
        this.panel = null;
        this.init();
    }

    loadSettings() {
        try {
            const data = localStorage.getItem('herosSiteSettings');
            return data ? JSON.parse(data) : this.getDefaultSettings();
        } catch (error) {
            console.error('Error loading settings:', error);
            return this.getDefaultSettings();
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('herosSiteSettings', JSON.stringify(this.settings));
            // Trigger settings application
            if (window.applySettings && typeof window.applySettings === 'function') {
                window.applySettings();
            }
            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            return false;
        }
    }

    getDefaultSettings() {
        return {
            'menu-weight-loss': true,
            'menu-mens-ed': true,
            'menu-skin-care': true,
            'menu-hair-regrowth': true,
            'menu-nad-plus': true,
            'menu-diabetes-care': true,
            'section-weight-loss': true,
            'section-ed-meds': true,
            'section-results': true,
            'section-service-cards': true,
            'section-products': true,
            'carousel-weight-loss': true,
            'carousel-hair-regrowth': true,
            'carousel-mens-ed': true,
            'carousel-skin-care': true,
            'carousel-diabetes-care': true,
            'carousel-remote-monitoring': true,
            'carousel-nad-plus': true
        };
    }

    init() {
        this.createToggleButton();
        this.createPanel();
        this.addEventListeners();
    }

    createToggleButton() {
        const button = document.createElement('button');
        button.id = 'heros-toggle-btn';
        button.innerHTML = '⚙️';
        button.title = 'Toggle Settings Panel';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            font-size: 20px;
            cursor: pointer;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
            button.style.boxShadow = '0 6px 25px rgba(0,0,0,0.4)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
        });

        button.addEventListener('click', () => this.togglePanel());

        document.body.appendChild(button);
    }

    createPanel() {
        this.panel = document.createElement('div');
        this.panel.id = 'heros-toggle-panel';
        this.panel.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            width: 350px;
            max-height: 70vh;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 9999;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            overflow: hidden;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.2);
        `;

        this.panel.innerHTML = this.generatePanelHTML();
        document.body.appendChild(this.panel);
        
        // Add event listeners for toggles
        this.addToggleListeners();
    }

    generatePanelHTML() {
        const disabledCount = Object.keys(this.settings).filter(key => this.settings[key] === false).length;
        const totalCount = Object.keys(this.settings).length;

        return `
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; color: white;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0; font-size: 18px;">⚙️ Quick Settings</h3>
                    <button id="close-panel" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">×</button>
                </div>
                <div style="font-size: 12px; opacity: 0.9; margin-top: 5px;">
                    ${totalCount} total • ${disabledCount} disabled
                </div>
            </div>
            
            <div style="padding: 0; max-height: 50vh; overflow-y: auto;">
                ${this.generateToggleGroups()}
            </div>
            
            <div style="padding: 15px; background: #f8f9fa; border-top: 1px solid #dee2e6;">
                <div style="display: flex; gap: 10px;">
                    <button id="enable-all" style="flex: 1; padding: 8px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">Enable All</button>
                    <button id="disable-all" style="flex: 1; padding: 8px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">Disable All</button>
                    <button id="open-full-settings" style="flex: 1; padding: 8px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">Full Settings</button>
                </div>
            </div>
        `;
    }

    generateToggleGroups() {
        const groups = {
            'Navigation Menu': [
                { key: 'menu-weight-loss', label: 'Weight Loss' },
                { key: 'menu-mens-ed', label: "Men's ED" },
                { key: 'menu-skin-care', label: 'Skin Care' },
                { key: 'menu-hair-regrowth', label: 'Hair Regrowth' },
                { key: 'menu-nad-plus', label: 'NAD+' },
                { key: 'menu-diabetes-care', label: 'Diabetes Care' }
            ],
            'Homepage Sections': [
                { key: 'section-service-cards', label: 'Service Cards' },
                { key: 'section-products', label: 'Product Carousel' },
                { key: 'section-weight-loss', label: 'Weight Loss Section' },
                { key: 'section-ed-meds', label: 'ED Meds Section' },
                { key: 'section-results', label: 'Results Section' }
            ],
            'Product Carousel': [
                { key: 'carousel-weight-loss', label: 'Weight Loss Card' },
                { key: 'carousel-hair-regrowth', label: 'Hair Regrowth Card' },
                { key: 'carousel-mens-ed', label: "Men's ED Card" },
                { key: 'carousel-skin-care', label: 'Skin Care Card' },
                { key: 'carousel-diabetes-care', label: 'Diabetes Care Card' },
                { key: 'carousel-nad-plus', label: 'NAD+ Card' }
            ]
        };

        let html = '';
        
        Object.keys(groups).forEach(groupName => {
            html += `
                <div style="border-bottom: 1px solid #eee;">
                    <div style="padding: 12px 15px; background: #f8f9fa; font-weight: 600; font-size: 13px; color: #495057;">
                        ${groupName}
                    </div>
                    <div style="padding: 5px 0;">
            `;
            
            groups[groupName].forEach(item => {
                const isEnabled = this.settings[item.key] !== false;
                html += `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 15px; border-bottom: 1px solid #f0f0f0;">
                        <span style="font-size: 13px; color: #495057;">${item.label}</span>
                        <label style="position: relative; display: inline-block; width: 40px; height: 20px; cursor: pointer;">
                            <input type="checkbox" data-setting="${item.key}" ${isEnabled ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
                            <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: ${isEnabled ? '#28a745' : '#ccc'}; transition: 0.3s; border-radius: 20px;">
                                <span style="position: absolute; content: ''; height: 16px; width: 16px; left: ${isEnabled ? '22px' : '2px'}; bottom: 2px; background-color: white; transition: 0.3s; border-radius: 50%;"></span>
                            </span>
                        </label>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });

        return html;
    }

    addToggleListeners() {
        // Close button
        const closeBtn = this.panel.querySelector('#close-panel');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hidePanel());
        }

        // Toggle switches
        const toggles = this.panel.querySelectorAll('input[data-setting]');
        toggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                const settingKey = e.target.getAttribute('data-setting');
                const isEnabled = e.target.checked;
                
                this.settings[settingKey] = isEnabled;
                this.saveSettings();
                this.updateToggleAppearance(e.target, isEnabled);
                
                // Apply settings immediately
                setTimeout(() => {
                    if (window.applySettings && typeof window.applySettings === 'function') {
                        window.applySettings();
                    }
                }, 100);

                console.log(`${isEnabled ? 'Enabled' : 'Disabled'}: ${settingKey}`);
            });
        });

        // Bulk actions
        const enableAllBtn = this.panel.querySelector('#enable-all');
        if (enableAllBtn) {
            enableAllBtn.addEventListener('click', () => this.enableAll());
        }

        const disableAllBtn = this.panel.querySelector('#disable-all');
        if (disableAllBtn) {
            disableAllBtn.addEventListener('click', () => this.disableAll());
        }

        const fullSettingsBtn = this.panel.querySelector('#open-full-settings');
        if (fullSettingsBtn) {
            fullSettingsBtn.addEventListener('click', () => {
                window.open('settings.html', '_blank');
            });
        }
    }

    updateToggleAppearance(toggle, isEnabled) {
        const slider = toggle.nextElementSibling;
        const knob = slider.querySelector('span');
        
        slider.style.backgroundColor = isEnabled ? '#28a745' : '#ccc';
        knob.style.left = isEnabled ? '22px' : '2px';
    }

    enableAll() {
        Object.keys(this.settings).forEach(key => {
            this.settings[key] = true;
        });
        
        this.saveSettings();
        this.refreshPanel();
        
        setTimeout(() => {
            if (window.applySettings && typeof window.applySettings === 'function') {
                window.applySettings();
            }
        }, 100);

        console.log('✅ All settings enabled');
    }

    disableAll() {
        if (confirm('Disable all settings? This will hide most content on the site.')) {
            Object.keys(this.settings).forEach(key => {
                this.settings[key] = false;
            });
            
            this.saveSettings();
            this.refreshPanel();
            
            setTimeout(() => {
                if (window.applySettings && typeof window.applySettings === 'function') {
                    window.applySettings();
                }
            }, 100);

            console.log('❌ All settings disabled');
        }
    }

    refreshPanel() {
        this.panel.innerHTML = this.generatePanelHTML();
        this.addToggleListeners();
    }

    togglePanel() {
        if (this.isVisible) {
            this.hidePanel();
        } else {
            this.showPanel();
        }
    }

    showPanel() {
        this.panel.style.transform = 'translateX(0)';
        this.isVisible = true;
        
        // Refresh panel content
        this.refreshPanel();
    }

    hidePanel() {
        this.panel.style.transform = 'translateX(400px)';
        this.isVisible = false;
    }

    addEventListeners() {
        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isVisible && 
                !this.panel.contains(e.target) && 
                !document.getElementById('heros-toggle-btn').contains(e.target)) {
                this.hidePanel();
            }
        });

        // Keyboard shortcut: Ctrl+Shift+S
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                this.togglePanel();
            }
        });

        // Listen for storage changes from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === 'herosSiteSettings') {
                this.settings = this.loadSettings();
                if (this.isVisible) {
                    this.refreshPanel();
                }
            }
        });
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new HerosDynamicTogglePanel();
    });
} else {
    new HerosDynamicTogglePanel();
}

// Make it globally accessible
window.HerosDynamicTogglePanel = HerosDynamicTogglePanel;
