// ========================================
// NOTIFICATIONS MODULE
// ========================================

export function showNotification(message, type = 'info') {
  // Remove existing notification
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <p>${message}</p>
    <button class="notification-close">&times;</button>
  `;

  // Add styles
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

  // Add animation
  if (!document.querySelector('#notification-animation')) {
    const animStyle = document.createElement('style');
    animStyle.id = 'notification-animation';
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
    `;
    document.head.appendChild(animStyle);
  }

  document.body.appendChild(notification);

  // Close button
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

  closeBtn.addEventListener('click', function() {
    notification.remove();
  });

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
}
