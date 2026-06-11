import { Search, Plus, Package, Pencil, Trash2 } from 'lucide-react';
import './ProductList.css';

interface Product {
  id: string;
  name: string;
  categoryName?: string;
  basePrice?: string | number;
  isActive?: boolean;
  isVisible?: boolean;
  imageBase64?: string;
}

import { useProductList } from './ProductListState';

interface ProductListProps {
  productsList: Product[];
  editingId: string | null;
  onNewProduct: () => void;
  onEditProduct: (id: string) => void;
  onDeleteProduct: (id: string, name: string) => void;
}

export function ProductList({
  productsList,
  editingId,
  onNewProduct,
  onEditProduct,
  onDeleteProduct
}: ProductListProps) {
  const { searchTerm, setSearchTerm, filteredProducts } = useProductList(productsList);

  return (
    <div className="prod-list-column">
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-strong)' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', top: '50%', left: '0.75rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Buscar produto..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.5rem 1rem 0.5rem 2.25rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)' }}
          />
        </div>
        <button className="prod-btn prod-btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={onNewProduct} title="Atalho: F2">
          <Plus size={16} /> Novo Produto (F2)
        </button>
      </div>
      <div style={{ padding: '1rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {filteredProducts.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.85rem', marginTop: '2rem' }}>Nenhum produto encontrado.</p>
        ) : (
          filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className={`prod-item-row ${editingId === prod.id ? 'active' : ''}`}
              onClick={() => onEditProduct(prod.id)}
            >
              <div className="prod-item-thumb">
                {prod.imageBase64 ? (
                  <img src={prod.imageBase64} alt={prod.name} />
                ) : (
                  <Package size={16} style={{ color: 'var(--text-muted)' }} />
                )}
              </div>
              <div className="prod-item-details">
                <span className="prod-item-name">{prod.name}</span>
                <div className="prod-item-sub">
                  <span className="prod-item-price">R$ {parseFloat(prod.basePrice?.toString() || '0').toFixed(2)}</span>
                  <span className="prod-item-category">• {prod.categoryName}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem' }}>
                  {prod.isActive === false && <span className="prod-status-tag tag-inactive">Inativo</span>}
                  {prod.isVisible === false && <span className="prod-status-tag tag-invisible">Invisível</span>}
                </div>
              </div>
              <div className="prod-item-actions" onClick={(e) => e.stopPropagation()}>
                <button className="action-btn edit-btn" onClick={() => onEditProduct(prod.id)} title="Editar">
                  <Pencil size={12} />
                </button>
                <button className="action-btn delete-btn" onClick={() => onDeleteProduct(prod.id, prod.name)} title="Excluir">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
