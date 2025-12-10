// ========================================
// NOOVA DESIGN - Bundle (All-in-One)
// Für einfache Nutzung ohne ES6 Module
// ========================================

document.addEventListener('DOMContentLoaded', function() {

  // ========================================
  // NAVIGATION
  // ========================================
  
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navbar && navToggle && navLinks) {
    // Scroll effect for navbar
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', function() {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  }

  // ========================================
  // SMOOTH SCROLL
  // ========================================

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========================================
  // SCROLL ANIMATIONS
  // ========================================

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observe elements
  document.querySelectorAll(
    '.service-card, .tool-card, .info-card, .portfolio-item, .pricing-card, .faq-item, .process-step, .service-detail-card'
  ).forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Add animation CSS
  const style = document.createElement('style');
  style.textContent = `
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

  // ========================================
  // ACTIVE NAV LINK ON SCROLL
  // ========================================

  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', function() {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;

      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });

  // ========================================
  // CONTACT FORM
  // ========================================

  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        service: document.getElementById('service').value,
        message: document.getElementById('message').value
      };

      if (!formData.name || !formData.email || !formData.service || !formData.message) {
        showNotification('Bitte füllen Sie alle Felder aus.', 'error');
        return;
      }

      showNotification(
        'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Ich melde mich bald bei Ihnen.',
        'success'
      );

      contactForm.reset();
    });
  }

  // ========================================
  // NOTIFICATION SYSTEM
  // ========================================

  function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <p>${message}</p>
      <button class="notification-close">&times;</button>
    `;

    const bgColor = type === 'success' 
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      : type === 'error'
      ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
      : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)';

    notification.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: ${bgColor};
      color: white;
      padding: 20px 30px;
      border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 15px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
      max-width: 400px;
    `;

    if (!document.querySelector('#notification-animation')) {
      const animStyle = document.createElement('style');
      animStyle.id = 'notification-animation';
      animStyle.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(animStyle);
    }

    document.body.appendChild(notification);

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    `;

    closeBtn.addEventListener('click', () => notification.remove());

    setTimeout(() => {
      if (notification.parentNode) notification.remove();
    }, 5000);
  }

  // Make showNotification globally available
  window.showNotification = showNotification;

  // ========================================
  // PORTFOLIO FILTER
  // ========================================

  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterButtons.length > 0 && portfolioItems.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        const filterValue = this.getAttribute('data-filter');

        portfolioItems.forEach(item => {
          const categories = item.getAttribute('data-category');
          
          if (filterValue === 'all' || categories.includes(filterValue)) {
            item.style.display = 'block';
            item.style.animation = 'fadeIn 0.5s ease';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });

    if (!document.querySelector('#portfolio-animation')) {
      const portfolioStyle = document.createElement('style');
      portfolioStyle.id = 'portfolio-animation';
      portfolioStyle.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `;
      document.head.appendChild(portfolioStyle);
    }
  }

  console.log('Noova Design - Scripts loaded');
});
