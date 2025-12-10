// ========================================
// NOOVA DESIGN - Main JavaScript
// Lädt alle Module
// ========================================

import { initNavigation, initSmoothScroll } from './navigation.js';
import { initScrollAnimations, initActiveNavOnScroll } from './animations.js';
import { initContactForm } from './contact.js';
import { initPortfolioFilter } from './portfolio.js';

// Initialize all modules when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Navigation
  initNavigation();
  initSmoothScroll();
  
  // Animations
  initScrollAnimations();
  initActiveNavOnScroll();
  
  // Contact Form
  initContactForm();
  
  // Portfolio Filter
  initPortfolioFilter();
  
  console.log('Noova Design - All modules loaded');
});
