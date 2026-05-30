import { useState, useEffect } from 'react';
import { 
  Search, ShoppingCart, Trash2, ArrowRight, ArrowLeft, Check, Plus, Minus, Layers, AlertCircle, X, ChevronRight
} from 'lucide-react';
import './TelaBalcao.css';

interface Product {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  costPrice?: number;
  unit: string;
  imageBase64?: string;
  categoryId: string;
  categoryName?: string;
  isActive: boolean;
  isVisible: boolean;
  printTarget?: string;
  modifierGroups?: ModifierGroup[];
}

interface ModifierGroup {
  id?: string;
  uiId?: string;
  name: string;
  minSelections: number;
  maxSelections: number;
  priceRule: number; // 0 = Average, 1 = HighestPrice, 2 = Sum
  isPropType?: boolean;
  canBeFractioned?: boolean;
  options: ModifierOption[];
}

interface ModifierOption {
  id?: string;
  name: string;
  additionalPrice: number;
  maxQuantity: number;
  productId?: string;
  isPreSelected?: boolean;
  parentOptionId?: string;
}

interface CartItem {
  cartId: string; // ID único para o item no carrinho (permite ter o mesmo produto base com customizações diferentes)
  product: Product;
  quantity: number;
  totalPrice: number;
  selections: {
    groupName: string;
    priceRule: number;
    items: Array<{
      id?: string;
      name: string;
      additionalPrice: number;
      quantity: number; // pode ser fração (0.5, 0.33, 1, etc.)
      productId?: string;
    }>;
  }[];
}

