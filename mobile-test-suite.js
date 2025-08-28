/**
 * Mobile View Test Suite
 * Comprehensive testing for mobile functionality
 */

class MobileTestSuite {
  constructor() {
    this.results = [];
    this.passedTests = 0;
    this.failedTests = 0;
  }

  // Run all tests
  async runAllTests() {
    console.log('🧪 Starting Mobile Test Suite...\n');
    
    await this.testMobileViewActivation();
    await this.testAccessibility();
    await this.testPerformance();
    await this.testResponsiveness();
    await this.testNavigation();
    await this.testImages();
    await this.testTouchTargets();
    await this.testLayoutConsistency();
    
    this.printResults();
    return this.getTestSummary();
  }

  // Test mobile view activation
  async testMobileViewActivation() {
    console.log('🔄 Testing Mobile View Activation...');
    
    try {
      // Test viewport detection
      this.assert(
        typeof window.MobileManager !== 'undefined',
        'MobileManager should be loaded'
      );
      
      // Test mobile class application
      const isMobileWidth = window.innerWidth <= 991;
      const hasMobileClass = document.body.classList.contains('mobile-view');
      
      if (isMobileWidth) {
        this.assert(
          hasMobileClass,
          'Body should have mobile-view class when viewport is mobile'
        );
        
        this.assert(
          document.querySelector('.mobile-layout').style.display !== 'none',
          'Mobile layout should be visible on mobile viewport'
        );
      }
      
      // Test view switching
      window.MobileManager.forceMobile();
      this.assert(
        document.body.classList.contains('mobile-view'),
        'Should be able to force mobile view'
      );
      
      window.MobileManager.forceDesktop();
      this.assert(
        document.body.classList.contains('desktop-view'),
        'Should be able to force desktop view'
      );
      
      // Reset to proper view
      window.MobileManager.detectInitialView();
      
    } catch (error) {
      this.recordTest('Mobile View Activation', false, error.message);
    }
  }

  // Test accessibility features
  async testAccessibility() {
    console.log('♿ Testing Accessibility Features...');
    
    try {
      // Test ARIA labels
      const navButtons = document.querySelectorAll('.mobile-nav-icon[aria-label]');
      this.assert(
        navButtons.length >= 2,
        'Navigation buttons should have ARIA labels'
      );
      
      // Test SVG accessibility
      const svgsWithAriaHidden = document.querySelectorAll('.mobile-layout svg[aria-hidden="true"]');
      this.assert(
        svgsWithAriaHidden.length > 0,
        'Decorative SVGs should have aria-hidden="true"'
      );
      
      // Test image alt text
      const images = document.querySelectorAll('.mobile-layout img');
      let allImagesHaveAlt = true;
      images.forEach(img => {
        if (!img.alt || img.alt.trim().length < 3) {
          allImagesHaveAlt = false;
        }
      });
      
      this.assert(
        allImagesHaveAlt,
        'All images should have descriptive alt text'
      );
      
      // Test color contrast (basic check)
      const bannerText = document.querySelector('.mobile-banner-text');
      if (bannerText) {
        const styles = window.getComputedStyle(bannerText);
        const opacity = parseFloat(styles.opacity);
        this.assert(
          opacity >= 0.7,
          'Banner text should have sufficient opacity for contrast'
        );
      }
      
      this.recordTest('Accessibility Features', true);
      
    } catch (error) {
      this.recordTest('Accessibility Features', false, error.message);
    }
  }

  // Test performance optimizations
  async testPerformance() {
    console.log('⚡ Testing Performance Optimizations...');
    
    try {
      // Test lazy loading
      const lazyImages = document.querySelectorAll('.mobile-layout img[loading="lazy"]');
      this.assert(
        lazyImages.length > 0,
        'Images should have lazy loading enabled'
      );
      
      // Test touch action optimization
      const touchOptimizedElements = document.querySelectorAll('[style*="touch-action"]');
      const bodyTouchAction = window.getComputedStyle(document.body).touchAction;
      
      this.assert(
        bodyTouchAction === 'manipulation' || touchOptimizedElements.length > 0,
        'Touch action should be optimized for mobile'
      );
      
      // Test viewport meta tag
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      this.assert(
        viewportMeta && viewportMeta.content.includes('width=device-width'),
        'Viewport meta tag should be properly configured'
      );
      
      this.recordTest('Performance Optimizations', true);
      
    } catch (error) {
      this.recordTest('Performance Optimizations', false, error.message);
    }
  }

  // Test responsiveness
  async testResponsiveness() {
    console.log('📱 Testing Responsiveness...');
    
    try {
      // Test mobile layout existence
      const mobileLayout = document.querySelector('.mobile-layout');
      this.assert(
        mobileLayout !== null,
        'Mobile layout container should exist'
      );
      
      // Test card responsiveness
      const serviceCards = document.querySelectorAll('.mobile-service-card-horizontal');
      this.assert(
        serviceCards.length > 0,
        'Mobile service cards should exist'
      );
      
      // Test flexible grid
      const topServices = document.querySelector('.mobile-top-services');
      if (topServices) {
        const styles = window.getComputedStyle(topServices);
        this.assert(
          styles.display === 'grid',
          'Top services should use CSS Grid'
        );
      }
      
      this.recordTest('Responsiveness', true);
      
    } catch (error) {
      this.recordTest('Responsiveness', false, error.message);
    }
  }

