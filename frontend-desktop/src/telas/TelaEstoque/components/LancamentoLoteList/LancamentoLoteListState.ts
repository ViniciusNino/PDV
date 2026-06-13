import { StockItem } from '../../TelaEstoqueState';

interface UseLancamentoLoteListProps {
  stockItems: StockItem[];
}

export function useLancamentoLoteList({ stockItems }: UseLancamentoLoteListProps) {
  // Calcula o valor total acumulado das entradas lançadas neste lote
  const getGrandTotal = (): number => {
    return stockItems.reduce((acc, item) => acc + item.total, 0);
  };

  // Calcula a quantidade total de unidades inseridas
  const getTotalQuantity = (): number => {
    return stockItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  return {
    getGrandTotal,
    getTotalQuantity
  };
}
