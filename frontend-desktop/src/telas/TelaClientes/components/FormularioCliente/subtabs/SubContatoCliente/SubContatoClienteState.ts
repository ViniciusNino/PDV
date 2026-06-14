import { useCallback } from 'react';

export function useSubContatoCliente() {
  const formatCellphone = useCallback((val: string): string => {
    const digits = val.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  }, []);

  return {
    formatCellphone
  };
}
