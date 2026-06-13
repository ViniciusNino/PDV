import type { ProductMock } from '../../TelaEstoqueState';

interface UseCadastroEstoqueProps {
  selectedProduct: ProductMock | null;
  quantity: number;
  purchasePrice: number;
  totalPrice: number;
  onError: (msg: string) => void;
}

export function useCadastroEstoque({
  selectedProduct,
  quantity,
  purchasePrice,
  totalPrice,
  onError
}: UseCadastroEstoqueProps) {

  // Validações rápidas do formulário local antes da inserção
  const validateForm = (): boolean => {
    if (!selectedProduct) {
      onError("Por favor, selecione um produto válido na listagem.");
      return false;
    }

    if (quantity <= 0) {
      onError("A quantidade inserida deve ser maior do que zero.");
      return false;
    }

    if (purchasePrice < 0 || totalPrice < 0) {
      onError("Os valores de preços não podem ser negativos.");
      return false;
    }

    return true;
  };

  return {
    validateForm
  };
}
