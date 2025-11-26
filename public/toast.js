// Sistema de notificaciones Toast
class Toast {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    // Crear contenedor si no existe
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      document.body.appendChild(this.container);
    }
  }

  show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Iconos según el tipo
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-message">${message}</span>
    `;
    
    this.container.appendChild(toast);
    
    // Animación de entrada
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto-remover
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  success(message, duration = 3000) {
    this.show(message, 'success', duration);
  }

  error(message, duration = 4000) {
    this.show(message, 'error', duration);
  }

  warning(message, duration = 3500) {
    this.show(message, 'warning', duration);
  }

  info(message, duration = 3000) {
    this.show(message, 'info', duration);
  }

  confirm(message, onConfirm, onCancel) {
    const overlay = document.createElement('div');
    overlay.className = 'toast-confirm-overlay';
    
    const dialog = document.createElement('div');
    dialog.className = 'toast-confirm-dialog';
    
    dialog.innerHTML = `
      <div class="toast-confirm-message">${message}</div>
      <div class="toast-confirm-buttons">
        <button class="toast-btn toast-btn-cancel">Cancelar</button>
        <button class="toast-btn toast-btn-confirm">Confirmar</button>
      </div>
    `;
    
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    
    setTimeout(() => overlay.classList.add('show'), 10);
    
    const remove = () => {
      overlay.classList.remove('show');
      setTimeout(() => overlay.remove(), 300);
    };
    
    dialog.querySelector('.toast-btn-cancel').onclick = () => {
      remove();
      if (onCancel) onCancel();
    };
    
    dialog.querySelector('.toast-btn-confirm').onclick = () => {
      remove();
      if (onConfirm) onConfirm();
    };
    
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        remove();
        if (onCancel) onCancel();
      }
    };
  }
}

// Instancia global
window.toast = new Toast();

