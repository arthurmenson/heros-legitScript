# 🏥 Heros Health Production Troubleshooting Guide

## Preview Functionality Issues on heroshealth.com

This guide provides step-by-step solutions for resolving preview functionality issues in `settings.html` on the production domain heroshealth.com.

---

## 🚨 Quick Fixes

### 1. Immediate Steps (Do These First)

1. **Clear Browser Cache**
   ```
   - Press Ctrl+F5 (Windows) or Cmd+Shift+R (Mac) to hard refresh
   - Or go to Settings > Privacy > Clear browsing data
   ```

2. **Check Console for Errors**
   ```
   - Press F12 to open Developer Tools
   - Go to Console tab
   - Look for red error messages
   - Copy any errors for debugging
   ```

3. **Test LocalStorage Access**
   ```javascript
   // Run this in the browser console:
   localStorage.setItem('test', 'working');
   console.log('Test:', localStorage.getItem('test'));
   localStorage.removeItem('test');
   ```

---

## 🔧 Automatic Fixes

### Production Test Plan (Recommended)
1. Open: `https://heroshealth.com/production-testplan.html`
2. Click **"Run All Tests"**
3. Review results and apply suggested fixes
4. If tests fail, click **"Apply Production Fixes"**

### Quick Fix Scripts
```javascript
// Run these in the browser console on heroshealth.com/settings.html

// 1. Load production fixes
const fixScript = document.createElement('script');
fixScript.src = 'production-preview-fix.js';
document.head.appendChild(fixScript);

// 2. Test preview functionality
setTimeout(() => {
  if (typeof ProductionPreviewFix !== 'undefined') {
    ProductionPreviewFix.diagnose();
  }
}, 2000);
```

---

## 🔍 Diagnosis Steps

### Step 1: Check Domain and Setup
```javascript
// Run in console to verify domain detection
console.log('Domain:', window.location.hostname);
console.log('Is Production:', window.location.hostname.includes('heroshealth.com'));
```

**Expected Output:**
```
Domain: heroshealth.com (or subdomain.heroshealth.com)
Is Production: true
```

### Step 2: Verify Required Files
Check that these files exist and are accessible:
- ✅ `settings.html`
- ✅ `index.html`
- ✅ `production-preview-fix.js`
- ✅ `realtime-sync-fix.js`
- ✅ `production-quickfix.js`

**Test Access:**
```javascript
// Test file accessibility
fetch('production-preview-fix.js', {method: 'HEAD'})
  .then(r => console.log('Preview fix:', r.ok ? 'OK' : 'Missing'))
  .catch(e => console.log('Preview fix: Error', e));
```

### Step 3: Check DOM Elements
```javascript
// Verify required DOM elements exist
const elements = {
  'Preview Section': document.getElementById('preview-section'),
  'Preview Iframe': document.getElementById('preview-iframe'),
  'Toggle Elements': document.querySelectorAll('.toggle').length
};

Object.entries(elements).forEach(([name, element]) => {
  console.log(`${name}:`, element ? 'Found' : 'Missing');
});
```

### Step 4: Test Functions
```javascript
// Check if required functions are available
const functions = ['togglePreview', 'refreshPreview', 'saveSettings', 'applySettings'];
functions.forEach(fn => {
  console.log(`${fn}:`, typeof window[fn] === 'function' ? 'Available' : 'Missing');
});
```

---

## 🛠️ Manual Fixes

### Fix 1: Preview Section Not Showing

**Problem:** Clicking "Live Preview" button does nothing

**Solution:**
```javascript
// 1. Check if preview section exists
const previewSection = document.getElementById('preview-section');
if (!previewSection) {
  console.error('Preview section missing from DOM');
  // This indicates a fundamental HTML structure issue
}

// 2. Force show preview section
if (previewSection) {
  previewSection.style.display = 'block';
  console.log('Preview section forced visible');
}

// 3. Check iframe source
const iframe = document.getElementById('preview-iframe');
if (iframe) {
  console.log('Iframe src:', iframe.src);
  if (!iframe.src || iframe.src === 'about:blank') {
    iframe.src = window.location.origin + '/index.html?preview=true';
    console.log('Iframe source fixed');
  }
}
```

### Fix 2: Iframe Not Loading

**Problem:** Preview iframe shows blank or error page

**Solution:**
```javascript
// Enhanced iframe loading for production
function fixIframeLoading() {
  const iframe = document.getElementById('preview-iframe');
  if (!iframe) return;
  
  // Clear current source
  iframe.src = 'about:blank';
  
  setTimeout(() => {
    // Set production-optimized URL
    const baseURL = window.location.origin;
    const params = new URLSearchParams({
      preview: 'true',
      source: 'settings',
      timestamp: Date.now(),
      domain: window.location.hostname
    });
    
    const fullURL = `${baseURL}/index.html?${params.toString()}`;
    console.log('Loading iframe URL:', fullURL);
    
    iframe.src = fullURL;
    
    // Monitor loading
    iframe.onload = () => console.log('✅ Iframe loaded successfully');
    iframe.onerror = () => console.error('❌ Iframe failed to load');
    
    // Timeout fallback
    setTimeout(() => {
      if (iframe.src === fullURL && !iframe.contentDocument) {
        console.log('⏰ Iframe load timeout, trying fallback...');
        iframe.src = baseURL + '/index.html';
      }
    }, 10000);
    
  }, 300);
}

// Run the fix
fixIframeLoading();
```

