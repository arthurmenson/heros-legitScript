/**
 * Mobile Development Helper
 * Adds keyboard shortcuts and visual helpers for mobile development
 */

(function() {
  'use strict';
  
  // Create development overlay
  function createDevOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'mobile-dev-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px;
      border-radius: 5px;
      font-family: monospace;
      font-size: 12px;
      z-index: 9999;
      display: none;
    `;
    
    const currentMode = document.body.classList.contains('mobile-view') ? 'Mobile' : 'Desktop';
    const screenWidth = window.innerWidth;
    
    overlay.innerHTML = `
      <div>Mode: ${currentMode}</div>
      <div>Width: ${screenWidth}px</div>
      <div>Breakpoint: ${screenWidth <= 991 ? 'Mobile' : 'Desktop'}</div>
      <div style="margin-top: 5px; border-top: 1px solid #333; padding-top: 5px;">
        <div>⌨️ M - Toggle Mobile</div>
        <div>⌨️ D - Toggle Desktop</div>
        <div>⌨️ H - Hide this overlay</div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    return overlay;
  }
  
  // Toggle between mobile and desktop views
  function toggleMobileView() {
    document.body.classList.toggle('mobile-view');
    document.body.classList.toggle('desktop-view');
    updateDevOverlay();
    console.log('🔄 Toggled to:', document.body.classList.contains('mobile-view') ? 'Mobile View' : 'Desktop View');
  }
  
  // Force mobile view
  function forceMobileView() {
    document.body.classList.add('mobile-view');
    document.body.classList.remove('desktop-view');
    updateDevOverlay();
    console.log('📱 Forced Mobile View');
  }
  
  // Force desktop view
  function forceDesktopView() {
    document.body.classList.add('desktop-view');
    document.body.classList.remove('mobile-view');
    updateDevOverlay();
    console.log('🖥️ Forced Desktop View');
  }
  
  // Update development overlay
  function updateDevOverlay() {
    const overlay = document.getElementById('mobile-dev-overlay');
    if (overlay && overlay.style.display !== 'none') {
      document.body.removeChild(overlay);
      createDevOverlay().style.display = 'block';
    }
  }
  
  // Show/hide development overlay
  function toggleDevOverlay() {
    let overlay = document.getElementById('mobile-dev-overlay');
    if (!overlay) {
      overlay = createDevOverlay();
    }
    overlay.style.display = overlay.style.display === 'none' ? 'block' : 'none';
  }
  
  // Keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    // Only activate if no input is focused
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
      return;
    }
    
    switch(e.key.toLowerCase()) {
      case 'm':
        forceMobileView();
        break;
      case 'd':
        forceDesktopView();
        break;
      case 'h':
        toggleDevOverlay();
        break;
      case 't':
        toggleMobileView();
        break;
    }
  });
  
  // Window resize handler
  window.addEventListener('resize', function() {
    updateDevOverlay();
  });
  
  // Auto-show overlay on page load (only in development)
  if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
    setTimeout(() => {
      toggleDevOverlay();
    }, 1000);
  }
  
  // Add to global scope for console access
  window.mobileDev = {
    mobile: forceMobileView,
    desktop: forceDesktopView,
    toggle: toggleMobileView,
    overlay: toggleDevOverlay
  };
  
  console.log('🛠️ Mobile Dev Helper loaded! Use mobileDev.mobile(), mobileDev.desktop(), or keyboard shortcuts M/D/H/T');
})();
