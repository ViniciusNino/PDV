import { AlertCircle } from 'lucide-react';
import './NotificationAlert.css';

export interface NotificationAlertProps {
  type: 'success' | 'error';
  message: string;
}

export function NotificationAlert({ type, message }: NotificationAlertProps) {
  if (!message) return null;

  return (
    <div className={`notification-alert notification-alert-${type} animate-slide-in`}>
      <AlertCircle size={16} />
      <span>{message}</span>
    </div>
  );
}