### Fix 3: Settings Not Applying to Preview

**Problem:** Toggle changes don't reflect in preview

**Solution:**
```javascript
// Enhanced settings sync for preview
function fixPreviewSync() {
  // 1. Force save current settings
  const toggles = document.querySelectorAll('.toggle');
  const settings = {};
  
  toggles.forEach(toggle => {
    const setting = toggle.getAttribute('data-setting');
    if (setting) {
      settings[setting] = toggle.classList.contains('active');
    }
  });
  
  localStorage.setItem('herosSiteSettings', JSON.stringify(settings));
  console.log('✅ Settings force-saved:', Object.keys(settings).length, 'items');
  
  // 2. Create change notification
  const changeNotification = {
    timestamp: Date.now(),
    action: 'manual-preview-sync',
    domain: window.location.hostname,
    source: 'troubleshooting-fix'
  };
  localStorage.setItem('herosSettingsChange', JSON.stringify(changeNotification));
  
  // 3. Notify iframe if it exists
  const iframe = document.getElementById('preview-iframe');
  if (iframe && iframe.contentWindow) {
    try {
      iframe.contentWindow.postMessage({
        type: 'heroSettingChanged',
        action: 'force-sync',
        timestamp: Date.now()
      }, '*');
      console.log('📨 Sync message sent to iframe');
    } catch (e) {
      console.log('⚠️ Could not message iframe (cross-origin)');
    }
  }
  
  // 4. Force iframe refresh
  setTimeout(() => {
    if (iframe && iframe.src) {
      const currentSrc = iframe.src;
      iframe.src = currentSrc.includes('?') 
        ? currentSrc + '&refresh=' + Date.now()
        : currentSrc + '?refresh=' + Date.now();
      console.log('🔄 Iframe refreshed for sync');
    }
  }, 500);
}

// Run the fix
fixPreviewSync();
```

### Fix 4: Toggle Buttons Not Working

**Problem:** Can't click toggle buttons to change settings

**Solution:**
```javascript
// Restore toggle functionality
function fixToggleFunctionality() {
  const toggles = document.querySelectorAll('.toggle');
  console.log(`Found ${toggles.length} toggle elements`);
  
  toggles.forEach((toggle, index) => {
    // Remove existing listeners
    toggle.replaceWith(toggle.cloneNode(true));
  });
  
  // Re-add event listeners to the new elements
  const newToggles = document.querySelectorAll('.toggle');
  newToggles.forEach((toggle, index) => {
    toggle.addEventListener('click', function(event) {
      event.preventDefault();
      event.stopPropagation();
      
      const setting = this.getAttribute('data-setting');
      if (!setting) {
        console.error(`Toggle ${index} missing data-setting attribute`);
        return;
      }
      
      const isActive = this.classList.contains('active');
      const newState = !isActive;
      
      // Update visual state
      if (newState) {
        this.classList.add('active');
      } else {
        this.classList.remove('active');
      }
      
      // Update settings object
      const currentSettings = JSON.parse(localStorage.getItem('herosSiteSettings') || '{}');
      currentSettings[setting] = newState;
      localStorage.setItem('herosSiteSettings', JSON.stringify(currentSettings));
      
      // Create change notification
      const changeNotification = {
        timestamp: Date.now(),
        setting: setting,
        value: newState,
        action: 'manual-toggle-fix'
      };
      localStorage.setItem('herosSettingsChange', JSON.stringify(changeNotification));
      
      console.log(`✅ Toggle fixed: ${setting} = ${newState}`);
      
      // Update preview if visible
      const previewSection = document.getElementById('preview-section');
      if (previewSection && previewSection.style.display !== 'none') {
        setTimeout(() => fixPreviewSync(), 200);
      }
    });
    
    console.log(`✅ Toggle ${index} event listener restored`);
  });
}

// Run the fix
fixToggleFunctionality();
```

---

## 🔬 Advanced Debugging

