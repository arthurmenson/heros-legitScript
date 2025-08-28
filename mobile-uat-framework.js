/**
 * Mobile User Acceptance Test Framework
 * Tests real user scenarios on mobile devices
 */

class MobileUATFramework {
  constructor() {
    this.scenarios = [];
    this.results = [];
    this.currentScenario = null;
  }

  // Define UAT scenarios
  defineScenarios() {
    this.scenarios = [
      {
        id: 'mobile-navigation',
        name: 'Mobile Navigation Experience',
        description: 'User can easily navigate the mobile interface',
        steps: [
          'Load page on mobile device',
          'Verify mobile layout is active',
          'Check navigation elements are visible',
          'Test touch interaction with navigation buttons'
        ],
        expectedResults: [
          'Page loads in mobile view automatically',
          'Navigation is clearly visible and accessible',
          'Touch targets are adequate size (44px+)',
          'All interactive elements respond to touch'
        ]
      },
      {
        id: 'service-discovery',
        name: 'Service Discovery Journey',
        description: 'User can discover and access health services',
        steps: [
          'View hero section with service overview',
          'Browse service cards (Weight Loss, Men\'s ED, etc.)',
          'Read service descriptions',
          'Interact with CTA buttons'
        ],
        expectedResults: [
          'Hero section clearly communicates value proposition',
          'Service cards are visually appealing and informative',
          'All service information is readable on mobile',
          'CTA buttons are prominent and functional'
        ]
      },
      {
        id: 'accessibility-compliance',
        name: 'Accessibility User Experience',
        description: 'Users with disabilities can access all features',
        steps: [
          'Navigate using screen reader',
          'Test keyboard navigation',
          'Verify image alt text',
          'Check color contrast'
        ],
        expectedResults: [
          'Screen reader can announce all content clearly',
          'All interactive elements are keyboard accessible',
          'Images have descriptive alt text',
          'Text meets WCAG contrast requirements'
        ]
      },
      {
        id: 'performance-experience',
        name: 'Mobile Performance Experience',
        description: 'Page loads quickly and feels responsive',
        steps: [
          'Load page on slow mobile connection',
          'Measure page load time',
          'Test scrolling performance',
          'Verify image loading behavior'
        ],
        expectedResults: [
          'Page loads within 3 seconds on 3G',
          'Scrolling is smooth without lag',
          'Images load progressively',
          'No layout shifts during loading'
        ]
      },
      {
        id: 'content-consumption',
        name: 'Content Consumption Experience',
        description: 'User can easily read and understand content',
        steps: [
          'Read hero title and description',
          'Review service offerings',
          'Check banner information',
          'Assess overall information hierarchy'
        ],
        expectedResults: [
          'Text is legible at mobile sizes',
          'Information hierarchy is clear',
          'Content is scannable and digestible',
          'No horizontal scrolling required'
        ]
      },
      {
        id: 'conversion-flow',
        name: 'Conversion Flow Experience',
        description: 'User can easily start their health journey',
        steps: [
          'Click on service of interest',
          'Navigate to service page',
          'Find and click main CTA',
          'Begin consultation process'
        ],
        expectedResults: [
          'Service selection is intuitive',
          'Navigation to service pages works',
          'CTAs are prominent and clear',
          'Conversion path is obvious'
        ]
      }
    ];
  }

  // Run all UAT scenarios
  async runAllScenarios() {
    console.log('🎭 Starting Mobile UAT Framework...\n');
    this.defineScenarios();
    
    for (const scenario of this.scenarios) {
      await this.runScenario(scenario);
    }
    
    this.generateUATReport();
    return this.getUATSummary();
  }

  // Run individual scenario
  async runScenario(scenario) {
    console.log(`🎯 Running UAT Scenario: ${scenario.name}`);
    console.log(`📝 Description: ${scenario.description}\n`);
    
    this.currentScenario = scenario;
    const result = {
      id: scenario.id,
      name: scenario.name,
      status: 'running',
      startTime: new Date(),
      checks: [],
      issues: [],
      recommendations: []
    };

    try {
      // Run automated checks for each scenario
      switch (scenario.id) {
        case 'mobile-navigation':
          await this.testMobileNavigation(result);
          break;
        case 'service-discovery':
          await this.testServiceDiscovery(result);
          break;
        case 'accessibility-compliance':
          await this.testAccessibilityCompliance(result);
          break;
        case 'performance-experience':
          await this.testPerformanceExperience(result);
          break;
        case 'content-consumption':
          await this.testContentConsumption(result);
          break;
        case 'conversion-flow':
          await this.testConversionFlow(result);
          break;
      }
      
      result.status = result.issues.length === 0 ? 'passed' : 'failed';
      
    } catch (error) {
      result.status = 'error';
      result.error = error.message;
      console.log(`❌ Scenario failed: ${error.message}`);
    }
    
    result.endTime = new Date();
    result.duration = result.endTime - result.startTime;
    this.results.push(result);
    
    this.printScenarioResult(result);
  }

