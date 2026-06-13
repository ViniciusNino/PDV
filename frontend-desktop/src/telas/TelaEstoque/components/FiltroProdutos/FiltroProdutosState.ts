import { useState, useEffect } from 'react';
import type { ProductMock } from '../../TelaEstoqueState';

interface UseFiltroProdutosProps {
  products: ProductMock[];
  isOpen: boolean;
  onSelect: (product: ProductMock) => void;
  onClose: () => void;
}

export function useFiltroProdutos({ products, isOpen, onSelect, onClose }: UseFiltroProdutosProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Reseta o index selecionado sempre que a lista de produtos mudar
  useEffect(() => {
    setSelectedIndex(0);
  }, [products]);

  // Escuta eventos de teclado quando o popover estiver aberto
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % products.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + products.length) % products.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (products[selectedIndex]) {
          onSelect(products[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, products, selectedIndex, onSelect, onClose]);

  return {
    selectedIndex,
    setSelectedIndex
  };
}
