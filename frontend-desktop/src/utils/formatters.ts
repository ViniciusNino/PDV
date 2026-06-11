export const formatCurrency = (value: string): string => {
  // Limpa tudo o que não for número
  const cleanValue = value.replace(/\D/g, '');
  if (!cleanValue) return '';
  const numberValue = parseFloat(cleanValue) / 100;
  return numberValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const parseCurrencyToFloat = (value: string | number): number => {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return value;
  // Remove pontos de milhares e troca vírgula decimal por ponto
  const clean = value.replace(/\./g, '').replace(',', '.');
  return parseFloat(clean) || 0;
};

export const formatQuantityDecimal = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  if (!cleanValue) return '0,000';
  const numberValue = parseFloat(cleanValue) / 1000;
  return numberValue.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
};

export const generateGuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const getNextProductCode = (products: any[]): string => {
  if (!products || products.length === 0) return '1';
  
  const numericCodes = products
    .map(p => {
      const codeStr = (p.code || '').trim();
      const parsed = parseInt(codeStr, 10);
      return !isNaN(parsed) && /^\d+$/.test(codeStr) ? parsed : null;
    })
    .filter((c): c is number => c !== null);
    
  if (numericCodes.length === 0) return '1';
  
  const maxCode = Math.max(...numericCodes);
  return (maxCode + 1).toString();
};
