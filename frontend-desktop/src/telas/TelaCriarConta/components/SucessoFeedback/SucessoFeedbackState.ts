import { useEffect } from 'react';

interface SucessoFeedbackStateProps {
  onRedirect: () => void;
}

export function useSucessoFeedback({ onRedirect }: SucessoFeedbackStateProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRedirect();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onRedirect]);
}