  // Test mobile navigation scenario
  async testMobileNavigation(result) {
    // Check if mobile view is active
    const isMobileActive = document.body.classList.contains('mobile-view');
    this.addCheck(result, 'Mobile view activation', isMobileActive, 
      isMobileActive ? 'Mobile view is properly activated' : 'Mobile view is not active');

    // Check navigation visibility
    const mobileNav = document.querySelector('.mobile-nav');
    const navVisible = mobileNav && window.getComputedStyle(mobileNav).display !== 'none';
    this.addCheck(result, 'Navigation visibility', navVisible,
      navVisible ? 'Mobile navigation is visible' : 'Mobile navigation is not visible');

    // Check touch targets
    const navButtons = document.querySelectorAll('.mobile-nav-icon');
    let adequateTouchTargets = true;
    navButtons.forEach(btn => {
      const rect = btn.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        adequateTouchTargets = false;
      }
    });
    this.addCheck(result, 'Touch target sizes', adequateTouchTargets,
      adequateTouchTargets ? 'All touch targets are adequate size' : 'Some touch targets are too small');
  }

  // Test service discovery scenario
  async testServiceDiscovery(result) {
    // Check hero section
    const heroTitle = document.querySelector('.mobile-hero-title');
    const heroVisible = heroTitle && window.getComputedStyle(heroTitle).display !== 'none';
    this.addCheck(result, 'Hero section visibility', heroVisible,
      heroVisible ? 'Hero section is visible and accessible' : 'Hero section is not properly displayed');

    // Check service cards
    const serviceCards = document.querySelectorAll('.mobile-service-card-horizontal, .mobile-weight-loss-card, .mobile-mens-ed-card');
    const hasServiceCards = serviceCards.length > 0;
    this.addCheck(result, 'Service cards availability', hasServiceCards,
      hasServiceCards ? `${serviceCards.length} service cards are available` : 'No service cards found');

    // Check CTA buttons
    const ctaButtons = document.querySelectorAll('.card-cta, .card-cta-primary, .card-cta-secondary');
    const hasValidCTAs = ctaButtons.length > 0;
    this.addCheck(result, 'CTA button availability', hasValidCTAs,
      hasValidCTAs ? `${ctaButtons.length} CTA buttons are available` : 'No CTA buttons found');
  }

  // Test accessibility compliance scenario
  async testAccessibilityCompliance(result) {
    // Check ARIA labels
    const elementsWithAria = document.querySelectorAll('[aria-label], [aria-hidden]');
    const hasAriaSupport = elementsWithAria.length > 0;
    this.addCheck(result, 'ARIA support', hasAriaSupport,
      hasAriaSupport ? 'ARIA labels and attributes are implemented' : 'Missing ARIA accessibility features');

    // Check image alt text
    const images = document.querySelectorAll('.mobile-layout img');
    let missingAltCount = 0;
    images.forEach(img => {
      if (!img.alt || img.alt.trim().length < 3) {
        missingAltCount++;
      }
    });
    const goodAltText = missingAltCount === 0;
    this.addCheck(result, 'Image alt text', goodAltText,
      goodAltText ? 'All images have descriptive alt text' : `${missingAltCount} images missing proper alt text`);

    // Check heading structure
    const headings = document.querySelectorAll('.mobile-layout h1, .mobile-layout h2, .mobile-layout h3');
    const hasHeadingStructure = headings.length > 0;
    this.addCheck(result, 'Heading structure', hasHeadingStructure,
      hasHeadingStructure ? 'Proper heading structure is present' : 'Missing proper heading structure');
  }

  // Test performance experience scenario
  async testPerformanceExperience(result) {
    // Check lazy loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const hasLazyLoading = lazyImages.length > 0;
    this.addCheck(result, 'Image lazy loading', hasLazyLoading,
      hasLazyLoading ? 'Images use lazy loading for performance' : 'Images not optimized with lazy loading');

    // Check image optimization
    const optimizedImages = document.querySelectorAll('img[src*="width="]');
    const hasOptimizedImages = optimizedImages.length > 0;
    this.addCheck(result, 'Image optimization', hasOptimizedImages,
      hasOptimizedImages ? 'Images are optimized with size parameters' : 'Images not properly optimized');

    // Check resource loading
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    const hasReasonableCSS = stylesheets.length < 10;
    this.addCheck(result, 'CSS resource count', hasReasonableCSS,
      hasReasonableCSS ? 'Reasonable number of CSS files loaded' : 'Too many CSS files may impact performance');
  }

  // Test content consumption scenario
  async testContentConsumption(result) {
    // Check text readability
    const textElements = document.querySelectorAll('.mobile-layout p, .mobile-layout h1, .mobile-layout h2, .mobile-layout h3');
    let readableText = true;
    textElements.forEach(el => {
      const styles = window.getComputedStyle(el);
      const fontSize = parseFloat(styles.fontSize);
      if (fontSize < 14) {
        readableText = false;
      }
    });
    this.addCheck(result, 'Text readability', readableText,
      readableText ? 'All text is readable on mobile' : 'Some text may be too small for mobile');

    // Check content hierarchy
    const hero = document.querySelector('.mobile-hero');
    const services = document.querySelector('.mobile-service-grid');
    const hasHierarchy = hero && services;
    this.addCheck(result, 'Content hierarchy', hasHierarchy,
      hasHierarchy ? 'Clear content hierarchy is present' : 'Content hierarchy needs improvement');

    // Check horizontal scrolling
    const body = document.body;
    const hasHorizontalScroll = body.scrollWidth > body.clientWidth;
    this.addCheck(result, 'No horizontal scrolling', !hasHorizontalScroll,
      !hasHorizontalScroll ? 'No horizontal scrolling required' : 'Page has horizontal scrolling issues');
  }

  // Test conversion flow scenario
  async testConversionFlow(result) {
    // Check CTA prominence
    const primaryCTAs = document.querySelectorAll('.card-cta-primary');
    const hasPrimaryCTAs = primaryCTAs.length > 0;
    this.addCheck(result, 'Primary CTA availability', hasPrimaryCTAs,
      hasPrimaryCTAs ? 'Primary CTAs are available for conversion' : 'Missing primary conversion CTAs');

    // Check service links
    const serviceLinks = document.querySelectorAll('a[href*="weight-loss"], a[href*="mensed"], a[href*="skincare"], a[href*="hairloss"]');
    const hasServiceLinks = serviceLinks.length > 0;
    this.addCheck(result, 'Service navigation links', hasServiceLinks,
      hasServiceLinks ? 'Service navigation links are present' : 'Missing service navigation links');

    // Check external integration links
    const externalLinks = document.querySelectorAll('a[href*="mybaskhealth.com"]');
    const hasExternalIntegration = externalLinks.length > 0;
    this.addCheck(result, 'External service integration', hasExternalIntegration,
      hasExternalIntegration ? 'External service integration is properly linked' : 'Missing external service integration');
  }

  // Helper methods
  addCheck(result, checkName, passed, message) {
    result.checks.push({
      name: checkName,
      passed,
      message,
      timestamp: new Date()
    });

    if (passed) {
      console.log(`✅ ${checkName}: ${message}`);
    } else {
      console.log(`❌ ${checkName}: ${message}`);
      result.issues.push({
        check: checkName,
        message,
        severity: 'medium'
      });
    }
  }

  printScenarioResult(result) {
    const passedChecks = result.checks.filter(c => c.passed).length;
    const totalChecks = result.checks.length;
    const successRate = ((passedChecks / totalChecks) * 100).toFixed(1);
    
    console.log(`\n📊 Scenario Result: ${result.name}`);
    console.log(`Status: ${result.status.toUpperCase()}`);
    console.log(`Checks: ${passedChecks}/${totalChecks} passed (${successRate}%)`);
    console.log(`Duration: ${result.duration}ms`);
    
    if (result.issues.length > 0) {
      console.log(`Issues: ${result.issues.length}`);
      result.issues.forEach(issue => {
        console.log(`  - ${issue.message}`);
      });
    }
    console.log('\n' + '='.repeat(60) + '\n');
  }

  generateUATReport() {
    const totalScenarios = this.results.length;
    const passedScenarios = this.results.filter(r => r.status === 'passed').length;
    const failedScenarios = this.results.filter(r => r.status === 'failed').length;
    const errorScenarios = this.results.filter(r => r.status === 'error').length;
    
    console.log('\n🎭 Mobile UAT Framework - Final Report');
    console.log('=' .repeat(50));
    console.log(`Total Scenarios: ${totalScenarios}`);
    console.log(`✅ Passed: ${passedScenarios}`);
    console.log(`❌ Failed: ${failedScenarios}`);
    console.log(`💥 Errors: ${errorScenarios}`);
    console.log(`Success Rate: ${((passedScenarios / totalScenarios) * 100).toFixed(1)}%`);
    
    // Summary of critical issues
    const allIssues = this.results.flatMap(r => r.issues);
    if (allIssues.length > 0) {
      console.log(`\n⚠️ Total Issues Found: ${allIssues.length}`);
      console.log('\nTop Issues to Address:');
      allIssues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.message}`);
      });
    }
    
    console.log('\n📋 Recommendations:');
    console.log('1. Address failed accessibility checks for better user experience');
    console.log('2. Optimize performance issues for faster mobile loading');
    console.log('3. Ensure all user scenarios work seamlessly');
    console.log('4. Test on real devices for comprehensive validation');
  }

  getUATSummary() {
    return {
      totalScenarios: this.results.length,
      passed: this.results.filter(r => r.status === 'passed').length,
      failed: this.results.filter(r => r.status === 'failed').length,
      errors: this.results.filter(r => r.status === 'error').length,
      issues: this.results.flatMap(r => r.issues),
      results: this.results
    };
  }
}

// Auto-run UAT in development
if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1') || window.location.hostname.includes('.fly.dev')) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      console.log('🚀 Starting Mobile UAT Framework in 5 seconds...');
      setTimeout(() => {
        window.mobileUAT = new MobileUATFramework();
        window.mobileUAT.runAllScenarios();
      }, 5000);
    }, 1000);
  });
}

// Expose for manual testing
window.MobileUATFramework = MobileUATFramework;
