// ========================================
// CONTACT FORM MODULE
// ========================================

import { showNotification } from './notifications.js';

export function initContactForm() {
  const contactForm = document.getElementById('contactForm');

  if (!contactForm) return;

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      service: document.getElementById('service').value,
      message: document.getElementById('message').value
    };

    // Validate form
    if (!validateForm(formData)) {
      showNotification('Bitte füllen Sie alle Felder aus.', 'error');
      return;
    }

    // Here you would normally send the data to a server
    // For now, just show success message
    showNotification(
      'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Ich melde mich bald bei Ihnen.',
      'success'
    );

    // Reset form
    contactForm.reset();
  });
}

function validateForm(data) {
  return data.name && data.email && data.service && data.message;
}
