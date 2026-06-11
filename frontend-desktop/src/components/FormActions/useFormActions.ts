import { useState, useCallback } from 'react';

export function useFormActions(onSave: () => void | Promise<void>) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveWrapper = useCallback(async () => {
    try {
      setIsSubmitting(true);
      await onSave();
    } finally {
      setIsSubmitting(false);
    }
  }, [onSave]);

  return {
    isSubmitting,
    handleSaveWrapper
  };
}
