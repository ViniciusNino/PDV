import { useState, useCallback } from 'react';

export interface NotificationState {
  type: 'success' | 'error';
  message: string;
}

export function useNotificationAlert() {
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const showNotification = useCallback((type: 'success' | 'error', message: string, timeoutMs: number = 3000) => {
    setNotification({ type, message });
    if (timeoutMs > 0) {
      setTimeout(() => {
        setNotification(null);
      }, timeoutMs);
    }
  }, []);

  return {
    notification,
    showNotification,
    clearNotification,
  };
}
