import React, { useState, useEffect, useRef } from 'react';
import { Search, Store, ShoppingCart, User, LogOut, Settings, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './TelaCheckout.css';

// Mock Data
const MOCK_PRODUCTS = [
  { id: 1, name: 'Hambúrguer Clássico', price: 25.90 },
  { id: 2, name: 'Hambúrguer Duplo', price: 34.90 },
  { id: 3, name: 'Batata Frita P', price: 12.00 },
  { id: 4, name: 'Batata Frita G', price: 18.00 },
  { id: 5, name: 'Refrigerante Lata', price: 6.50 },
  { id: 6, name: 'Suco Natural', price: 9.00 },
  { id: 7, name: 'Sobremesa Sundae', price: 14.50 },
  { id: 8, name: 'Água Mineral', price: 4.00 },
];

type CartItem = {
  product: typeof MOCK_PRODUCTS[0];
  quantity: number;
};

export function TelaCheckout() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input on mount and handle keyboard shortcuts
  useEffect(() => {
    if (searchInputRef.current) searchInputRef.current.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      // F2 to focus search
      if (e.key === 'F2') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // F4 to close sale
      if (e.key === 'F4') {
        e.preventDefault();
        handleCloseSale();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart]);

  const addToCart = (product: typeof MOCK_PRODUCTS[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleCloseSale = () => {
    if (cart.length === 0) return;
    alert('Venda finalizada com sucesso! (Integração de pagamento pendente)');
    setCart([]);
  };

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const total = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <div className="checkout-container animate-fade-in">
      
      {/* Sidebar */}
      <aside className="checkout-sidebar">
        <div className="sidebar-logo">
          <Store size={32} />
        </div>
        <nav className="sidebar-menu">
          <button className="menu-btn active" title="Frente de Caixa">
            <ShoppingCart size={24} />
          </button>
          <button className="menu-btn" title="Configurações">
            <Settings size={24} />
          </button>
          <div style={{ flex: 1 }}></div>
          <button className="menu-btn" title="Sair" onClick={() => navigate('/')}>
            <LogOut size={24} />
          </button>
        </nav>
      </aside>

      {/* Main Area */}
      <main className="checkout-main">
        <div className="search-bar">
          <Search className="search-icon" size={24} />
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Buscar produto por nome ou código de barras... (F2)" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="products-grid">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="product-card"
              onClick={() => addToCart(product)}
            >
              <span className="product-name">{product.name}</span>
              <span className="product-price">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
            </div>
          ))}
        </div>
      </main>

      {/* Cart Panel */}
      <aside className="checkout-panel">
        <div className="panel-header">
          <h2>Cupom Atual</h2>
          <div className="customer-badge">
            <User size={16} />
            <span>Cliente Padrão</span>
          </div>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
              <ShoppingCart size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>Nenhum item adicionado.</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="cart-item animate-fade-in">
                <div className="item-info">
                  <span className="item-name">{item.product.name}</span>
                  <span className="item-qty">{item.quantity}x R$ {item.product.price.toFixed(2).replace('.', ',')}</span>
                </div>
                <span className="item-total">
                  R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="panel-footer">
          <div className="totals-row">
            <span>Subtotal</span>
            <span>R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="totals-row">
            <span>Descontos</span>
            <span>R$ 0,00</span>
          </div>
          <div className="totals-row grand-total">
            <span>Total</span>
            <span>R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>

          <button 
            className="btn-accent checkout-btn" 
            disabled={cart.length === 0}
            onClick={handleCloseSale}
          >
            <CreditCard size={24} />
            Cobrar (F4)
          </button>

          <div className="keyboard-shortcuts">
            <div className="shortcut"><kbd>F2</kbd> Busca</div>
            <div className="shortcut"><kbd>F4</kbd> Pagamento</div>
            <div className="shortcut"><kbd>DEL</kbd> Cancelar Item</div>
          </div>
        </div>
      </aside>

    </div>
  );
}
