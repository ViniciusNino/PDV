import { X } from 'lucide-react';
import { ProductMock } from '../../TelaEstoqueState';
import { useFiltroProdutos } from './FiltroProdutosState';
import './FiltroProdutos.css';

interface FiltroProdutosProps {
  filteredProducts: ProductMock[];
  isOpen: boolean;
  onSelectProduct: (product: ProductMock) => void;
  onClose: () => void;
  selectedProduct: ProductMock | null;
}

export function FiltroProdutos({
  filteredProducts,
  isOpen,
  onSelectProduct,
  onClose,
  selectedProduct
}: FiltroProdutosProps) {
  const { selectedIndex, setSelectedIndex } = useFiltroProdutos({
    products: filteredProducts,
    isOpen,
    onSelect: onSelectProduct,
    onClose
  });

  if (!isOpen || filteredProducts.length === 0) return null;

  return (
    <div className="estoque-product-popover animate-fade-in" onClick={e => e.stopPropagation()}>
      <div className="popover-header">
        <span>Escolha um produto para inserir na lista</span>
        <button 
          type="button" 
          onClick={onClose}
          className="popover-close-btn"
          title="Fechar"
        >
          <X size={12} />
        </button>
      </div>
      <div className="popover-body">
        <table className="popover-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Descrição</th>
              <th>Preço</th>
              <th>Estoque</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p, index) => (
              <tr 
                key={p.id} 
                onClick={() => onSelectProduct(p)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={selectedIndex === index || selectedProduct?.id === p.id ? 'selected-row' : ''}
              >
                <td>{p.code}</td>
                <td className="desc-col">{p.description}</td>
                <td>
                  {p.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className={`stock-col ${p.stock <= 5 ? 'low-stock' : ''}`}>{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="popover-footer">
        <button 
          type="button" 
          className="popover-action-btn primary"
          disabled={filteredProducts.length === 0}
          onClick={() => {
            if (filteredProducts[selectedIndex]) {
              onSelectProduct(filteredProducts[selectedIndex]);
            }
          }}
        >
          Selecionar
        </button>
        <button 
          type="button" 
          className="popover-action-btn secondary"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