  // Test navigation functionality
  async testNavigation() {
    console.log('🧭 Testing Navigation...');
    
    try {
      // Test mobile navigation exists
      const mobileNav = document.querySelector('.mobile-nav');
      this.assert(
        mobileNav !== null,
        'Mobile navigation should exist'
      );
      
      // Test logo
      const logo = document.querySelector('.mobile-logo');
      this.assert(
        logo && logo.textContent.trim() === 'heros.',
        'Mobile logo should be present and correct'
      );
      
      // Test navigation buttons
      const navButtons = document.querySelectorAll('.mobile-nav-icon');
      this.assert(
        navButtons.length >= 2,
        'Should have cart and menu buttons'
      );
      
      this.recordTest('Navigation', true);
      
    } catch (error) {
      this.recordTest('Navigation', false, error.message);
    }
  }

  // Test images
  async testImages() {
    console.log('🖼️ Testing Images...');
    
    try {
      const images = document.querySelectorAll('.mobile-layout img');
      
      // Test image loading
      let imagesWithSrc = 0;
      images.forEach(img => {
        if (img.src && img.src.length > 0) {
          imagesWithSrc++;
        }
      });
      
      this.assert(
        imagesWithSrc === images.length,
        'All images should have valid src attributes'
      );
      
      // Test image optimization
      const builderImages = Array.from(images).filter(img => 
        img.src.includes('builder.io') && img.src.includes('width=')
      );
      
      this.assert(
        builderImages.length > 0,
        'Builder.io images should have width optimization parameters'
      );
      
      this.recordTest('Images', true);
      
    } catch (error) {
      this.recordTest('Images', false, error.message);
    }
  }

  // Test touch targets
  async testTouchTargets() {
    console.log('👆 Testing Touch Targets...');
    
    try {
      const touchTargets = document.querySelectorAll('.mobile-layout button, .mobile-layout a.card-cta, .mobile-layout a.card-cta-primary, .mobile-layout a.card-cta-secondary');
      
      let adequateTouchTargets = 0;
      touchTargets.forEach(target => {
        const rect = target.getBoundingClientRect();
        const styles = window.getComputedStyle(target);
        const minHeight = parseInt(styles.minHeight) || rect.height;
        const minWidth = parseInt(styles.minWidth) || rect.width;
        
        if (minHeight >= 44 && minWidth >= 44) {
          adequateTouchTargets++;
        }
      });
      
      const percentage = (adequateTouchTargets / touchTargets.length) * 100;
      this.assert(
        percentage >= 80,
        `At least 80% of touch targets should be 44px+ (current: ${percentage.toFixed(1)}%)`
      );
      
      this.recordTest('Touch Targets', true);
      
    } catch (error) {
      this.recordTest('Touch Targets', false, error.message);
    }
  }

  // Test layout consistency
  async testLayoutConsistency() {
    console.log('📐 Testing Layout Consistency...');
    
    try {
      // Test card structure consistency
      const horizontalCards = document.querySelectorAll('.mobile-service-card-horizontal');
      
      horizontalCards.forEach((card, index) => {
        const content = card.querySelector('.card-content');
        const title = card.querySelector('.card-title');
        const actions = card.querySelector('.card-actions');
        
        this.assert(
          content && title,
          `Card ${index + 1} should have content and title`
        );
      });
      
      // Test mobile hero consistency
      const heroTitle = document.querySelector('.mobile-hero-title');
      const heroSubtitle = document.querySelector('.mobile-hero-subtitle');
      
      this.assert(
        heroTitle && heroSubtitle,
        'Mobile hero should have title and subtitle'
      );
      
      this.recordTest('Layout Consistency', true);
      
    } catch (error) {
      this.recordTest('Layout Consistency', false, error.message);
    }
  }

  // Helper methods
  assert(condition, message) {
    if (condition) {
      console.log(`✅ ${message}`);
      this.passedTests++;
    } else {
      console.log(`❌ ${message}`);
      this.failedTests++;
      throw new Error(message);
    }
  }

  recordTest(testName, passed, error = null) {
    this.results.push({
      name: testName,
      passed,
      error,
      timestamp: new Date().toISOString()
    });
    
    if (passed) {
      console.log(`✅ ${testName} - PASSED\n`);
      this.passedTests++;
    } else {
      console.log(`❌ ${testName} - FAILED: ${error}\n`);
      this.failedTests++;
    }
  }

  printResults() {
    console.log('\n📊 Mobile Test Suite Results:');
    console.log(`Total Tests: ${this.passedTests + this.failedTests}`);
    console.log(`✅ Passed: ${this.passedTests}`);
    console.log(`❌ Failed: ${this.failedTests}`);
    console.log(`Success Rate: ${((this.passedTests / (this.passedTests + this.failedTests)) * 100).toFixed(1)}%`);
    
    if (this.failedTests > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.filter(r => !r.passed).forEach(result => {
        console.log(`- ${result.name}: ${result.error}`);
      });
    }
  }

  getTestSummary() {
    return {
      total: this.passedTests + this.failedTests,
      passed: this.passedTests,
      failed: this.failedTests,
      successRate: ((this.passedTests / (this.passedTests + this.failedTests)) * 100),
      results: this.results
    };
  }
}

// Auto-run tests when script loads (in development)
if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1') || window.location.hostname.includes('.fly.dev')) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      window.mobileTestSuite = new MobileTestSuite();
      window.mobileTestSuite.runAllTests();
    }, 2000); // Wait for everything to load
  });
}

// Expose for manual testing
window.MobileTestSuite = MobileTestSuite;
