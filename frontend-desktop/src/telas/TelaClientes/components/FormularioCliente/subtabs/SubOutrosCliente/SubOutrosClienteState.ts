import { useCallback } from 'react';

export function useSubOutrosCliente() {
  const formatCurrency = useCallback((value: number): string => {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }, []);

  const parseCurrency = useCallback((value: string): number => {
    const cleanValue = value.replace(/\D/g, '');
    if (!cleanValue) return 0;
    return parseFloat(cleanValue) / 100;
  }, []);

  return {
    formatCurrency,
    parseCurrency
  };
}
