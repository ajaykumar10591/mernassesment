type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

class ToastManager {
  private container: HTMLElement | null = null;

  private createContainer() {
    if (this.container) return;
    
    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      pointer-events: none;
    `;
    document.body.appendChild(this.container);
  }

  show(message: string, type: ToastType = 'info', options: ToastOptions = {}) {
    this.createContainer();
    
    const toast = document.createElement('div');
    toast.style.cssText = `
      background: ${this.getBackgroundColor(type)};
      color: white;
      padding: 12px 16px;
      border-radius: 4px;
      margin-bottom: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      pointer-events: auto;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
      max-width: 300px;
      word-wrap: break-word;
    `;
    
    toast.textContent = message;
    this.container!.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, options.duration || 3000);
  }

  private getBackgroundColor(type: ToastType): string {
    switch (type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return '#3b82f6';
    }
  }
}

export const toast = new ToastManager();