### Complete Diagnostic Scan
```javascript
// Run comprehensive diagnostics
function runCompleteDiagnostics() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    domain: window.location.hostname,
    pathname: window.location.pathname,
    userAgent: navigator.userAgent,
    
    // DOM Elements
    dom: {
      previewSection: !!document.getElementById('preview-section'),
      previewIframe: !!document.getElementById('preview-iframe'),
      toggleCount: document.querySelectorAll('.toggle').length,
      debugPanel: !!document.getElementById('debug-panel')
    },
    
    // Functions
    functions: {
      togglePreview: typeof window.togglePreview === 'function',
      refreshPreview: typeof window.refreshPreview === 'function',
      saveSettings: typeof window.saveSettings === 'function',
      applySettings: typeof window.applySettings === 'function'
    },
    
    // Storage
    storage: {
      accessible: (() => {
        try {
          localStorage.setItem('test', 'test');
          localStorage.removeItem('test');
          return true;
        } catch (e) {
          return false;
        }
      })(),
      settingsExist: !!localStorage.getItem('herosSiteSettings'),
      settingsCount: (() => {
        try {
          const settings = localStorage.getItem('herosSiteSettings');
          return settings ? Object.keys(JSON.parse(settings)).length : 0;
        } catch (e) {
          return 0;
        }
      })(),
      changeNotifications: !!localStorage.getItem('herosSettingsChange')
    },
    
    // Scripts
    scripts: {
      herosSync: typeof window.HerosSyncFix !== 'undefined',
      productionFix: typeof window.HerosProductionFix !== 'undefined',
      previewFix: typeof window.ProductionPreviewFix !== 'undefined'
    },
    
    // Errors
    errors: []
  };
  
  console.log('🔬 Complete Diagnostics:', diagnostics);
  
  // Store diagnostics for support
  try {
    localStorage.setItem('heros-production-diagnostics', JSON.stringify(diagnostics));
    console.log('💾 Diagnostics saved to localStorage');
  } catch (e) {
    console.log('⚠️ Could not save diagnostics');
  }
  
  return diagnostics;
}

// Run diagnostics
runCompleteDiagnostics();
```

### Reset Everything (Nuclear Option)
```javascript
// Complete reset - use only if everything else fails
function nuclearReset() {
  if (!confirm('🚨 This will reset ALL settings and cached data. Continue?')) {
    return;
  }
  
  console.log('🔥 Starting nuclear reset...');
  
  // 1. Clear all heros-related localStorage
  Object.keys(localStorage).forEach(key => {
    if (key.includes('heros') || key.includes('Heros')) {
      localStorage.removeItem(key);
    }
  });
  
  // 2. Reload the page
  setTimeout(() => {
    window.location.reload(true);
  }, 1000);
  
  console.log('✅ Nuclear reset complete - page will reload');
}

// Uncomment to run (be careful!)
// nuclearReset();
```

---

## 📞 Getting Help

### Information to Collect
Before contacting support, gather this information:

1. **Browser Console Output**
   - Press F12 → Console tab
   - Copy all messages (especially errors in red)

2. **Diagnostic Data**
   - Run the complete diagnostic scan above
   - Copy the output

3. **Steps to Reproduce**
   - Exact sequence of actions that cause the issue
   - What you expected vs. what happened

4. **Environment Details**
   - Browser name and version
   - Operating system
   - Time when issue occurred

### Temporary Workarounds

If preview still doesn't work, try these alternatives:

1. **Direct Window Testing**
   ```javascript
   // Open main site in new window for testing
   window.open(window.location.origin + '/index.html?test=true', '_blank');
   ```

2. **Manual Settings Application**
   ```javascript
   // Force apply current settings
   if (typeof saveSettings === 'function') saveSettings();
   ```

3. **Alternative Preview Method**
   - Open settings.html in one tab
   - Open index.html in another tab
   - Make changes in settings tab
   - Refresh main site tab to see changes

---

## ✅ Success Checklist

After applying fixes, verify these work:

- [ ] Preview section shows when clicking "Live Preview" button
- [ ] Preview iframe loads index.html correctly
- [ ] Toggle buttons can be clicked and change state
- [ ] Settings changes reflect immediately in preview
- [ ] No red errors in browser console
- [ ] localStorage access is working
- [ ] Cross-tab communication is functional

---

## 🔄 Prevention

To prevent future issues:

1. **Regular Testing**
   - Test preview functionality after any site updates
   - Run the production test plan monthly

2. **Cache Management**
   - Clear browser cache after deployments
   - Use hard refresh (Ctrl+F5) for testing

3. **Monitoring**
   - Check browser console regularly
   - Monitor for JavaScript errors

4. **Backup Settings**
   - Use "Generate Share URL" to backup settings
   - Keep a record of working configurations

---

## 📋 Quick Reference

### Essential Console Commands
```javascript
// Test preview functionality
window.togglePreview();

// Force refresh preview
window.refreshPreview();

// Check settings data
console.log(JSON.parse(localStorage.getItem('herosSiteSettings')));

// Manual sync
if (typeof ProductionPreviewFix !== 'undefined') {
  ProductionPreviewFix.refresh();
}

// Run diagnostics
if (typeof ProductionPreviewFix !== 'undefined') {
  ProductionPreviewFix.diagnose();
}
```

### File Paths (Production)
- Settings: `https://heroshealth.com/settings.html`
- Test Plan: `https://heroshealth.com/production-testplan.html`
- Main Site: `https://heroshealth.com/index.html`
- Troubleshooting: `https://heroshealth.com/PRODUCTION-TROUBLESHOOTING.md`

---

*Last Updated: Production Troubleshooting Guide v1.0*
*For technical support, run the diagnostic tools and collect the output before contacting the development team.*