export function TelaBalcao() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Estados para Modal de Montagem de Pacote
  const [packageModalOpen, setPackageModalOpen] = useState<boolean>(false);
  const [activePackProduct, setActivePackProduct] = useState<Product | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  // selections format: { [groupIdx: number]: Array<{ name, additionalPrice, quantity (fractional/int), productId }> }
  const [packSelections, setPackSelections] = useState<Record<number, any[]>>({});

  const token = localStorage.getItem('token');

  useEffect(() => {
    // Carregar Categorias
    fetch('http://localhost:5121/api/categories', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        // Ordenar categorias principais e subcategorias
        const sorted = data.sort((a: any, b: any) => (a.sequence || 0) - (b.sequence || 0));
        setCategories(sorted);
      })
      .catch(err => {
        console.error("Erro ao carregar categorias:", err);
        setError("Não foi possível carregar as categorias.");
      });

    // Carregar Produtos
    fetch('http://localhost:5121/api/products', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        // Apenas produtos ativos e visíveis
        const activeProds = data.filter((p: any) => p.isActive && p.isVisible);
        // Buscar detalhes de cada produto para obter os modifierGroups
        const detailsPromises = activeProds.map((p: any) => 
          fetch(`http://localhost:5121/api/products/${p.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }).then(res => res.json())
        );

        Promise.all(detailsPromises)
          .then(fullProducts => {
            setProducts(fullProducts);
            setFilteredProducts(fullProducts);
          })
          .catch(err => {
            console.error("Erro ao carregar detalhes dos produtos:", err);
            setError("Erro ao obter dados completos dos produtos.");
          });
      })
      .catch(err => {
        console.error("Erro ao carregar produtos:", err);
        setError("Não foi possível carregar os produtos.");
      });
  }, [token]);

  // Filtragem de produtos por categoria e pesquisa
  useEffect(() => {
    let result = products;
    
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.categoryId === selectedCategory);
    }
    
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) || 
        (p.description && p.description.toLowerCase().includes(term))
      );
    }
    
    setFilteredProducts(result);
  }, [selectedCategory, searchTerm, products]);

  // Inicialização tardia de pré-seleções qualificadas baseada em dependências das etapas anteriores
  const initializeStepPreSelections = (stepIdx: number, currentPackSelections: Record<number, any[]>, product: Product) => {
    if (currentPackSelections[stepIdx] !== undefined) return currentPackSelections;
    const group = product.modifierGroups?.[stepIdx];
    if (!group) return currentPackSelections;

    const preSelectedOpts = group.options
      .filter(opt => {
        if (!opt.isPreSelected) return false;
        if (!opt.parentOptionId) return true;
        // Verifica se a associação exigida está marcada em alguma etapa anterior
        return Object.entries(currentPackSelections).some(([sIdxStr, selections]) => {
          const sIdx = parseInt(sIdxStr);
          if (sIdx >= stepIdx) return false;
          return selections.some(sel => sel.id === opt.parentOptionId);
        });
      })
      .map(opt => ({
        id: opt.id,
        name: opt.name,
        additionalPrice: opt.additionalPrice,
        quantity: 1, // Pré-seleção é 1 inteira
        productId: opt.productId
      }));

    return {
      ...currentPackSelections,
      [stepIdx]: preSelectedOpts
    };
  };

  // Manipular clique no produto
  const handleProductClick = (product: Product) => {
    if (product.modifierGroups && product.modifierGroups.length > 0) {
      setActivePackProduct(product);
      setCurrentStep(0);
      // Inicializa pré-seleções qualificadas do primeiro passo
      const initial = initializeStepPreSelections(0, {}, product);
      setPackSelections(initial);
      setPackageModalOpen(true);
    } else {
      addToCartSimple(product);
    }
  };

  const addToCartSimple = (product: Product) => {
    const existingIndex = cart.findIndex(item => item.product.id === product.id && item.selections.length === 0);
    
    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += 1;
      newCart[existingIndex].totalPrice = newCart[existingIndex].quantity * product.basePrice;
      setCart(newCart);
    } else {
      const newItem: CartItem = {
        cartId: Math.random().toString(36).substr(2, 9),
        product,
        quantity: 1,
        totalPrice: product.basePrice,
        selections: []
      };
      setCart([...cart, newItem]);
    }
    showToastSuccess(`"${product.name}" adicionado ao carrinho.`);
  };

  const showToastSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const showToastError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(''), 4000);
  };

  // Funções do Modal de Montagem de Pacotes
  const activeGroup = activePackProduct?.modifierGroups?.[currentStep] || null;

  const handleOptionSelect = (option: ModifierOption, fraction: number) => {
    if (!activePackProduct || !activeGroup) return;
    
    const currentSelections = packSelections[currentStep] || [];
    const existingIndex = currentSelections.findIndex(item => item.name === option.name);

    let newSelections = [...currentSelections];

    if (fraction === 0) {
      // Remover seleção
      newSelections = newSelections.filter(item => item.name !== option.name);
    } else {
      // Se for seleção única e não fracionável, limpa as outras seleções do grupo
      if (activeGroup.maxSelections === 1 && !activeGroup.canBeFractioned) {
        newSelections = [{
          id: option.id,
          name: option.name,
          additionalPrice: option.additionalPrice,
          quantity: 1,
          productId: option.productId
        }];
      } else {
        // Validação da soma de frações
        const currentSum = parseFloat(currentSelections.reduce((acc, item) => {
          if (item.name === option.name) return acc;
          return acc + item.quantity;
        }, 0).toFixed(2));

        if (parseFloat((currentSum + fraction).toFixed(2)) > activeGroup.maxSelections) {
          showToastError(`Limite máximo de ${activeGroup.maxSelections} itens excedido para esta etapa.`);
          return;
        }

        if (existingIndex >= 0) {
          newSelections[existingIndex].quantity = fraction;
        } else {
          newSelections.push({
            id: option.id,
            name: option.name,
            additionalPrice: option.additionalPrice,
            quantity: fraction,
            productId: option.productId
          });
        }
      }
    }

    const updatedPackSelections = { ...packSelections };
    updatedPackSelections[currentStep] = newSelections;
    
    // Invalida seleções dos passos subsequentes para evitar associações quebradas caso o usuário altere passos anteriores
    if (activePackProduct.modifierGroups) {
      for (let i = currentStep + 1; i < activePackProduct.modifierGroups.length; i++) {
        delete updatedPackSelections[i];
      }
    }

    setPackSelections(updatedPackSelections);
  };

  const getOptionQuantity = (optionName: string) => {
    const currentSelections = packSelections[currentStep] || [];
    const found = currentSelections.find(item => item.name === optionName);
    return found ? found.quantity : 0;
  };

  // Calcula o preço do grupo de modificadores corrente baseado em sua regra
  const calculateGroupPrice = (selections: any[], rule: number) => {
    if (selections.length === 0) return 0;
    
    if (rule === 2) { // Sum
      return selections.reduce((acc, item) => acc + (item.additionalPrice * item.quantity), 0);
    } else if (rule === 1) { // Highest Price
      const prices = selections.map(item => item.additionalPrice);
      return prices.length > 0 ? Math.max(...prices) : 0;
    } else if (rule === 3) { // Minimum Price
      const prices = selections.map(item => item.additionalPrice);
      return prices.length > 0 ? Math.min(...prices) : 0;
    } else { // Average
      const sum = selections.reduce((acc, item) => acc + item.additionalPrice, 0);
      return sum / selections.length;
    }
  };

  const calculateDynamicTotal = () => {
    if (!activePackProduct) return 0;
    let total = activePackProduct.basePrice;

    activePackProduct.modifierGroups?.forEach((group, idx) => {
      const selections = packSelections[idx] || [];
      total += calculateGroupPrice(selections, group.priceRule);
    });

    return total;
  };

  const handleNextStep = () => {
    if (!activePackProduct || !activeGroup) return;
    
    const selections = packSelections[currentStep] || [];
    const currentSum = selections.reduce((acc, item) => acc + item.quantity, 0);

    if (currentSum < activeGroup.minSelections) {
      showToastError(`Selecione no mínimo ${activeGroup.minSelections} opção(ões) para avançar.`);
      return;
    }

    if (currentStep < activePackProduct.modifierGroups!.length - 1) {
      const nextStepIdx = currentStep + 1;
      const updated = initializeStepPreSelections(nextStepIdx, packSelections, activePackProduct);
      setPackSelections(updated);
      setCurrentStep(nextStepIdx);
    } else {
      // Concluir e Adicionar ao Carrinho
      finalizePackage();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const finalizePackage = () => {
    if (!activePackProduct) return;

    // Verificar se todas as etapas cumpriram a quantidade mínima
    let valid = true;
    activePackProduct.modifierGroups?.forEach((group, idx) => {
      const selections = packSelections[idx] || [];
      const currentSum = selections.reduce((acc, item) => acc + item.quantity, 0);
      if (currentSum < group.minSelections) {
        valid = false;
      }
    });

    if (!valid) {
      showToastError("Há etapas obrigatórias pendentes.");
      return;
    }

    // Estruturar dados do pacote para o carrinho
    const cartSelections = activePackProduct.modifierGroups!.map((group, idx) => {
      const selections = packSelections[idx] || [];
      return {
        groupName: group.name,
        priceRule: group.priceRule,
        items: selections.map(s => ({
          id: s.id,
          name: s.name,
          additionalPrice: s.additionalPrice,
          quantity: s.quantity,
          productId: s.productId
        }))
      };
    });

    const finalPrice = calculateDynamicTotal();

    const newCartItem: CartItem = {
      cartId: Math.random().toString(36).substr(2, 9),
      product: activePackProduct,
      quantity: 1,
      totalPrice: finalPrice,
      selections: cartSelections
    };

    setCart([...cart, newCartItem]);
    setPackageModalOpen(false);
    setActivePackProduct(null);
    showToastSuccess(`Pacote "${activePackProduct.name}" adicionado com sucesso.`);
  };

  // Funções de Gerenciamento do Carrinho
  const handleRemoveFromCart = (cartId: string) => {
    const updated = cart.filter(item => item.cartId !== cartId);
    setCart(updated);
  };

  const handleUpdateCartQty = (cartId: string, delta: number) => {
    const newCart = cart.map(item => {
      if (item.cartId === cartId) {
        const newQty = Math.max(1, item.quantity + delta);
        const unitPrice = item.totalPrice / item.quantity;
        return {
          ...item,
          quantity: newQty,
          totalPrice: newQty * unitPrice
        };
      }
      return item;
    });
    setCart(newCart);
  };

  const calculateCartTotal = () => {
    return cart.reduce((acc, item) => acc + item.totalPrice, 0);
  };

  const handleFinalizeSale = () => {
    if (cart.length === 0) {
      showToastError("O carrinho está vazio.");
      return;
    }
    
    // Gerar JSON detalhado para simulação do pedido de cozinha
    const orderDetails = cart.map(item => {
      const itemDesc = item.selections.map(sel => {
        const optDescs = sel.items.map(opt => {
          let qtyStr = opt.quantity === 1 ? '' : `${opt.quantity}x `;
          if (opt.quantity === 0.5) qtyStr = '1/2 ';
          if (opt.quantity === 0.33) qtyStr = '1/3 ';
          return `- ${qtyStr}${opt.name}`;
        }).join('\n  ');
        return `[${sel.groupName}]\n  ${optDescs}`;
      }).join('\n');
      
      return `${item.quantity}x ${item.product.name} (R$ ${item.totalPrice.toFixed(2)})\n${itemDesc}`;
    }).join('\n\n');

    alert(`Venda Finalizada com Sucesso!\n\n-- IMPRESSÃO DE PRODUÇÃO COZINHA --\n\n${orderDetails}`);
    setCart([]);
  };

  return (
    <div className="balcao-pane">
      {/* Toast de Alertas */}
      {error && (
        <div className="balcao-toast error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="balcao-toast success">
          <Check size={16} />
          <span>{success}</span>
        </div>
      )}

      {/* Main Body */}
      <div className="balcao-layout">
        
        {/* Esquerda: Catálogo de Produtos */}
        <div className="balcao-catalogue">
          
          {/* Header com Busca e Categoria */}
          <div className="catalogue-header">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Buscar produto pelo nome ou descrição..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="categories-chips">
              <button 
                className={`category-chip ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                Todos
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Produtos */}
          <div className="products-grid-scroll">
            <div className="products-grid">
              {filteredProducts.length === 0 ? (
                <div className="no-products">
                  <span>🍔</span>
                  <p>Nenhum produto cadastrado ou encontrado nesta categoria.</p>
                </div>
              ) : (
                filteredProducts.map(prod => (
                  <div 
                    key={prod.id} 
                    className="product-card"
                    onClick={() => handleProductClick(prod)}
                  >
                    <div className="product-image">
                      {prod.imageBase64 ? (
                        <img src={prod.imageBase64} alt={prod.name} />
                      ) : (
                        <div className="product-placeholder">
                          <span>{prod.name.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                      {prod.modifierGroups && prod.modifierGroups.length > 0 && (
                        <span className="badge-package">
                          <Layers size={12} /> Pacote
                        </span>
                      )}
                    </div>
                    <div className="product-info">
                      <h4 className="product-title">{prod.name}</h4>
                      <p className="product-desc">{prod.description || 'Sem descrição cadastrada.'}</p>
                      <div className="product-price-row">
                        <span className="product-price">R$ {prod.basePrice.toFixed(2)}</span>
                        <span className="product-unit">{prod.unit}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Direita: Carrinho de Pedidos */}
        <div className="balcao-cart">
          <div className="cart-header">
            <ShoppingCart size={18} />
            <span>Itens do Pedido</span>
            <span className="cart-count">{cart.reduce((acc, i) => acc + i.quantity, 0)}</span>
          </div>

          <div className="cart-items-scroll">
            {cart.length === 0 ? (
              <div className="cart-empty">
                <span>🛒</span>
                <p>Nenhum item no pedido.</p>
                <small>Clique nos produtos ao lado para adicioná-los.</small>
              </div>
            ) : (
              <div className="cart-list">
                {cart.map(item => (
                  <div key={item.cartId} className="cart-row">
                    <div className="cart-row-main">
                      <div className="cart-row-details">
                        <span className="cart-item-name">{item.product.name}</span>
                        <span className="cart-item-subtotal">R$ {item.totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="cart-row-actions">
                        <div className="cart-qty-ctrl">
                          <button onClick={() => handleUpdateCartQty(item.cartId, -1)} className="cart-qty-btn"><Minus size={12} /></button>
                          <span className="cart-qty-num">{item.quantity}</span>
                          <button onClick={() => handleUpdateCartQty(item.cartId, 1)} className="cart-qty-btn"><Plus size={12} /></button>
                        </div>
                        <button onClick={() => handleRemoveFromCart(item.cartId)} className="cart-remove-btn"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    {/* Renderização das opções do pacote */}
                    {item.selections.length > 0 && (
                      <div className="cart-row-selections">
                        {item.selections.map((sel, sIdx) => (
                          <div key={sIdx} className="cart-selection-group">
                            <span className="group-title">{sel.groupName}:</span>
                            <div className="group-options-list">
                              {sel.items.map((opt, oIdx) => {
                                let qtyStr = '';
                                if (opt.quantity === 0.5) qtyStr = ' (1/2)';
                                else if (opt.quantity === 0.33) qtyStr = ' (1/3)';
                                else if (opt.quantity > 1) qtyStr = ` (${opt.quantity}x)`;
                                return (
                                  <span key={oIdx} className="group-option-item">
                                    • {opt.name}{qtyStr}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="cart-footer">
            <div className="total-row">
              <span>Total do Pedido:</span>
              <span className="total-value">R$ {calculateCartTotal().toFixed(2)}</span>
            </div>
            <button 
              className="btn-finalize-sale"
              onClick={handleFinalizeSale}
              disabled={cart.length === 0}
            >
              <Check size={18} /> Finalizar Venda e Imprimir
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Venda Guiada (Step-by-step) */}
      {packageModalOpen && activePackProduct && activeGroup && (
        <div className="package-modal-overlay">
          <div className="package-modal-box">
            
            {/* Header com progresso */}
            <div className="package-modal-header">
              <div className="package-modal-title">
                <h3>Montando {activePackProduct.name}</h3>
                <p>Personalize as etapas abaixo</p>
              </div>
              <button className="btn-close-package" onClick={() => setPackageModalOpen(false)}><X size={18} /></button>
            </div>

            {/* Barra de Progresso das Etapas */}
            <div className="package-steps-bar">
              {activePackProduct.modifierGroups?.map((group, idx) => (
                <div 
                  key={idx} 
                  className={`step-indicator ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''}`}
                >
                  <span className="step-num">{idx + 1}</span>
                  <span className="step-name">{group.name}</span>
                  {idx < activePackProduct.modifierGroups!.length - 1 && (
                    <ChevronRight size={14} className="step-arrow" />
                  )}
                </div>
              ))}
            </div>

            {/* Conteúdo da Etapa Atual */}
            <div className="package-modal-body">
              <div className="step-rules-banner">
                <span className="rule-badge">
                  {activeGroup.minSelections === activeGroup.maxSelections ? (
                    `Escolha exatamente ${activeGroup.minSelections}`
                  ) : (
                    `Escolha entre ${activeGroup.minSelections} e ${activeGroup.maxSelections}`
                  )}
                </span>
                <span className="rule-badge secondary">
                  Preço: {activeGroup.priceRule === 1 ? 'Maior Valor' : activeGroup.priceRule === 0 ? 'Média dos Valores' : activeGroup.priceRule === 2 ? 'Soma dos Adicionais' : 'Mínimo (Menor Preço)'}
                </span>
                
                {/* Indicador de Seleção Atual */}
                <div className="step-progress-fraction">
                  Progresso: <strong>
                    { (packSelections[currentStep] || []).reduce((acc, item) => acc + item.quantity, 0) }
                  </strong> de <strong>{activeGroup.maxSelections}</strong>
                </div>
              </div>

              {/* Grid de Opções Filtradas Dinamicamente */}
              <div className="options-grid-scroll">
                <div className="options-grid">
                  {(() => {
                    const visibleOptions = activeGroup.options.filter(option => {
                      if (!option.parentOptionId) return true;
                      // Exibe se alguma opção selecionada anteriormente bate com o parentOptionId
                      return Object.values(packSelections).some(selections =>
                        selections.some(sel => sel.id === option.parentOptionId)
                      );
                    });

                    if (visibleOptions.length === 0) {
                      return (
                        <div style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          Nenhuma opção qualificada para as seleções anteriores.
                        </div>
                      );
                    }

                    return visibleOptions.map((option, optIdx) => {
                      const selectedQty = getOptionQuantity(option.name);
                      const isSelected = selectedQty > 0;
                      const currentSum = (packSelections[currentStep] || []).reduce((acc, item) => acc + item.quantity, 0);
                      const remainingCapacity = activeGroup.maxSelections - currentSum;
                      
                      return (
                        <div 
                          key={optIdx} 
                          className={`option-card ${isSelected ? 'selected' : ''}`}
                        >
                          <div className="option-card-header">
                            <h4 className="option-name">{option.name}</h4>
                            <span className="option-add-price">
                              {option.additionalPrice > 0 ? `+ R$ ${option.additionalPrice.toFixed(2)}` : 'Sem custo adicional'}
                            </span>
                          </div>
                          
                          {/* Controles de Seleção */}
                          <div className="option-controls">
                            {activeGroup.canBeFractioned ? (
                              /* Controles de Fração se for fracionável */
                              <div className="fraction-selectors">
                                <button 
                                  className={`fraction-btn ${selectedQty === 0.25 ? 'active' : ''}`}
                                  onClick={() => handleOptionSelect(option, 0.25)}
                                >
                                  1/4
                                </button>
                                <button 
                                  className={`fraction-btn ${selectedQty === 0.33 ? 'active' : ''}`}
                                  onClick={() => handleOptionSelect(option, 0.33)}
                                >
                                  1/3
                                </button>
                                <button 
                                  className={`fraction-btn ${selectedQty === 0.5 ? 'active' : ''}`}
                                  onClick={() => handleOptionSelect(option, 0.5)}
                                >
                                  1/2
                                </button>
                                <button 
                                  className={`fraction-btn ${selectedQty === 1 ? 'active' : ''}`}
                                  onClick={() => handleOptionSelect(option, 1)}
                                >
                                  Inteira
                                </button>
                                {isSelected && (
                                  <button 
                                    className="fraction-btn remove"
                                    onClick={() => handleOptionSelect(option, 0)}
                                  >
                                    Remover
                                  </button>
                                )}
                              </div>
                            ) : (
                              /* Controles Inteiros (+ / -) ou Seletor Simples */
                              (option.maxQuantity > 1 || activeGroup.maxSelections > 1) ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                  <button
                                    onClick={() => handleOptionSelect(option, Math.max(0, selectedQty - 1))}
                                    disabled={selectedQty === 0}
                                    style={{
                                      background: 'rgba(255,255,255,0.05)',
                                      border: '1px solid var(--border-subtle)',
                                      borderRadius: '50%',
                                      width: '32px',
                                      height: '32px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: selectedQty === 0 ? 'not-allowed' : 'pointer',
                                      color: selectedQty === 0 ? 'var(--text-muted)' : 'var(--text-primary)',
                                      transition: 'all 0.2s'
                                    }}
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span style={{ fontWeight: 600, fontSize: '1rem', minWidth: '16px', textAlign: 'center' }}>
                                    {selectedQty}
                                  </span>
                                  <button
                                    onClick={() => handleOptionSelect(option, selectedQty + 1)}
                                    disabled={selectedQty >= option.maxQuantity || remainingCapacity <= 0}
                                    style={{
                                      background: 'rgba(255,255,255,0.05)',
                                      border: '1px solid var(--border-subtle)',
                                      borderRadius: '50%',
                                      width: '32px',
                                      height: '32px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: (selectedQty >= option.maxQuantity || remainingCapacity <= 0) ? 'not-allowed' : 'pointer',
                                      color: (selectedQty >= option.maxQuantity || remainingCapacity <= 0) ? 'var(--text-muted)' : 'var(--text-primary)',
                                      transition: 'all 0.2s'
                                    }}
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                              ) : (
                                <button 
                                  className={`btn-select-single ${isSelected ? 'active' : ''}`}
                                  onClick={() => handleOptionSelect(option, isSelected ? 0 : 1)}
                                >
                                  {isSelected ? <Check size={14} /> : 'Selecionar'}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>

            {/* Footer do Modal com Precificação e Navegação */}
            <div className="package-modal-footer">
              <div className="dynamic-price-display">
                <span className="label">Valor do Produto:</span>
                <span className="value">R$ {calculateDynamicTotal().toFixed(2)}</span>
              </div>
              
              <div className="navigation-buttons">
                {currentStep > 0 && (
                  <button className="btn-nav prev" onClick={handlePrevStep}>
                    <ArrowLeft size={16} /> Voltar
                  </button>
                )}
                
                <button className="btn-nav next" onClick={handleNextStep}>
                  {currentStep === activePackProduct.modifierGroups!.length - 1 ? (
                    <>Adicionar ao Carrinho <Check size={16} /></>
                  ) : (
                    <>Avançar <ArrowRight size={16} /></>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
