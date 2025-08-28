/**
 * Mobile View Manager
 * Ensures proper mobile/desktop view switching and management
 */

(function() {
  'use strict';
  
  const MobileManager = {
    // Configuration
    breakpoint: 991,
    mobileClass: 'mobile-view',
    desktopClass: 'desktop-view',
    
    // Initialize the manager
    init() {
      this.detectInitialView();
      this.addResizeListener();
      this.addDebugInfo();
      console.log('📱 Mobile View Manager initialized');
    },
    
    // Detect initial view based on viewport width
    detectInitialView() {
      const width = window.innerWidth;
      const isMobile = width <= this.breakpoint;
      
      if (isMobile) {
        this.activateMobileView();
      } else {
        this.activateDesktopView();
      }
      
      console.log(`🔍 Initial view detected: ${isMobile ? 'Mobile' : 'Desktop'} (${width}px)`);
    },
    
    // Activate mobile view
    activateMobileView() {
      document.body.classList.add(this.mobileClass);
      document.body.classList.remove(this.desktopClass);
      
      // Ensure mobile layout is visible
      const mobileLayout = document.querySelector('.mobile-layout');
      if (mobileLayout) {
        mobileLayout.style.display = 'block';
      }
      
      // Hide desktop elements
      const desktopElements = document.querySelectorAll('.main-wrapper, .nav_component');
      desktopElements.forEach(el => {
        el.style.display = 'none';
      });
      
      // Add mobile-specific optimizations
      this.addMobileOptimizations();
    },
    
    // Activate desktop view
    activateDesktopView() {
      document.body.classList.add(this.desktopClass);
      document.body.classList.remove(this.mobileClass);
      
      // Hide mobile layout
      const mobileLayout = document.querySelector('.mobile-layout');
      if (mobileLayout) {
        mobileLayout.style.display = 'none';
      }
      
      // Show desktop elements
      const desktopElements = document.querySelectorAll('.main-wrapper, .nav_component');
      desktopElements.forEach(el => {
        el.style.display = 'block';
      });
    },
    
    // Add mobile-specific optimizations
    addMobileOptimizations() {
      // Add touch-action optimization
      document.body.style.touchAction = 'manipulation';
      
      // Add viewport meta tag if missing
      if (!document.querySelector('meta[name="viewport"]')) {
        const viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
        document.head.appendChild(viewport);
      }
      
      // Preload critical mobile resources
      this.preloadMobileResources();
    },
    
    // Preload critical mobile resources
    preloadMobileResources() {
      const criticalImages = [
        'https://api.builder.io/api/v1/image/assets/TEMP/85b94321137cebe1d9763b9dceaaf810bccc07fb?width=306',
        'https://api.builder.io/api/v1/image/assets/TEMP/ddc7f0f467b487fddc1d6a8f188336d2758503c7?width=326'
      ];
      
      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    },
    
    // Add resize listener with debouncing
    addResizeListener() {
      let resizeTimeout;
      
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          const width = window.innerWidth;
          const shouldBeMobile = width <= this.breakpoint;
          const currentlyMobile = document.body.classList.contains(this.mobileClass);
          
          if (shouldBeMobile && !currentlyMobile) {
            this.activateMobileView();
            console.log(`📱 Switched to mobile view (${width}px)`);
          } else if (!shouldBeMobile && currentlyMobile) {
            this.activateDesktopView();
            console.log(`🖥️ Switched to desktop view (${width}px)`);
          }
        }, 150);
      });
    },
    
    // Add debug information
    addDebugInfo() {
      console.log(`📊 Mobile Manager Config:
        - Breakpoint: ${this.breakpoint}px
        - Current width: ${window.innerWidth}px
        - Current view: ${document.body.classList.contains(this.mobileClass) ? 'Mobile' : 'Desktop'}
        - Mobile class: ${this.mobileClass}
        - Desktop class: ${this.desktopClass}`);
    },
    
    // Force mobile view (for testing)
    forceMobile() {
      this.activateMobileView();
      console.log('🔧 Forced mobile view activation');
    },
    
    // Force desktop view (for testing)
    forceDesktop() {
      this.activateDesktopView();
      console.log('🔧 Forced desktop view activation');
    },
    
    // Get current view info
    getViewInfo() {
      return {
        width: window.innerWidth,
        isMobile: window.innerWidth <= this.breakpoint,
        currentView: document.body.classList.contains(this.mobileClass) ? 'mobile' : 'desktop',
        mobileLayoutVisible: document.querySelector('.mobile-layout')?.style.display !== 'none'
      };
    }
  };
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => MobileManager.init());
  } else {
    MobileManager.init();
  }
  
  // Expose to global scope for testing
  window.MobileManager = MobileManager;
  
})();
