export const sessionStorage = {
  save(key, data) {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save to session storage:', error);
    }
  },

  load(key) {
    try {
      const data = window.sessionStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Failed to load from session storage:', error);
      return null;
    }
  },

  remove(key) {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from session storage:', error);
    }
  },

  clear() {
    try {
      window.sessionStorage.clear();
    } catch (error) {
      console.warn('Failed to clear session storage:', error);
    }
  }
};

export const clipboard = {
  async copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const result = document.execCommand('copy');
        document.body.removeChild(textArea);
        return result;
      } catch (fallbackError) {
        console.error('Failed to copy to clipboard:', fallbackError);
        return false;
      }
    }
  }
};