// ========================================
// NOOVA DESIGN - JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', function () {
  // ========================================
  // NAVIGATION
  // ========================================

  const navbar = document.querySelector('.navbar')
  const navToggle = document.querySelector('.nav-toggle')
  const navLinks = document.querySelector('.nav-links')

  // Scroll effect for navbar
  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled')
    } else {
      navbar.classList.remove('scrolled')
    }
  })

  // Mobile menu toggle
  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('active')
    navLinks.classList.toggle('active')
  })

  // Close mobile menu when clicking a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function () {
      navToggle.classList.remove('active')
      navLinks.classList.remove('active')
    })
  })

  // Close mobile menu when clicking outside
  document.addEventListener('click', function (e) {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navToggle.classList.remove('active')
      navLinks.classList.remove('active')
    }
  })

  // ========================================
  // SMOOTH SCROLL
  // ========================================

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute('href'))
      if (target) {
        const offsetTop = target.offsetTop - 80
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        })
      }
    })
  })

  // ========================================
  // SCROLL ANIMATIONS
  // ========================================

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in')
      }
    })
  }, observerOptions)

  // Observe elements
  document
    .querySelectorAll('.service-card, .tool-card, .info-card')
    .forEach(el => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(30px)'
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
      observer.observe(el)
    })

  // Add CSS for animation
  const style = document.createElement('style')
  style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `
  document.head.appendChild(style)

  // ========================================
  // CONTACT FORM
  // ========================================

  const contactForm = document.getElementById('contactForm')

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault()

      // Get form data
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        service: document.getElementById('service').value,
        message: document.getElementById('message').value,
      }

      // Show success message (in a real application, you would send this to a server)
      showNotification(
        'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Ich melde mich bald bei Ihnen.',
        'success'
      )

      // Reset form
      contactForm.reset()
    })
  }

  // ========================================
  // NOTIFICATION SYSTEM
  // ========================================

  function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification')
    if (existingNotification) {
      existingNotification.remove()
    }

    // Create notification
    const notification = document.createElement('div')
    notification.className = `notification notification-${type}`
    notification.innerHTML = `
            <p>${message}</p>
            <button class="notification-close">&times;</button>
        `

    // Add styles
    notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: ${
              type === 'success'
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
            };
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
        `

    // Add animation
    const animStyle = document.createElement('style')
    animStyle.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `
    document.head.appendChild(animStyle)

    document.body.appendChild(notification)

    // Close button
    notification
      .querySelector('.notification-close')
      .addEventListener('click', function () {
        notification.remove()
      })

    // Style close button
    const closeBtn = notification.querySelector('.notification-close')
    closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        `

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove()
      }
    }, 5000)
  }

  // ========================================
  // ACTIVE NAV LINK ON SCROLL
  // ========================================

  const sections = document.querySelectorAll('section[id]')

  window.addEventListener('scroll', function () {
    let current = ''

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100
      const sectionHeight = section.offsetHeight

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        current = section.getAttribute('id')
      }
    })

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.classList.remove('active')
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active')
      }
    })
  })

  // Add active link style
  const activeStyle = document.createElement('style')
  activeStyle.textContent = `
        .nav-links a.active {
            color: #6366f1 !important;
        }
    `
  document.head.appendChild(activeStyle)
})
