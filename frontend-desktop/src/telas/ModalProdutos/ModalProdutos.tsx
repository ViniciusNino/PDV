import React, { useState } from 'react';
import {
  X, Package, Search, Plus, Save, Settings, Tag, LayoutList, Grip, Layers, UploadCloud, Pencil, MonitorPlay, LayoutGrid, Truck, Trash2, HelpCircle, AlertCircle, ShoppingBag
} from 'lucide-react';
import './ModalProdutos.css';

// Funções utilitárias para máscara de moeda em Real (BRL)
const formatCurrency = (value: string): string => {
  // Limpa tudo o que não for número
  const cleanValue = value.replace(/\D/g, '');
  if (!cleanValue) return '';
  const numberValue = parseFloat(cleanValue) / 100;
  return numberValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const parseCurrencyToFloat = (value: string | number): number => {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return value;
  // Remove pontos de milhares e troca vírgula decimal por ponto
  const clean = value.replace(/\./g, '').replace(',', '.');
  return parseFloat(clean) || 0;
};

interface QuantitySelectorProps {
  value: string | number;
  onChange: (val: string) => void;
  min?: number;
  step?: number;
}

const QuantitySelector = ({ value, onChange, min = 0, step = 1 }: QuantitySelectorProps) => {
  const numValue = parseFloat(value?.toString()) || 0;

  const handleDecrease = () => {
    const newVal = Math.max(min, numValue - step);
    onChange(newVal.toString());
  };

  const handleIncrease = () => {
    const newVal = numValue + step;
    onChange(newVal.toString());
  };

  return (
    <div className="quantity-selector">
      <button
        type="button"
        onClick={handleDecrease}
        disabled={numValue <= min}
        className="qty-btn qty-btn-minus"
      >
        -
      </button>
      <input
        type="text"
        value={value}
        onChange={e => {
          let val = e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.');
          const parsed = parseFloat(val);
          if (!isNaN(parsed) && parsed < min) {
            val = min.toString();
          }
          onChange(val);
        }}
        onBlur={() => {
          const parsed = parseFloat(value?.toString());
          if (isNaN(parsed) || parsed < min) {
            onChange(min.toString());
          }
        }}
        className="qty-input"
      />
      <button
        type="button"
        onClick={handleIncrease}
        className="qty-btn qty-btn-plus"
      >
        +
      </button>
    </div>
  );
};

interface ModalProdutosProps {
  onClose: () => void;
  isWindowMode?: boolean;
}

export function ModalProdutos({ onClose, isWindowMode = false }: ModalProdutosProps) {
  const [activeTab, setActiveTab] = useState<string>('geral');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Limpa mensagens após alguns segundos
  React.useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados auxiliares para composição unificada (Item 11)
  const [selectedIngredientId, setSelectedIngredientId] = useState('');
  const [ingredientQty, setIngredientQty] = useState('1');
  const [ingredientType, setIngredientType] = useState<number>(0);
  const [ingredientPrice, setIngredientPrice] = useState('');
  const [ingredientActive, setIngredientActive] = useState(true);

  // Estados auxiliares para combos (Item 10 e 4)
  const [selectedComboId, setSelectedComboId] = useState('');
  const [comboQty, setComboQty] = useState('1');
  const [comboPrice, setComboPrice] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    description: '',
    type: 0,
    basePrice: '',
    costPrice: '',
    unit: 'UN',
    isFractionable: false,
    barcode: '',
    code: '',
    abbreviation: '',
    isActive: true,
    isVisible: true,
    imageBase64: '',
    printTarget: '', // Local de Impressão (Item 3)
    prices: [
      { channel: 0, price: '', isVisible: true }, // Comandas
      { channel: 1, price: '', isVisible: true }, // Balcão
      { channel: 2, price: '', isVisible: true }, // Mesas
      { channel: 3, price: '', isVisible: true }, // Delivery
      { channel: 4, price: '', isVisible: true }  // iFood
    ],
    ingredients: [] as Array<{ ingredientProductId: string; quantity: string; type: number; additionalPrice: string; isActive: boolean; name: string }>,
    comboItems: [] as Array<{ childProductId: string; quantity: string; fixedPrice: string; name: string }>,
    modifierGroups: [] as Array<{
      uiId: string;
      name: string;
      minSelections: number;
      maxSelections: number;
      priceRule: number;
      options: Array<{
        id?: string;
        name: string;
        additionalPrice: string;
        maxQuantity: number;
        productId: string;
      }>
    }>
  });

  const fetchProducts = React.useCallback(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5121/api/products', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setProductsList(data))
      .catch(console.error);
  }, []);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5121/api/categories', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(console.error);

    fetchProducts();
  }, [fetchProducts]);

  const handleEditStart = async (prodId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5121/api/products/${prodId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Erro ao carregar detalhes do produto.");
      const prod = await res.json();

      setEditingId(prod.id);
      setFormData({
        name: prod.name || '',
        categoryId: prod.categoryId || '',
        description: prod.description || '',
        type: prod.type ?? 0,
        basePrice: prod.basePrice ? formatCurrency((prod.basePrice * 100).toFixed(0)) : '',
        costPrice: prod.costPrice ? formatCurrency((prod.costPrice * 100).toFixed(0)) : '',
        unit: prod.unit || 'UN',
        isFractionable: prod.isFractionable || false,
        barcode: prod.barcode || '',
        code: prod.code || '',
        abbreviation: prod.abbreviation || '',
        isActive: prod.isActive ?? true,
        isVisible: prod.isVisible ?? true,
        imageBase64: prod.imageBase64 || '',
        printTarget: prod.printTarget || '',
        prices: [
          { channel: 0, price: prod.prices?.find((p: any) => p.channel === 0)?.price ? formatCurrency((prod.prices.find((p: any) => p.channel === 0).price * 100).toFixed(0)) : '', isVisible: prod.prices?.find((p: any) => p.channel === 0)?.isVisible ?? true },
          { channel: 1, price: prod.prices?.find((p: any) => p.channel === 1)?.price ? formatCurrency((prod.prices.find((p: any) => p.channel === 1).price * 100).toFixed(0)) : '', isVisible: prod.prices?.find((p: any) => p.channel === 1)?.isVisible ?? true },
          { channel: 2, price: prod.prices?.find((p: any) => p.channel === 2)?.price ? formatCurrency((prod.prices.find((p: any) => p.channel === 2).price * 100).toFixed(0)) : '', isVisible: prod.prices?.find((p: any) => p.channel === 2)?.isVisible ?? true },
          { channel: 3, price: prod.prices?.find((p: any) => p.channel === 3)?.price ? formatCurrency((prod.prices.find((p: any) => p.channel === 3).price * 100).toFixed(0)) : '', isVisible: prod.prices?.find((p: any) => p.channel === 3)?.isVisible ?? true },
          { channel: 4, price: prod.prices?.find((p: any) => p.channel === 4)?.price ? formatCurrency((prod.prices.find((p: any) => p.channel === 4).price * 100).toFixed(0)) : '', isVisible: prod.prices?.find((p: any) => p.channel === 4)?.isVisible ?? true }
        ],
        ingredients: prod.ingredients?.map((i: any) => {
          const matchedProd = productsList.find(p => p.id === i.ingredientProductId);
          return {
            ingredientProductId: i.ingredientProductId,
            quantity: i.quantity?.toString() || '0',
            type: i.type ?? 0,
            additionalPrice: i.additionalPrice ? formatCurrency((i.additionalPrice * 100).toFixed(0)) : '',
            isActive: i.isActive ?? true,
            name: matchedProd ? matchedProd.name : "Ingrediente Desconhecido"
          };
        }) || [],
        comboItems: prod.comboItems?.map((c: any) => {
          const matchedProd = productsList.find(p => p.id === c.childProductId);
          return {
            childProductId: c.childProductId,
            quantity: c.quantity?.toString() || '0',
            fixedPrice: c.fixedPrice ? formatCurrency((c.fixedPrice * 100).toFixed(0)) : '',
            name: matchedProd ? matchedProd.name : "Produto Desconhecido"
          };
        }) || [],
        modifierGroups: prod.modifierGroups?.map((mg: any) => ({
          uiId: mg.id || Math.random().toString(36).substr(2, 9),
          name: mg.name,
          minSelections: mg.minSelections,
          maxSelections: mg.maxSelections,
          priceRule: mg.priceRule,
          options: mg.options?.map((o: any) => ({
            id: o.id,
            name: o.name,
            additionalPrice: o.additionalPrice?.toString() || '0',
            maxQuantity: o.maxQuantity,
            productId: o.productId
          })) || []
        })) || []
      });
      setActiveTab('geral');
    } catch (err: any) {
      setError("Erro ao carregar produto para edição: " + err.message);
    }
  };

  const handleNewProduct = () => {
    setEditingId(null);
    setActiveTab('geral');
    setFormData({
      name: '',
      categoryId: '',
      description: '',
      type: 0,
      basePrice: '',
      costPrice: '',
      unit: 'UN',
      isFractionable: false,
      barcode: '',
      code: '',
      abbreviation: '',
      isActive: true,
      isVisible: true,
      imageBase64: '',
      printTarget: '',
      prices: [
        { channel: 0, price: '', isVisible: true },
        { channel: 1, price: '', isVisible: true },
        { channel: 2, price: '', isVisible: true },
        { channel: 3, price: '', isVisible: true },
        { channel: 4, price: '', isVisible: true }
      ],
      ingredients: [],
      comboItems: [],
      modifierGroups: []
    });
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir permanentemente o produto "${name}"?`)) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5121/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      setSuccessMessage("Produto excluído com sucesso!");
      fetchProducts();
      if (editingId === id) {
        handleNewProduct();
      }
    } catch (err: any) {
      setError("Erro ao excluir produto: " + err.message);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.categoryId) {
      setError("Nome e Categoria são obrigatórios.");
      return;
    }

    try {
      const token = localStorage.getItem('token');

      // Sanitizando os dados para a API
      const payload = {
        ...formData,
        basePrice: parseCurrencyToFloat(formData.basePrice),
        costPrice: parseCurrencyToFloat(formData.costPrice),
        prices: formData.prices.map(p => ({
          channel: p.channel,
          price: parseCurrencyToFloat(p.price),
          isVisible: p.isVisible
        })),
        ingredients: formData.ingredients.map(i => ({
          ingredientProductId: i.ingredientProductId,
          quantity: parseFloat(i.quantity) || 0,
          type: i.type,
          additionalPrice: parseCurrencyToFloat(i.additionalPrice),
          isActive: i.isActive
        })),
        comboItems: formData.comboItems.map(c => ({
          childProductId: c.childProductId,
          quantity: parseFloat(c.quantity) || 0,
          fixedPrice: c.fixedPrice ? parseCurrencyToFloat(c.fixedPrice) : null
        })),
        modifierGroups: formData.modifierGroups.map(g => ({
          id: g.uiId && g.uiId.includes('-') ? g.uiId : null,
          name: g.name,
          minSelections: g.minSelections,
          maxSelections: g.maxSelections,
          priceRule: g.priceRule,
          sequence: 0,
          options: g.options.map((o, idx) => ({
            id: o.id && o.id.includes('-') ? o.id : null,
            name: o.name,
            additionalPrice: parseCurrencyToFloat(o.additionalPrice) || 0,
            maxQuantity: o.maxQuantity,
            sequence: idx,
            productId: o.productId || null
          }))
        }))
      };

      const url = editingId
        ? `http://localhost:5121/api/products/${editingId}`
        : 'http://localhost:5121/api/products';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      setSuccessMessage(editingId ? "Produto atualizado com sucesso!" : "Produto salvo com sucesso!");
      fetchProducts();
      handleNewProduct();
    } catch (err: any) {
      setError("Erro ao salvar produto: " + err.message);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação de tipo de arquivo
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError("Tipo de arquivo inválido. Apenas imagens nos formatos PNG, JPG, JPEG e WEBP são permitidas.");
      return;
    }

    // Validação de tamanho (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('A imagem é muito grande. O limite máximo permitido é de 2MB. Otimize a imagem ou envie um arquivo de menor resolução.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Validação de dimensões limites (máximo 2500x2500px)
        const MAX_WIDTH = 2500;
        const MAX_HEIGHT = 2500;
        if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {
          setError(`As dimensões da imagem são muito grandes (${img.width}x${img.height}px). O limite sugerido para o sistema é de até ${MAX_WIDTH}x${MAX_HEIGHT}px. Por favor, envie uma imagem com dimensões menores.`);
          return;
        }
        setFormData(prev => ({ ...prev, imageBase64: event.target?.result as string }));
      };
      img.onerror = () => {
        setError("Erro ao decodificar a imagem. O arquivo pode estar corrompido.");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Evita disparar atalhos se o foco estiver em campos de texto/área de texto
      // caso o usuário esteja apenas editando normalmente
      const activeEl = document.activeElement;
      const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT');

      // Para F2 (Novo Produto), permitimos mesmo de dentro de inputs para agilizar
      if (e.key === 'F2') {
        e.preventDefault();
        handleNewProduct();
      }
      // Para F4 (Carregar Foto), permitimos em qualquer lugar da tela do modal
      if (e.key === 'F4') {
        e.preventDefault();
        document.getElementById('prod-img')?.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const tabs = [
    { id: 'geral', label: 'Dados Gerais', icon: Settings },
    { id: 'canais', label: 'Canais de Venda', icon: Tag },
    { id: 'composicao', label: 'Composição', icon: LayoutList },
    { id: 'pacotes', label: 'Pacotes', icon: Layers }
  ];

  const filteredProducts = productsList.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.categoryName && p.categoryName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const cardBody = (
    <div className="prod-modal-card glass-panel" onClick={(e) => e.stopPropagation()} style={isWindowMode ? { width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%', borderRadius: 0, border: 'none' } : {}}>

      {/* Header */}
      {!isWindowMode && (
        <header className="prod-modal-header">
          <div className="prod-header-title">
            <Package size={20} className="text-primary" />
            <span>Gerenciamento de Produtos</span>
          </div>
          <button className="prod-btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
      )}

      {/* Mensagens de Notificação */}
      {error && (
        <div className="prod-alert prod-alert-danger animate-slide-in">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
      {successMessage && (
        <div className="prod-alert prod-alert-success animate-slide-in">
          <AlertCircle size={16} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Body */}
      <div className="prod-modal-body">

        {/* Coluna Esquerda: Listagem de Produtos */}
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
            <button className="prod-btn prod-btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={handleNewProduct} title="Atalho: F2">
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
                  onClick={() => handleEditStart(prod.id)}
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
                      <span className="prod-item-price">R$ {parseFloat(prod.basePrice || 0).toFixed(2)}</span>
                      <span className="prod-item-category">• {prod.categoryName}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem' }}>
                      {!prod.isActive && <span className="prod-status-tag tag-inactive">Inativo</span>}
                      {!prod.isVisible && <span className="prod-status-tag tag-invisible">Invisível</span>}
                    </div>
                  </div>
                  <div className="prod-item-actions" onClick={(e) => e.stopPropagation()}>
                    <button className="action-btn edit-btn" onClick={() => handleEditStart(prod.id)} title="Editar">
                      <Pencil size={12} />
                    </button>
                    <button className="action-btn delete-btn" onClick={() => handleDeleteProduct(prod.id, prod.name)} title="Excluir">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Coluna Direita: Formulário Multitab */}
        <div className="prod-form-column">

          {/* Tabs */}
          <div className="prod-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`prod-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="prod-tab-content">
            {activeTab === 'geral' && (
              <div className="prod-tab-section animate-fade-in">
                <div className="prod-form-grid">

                  {/* Imagem do Produto */}
                  <div className="prod-form-group" style={{ gridColumn: 'span 2' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <label style={{ margin: 0 }}>Imagem do Produto</label>
                      <div className="prod-tooltip-container">
                        <HelpCircle size={14} className="prod-help-icon" style={{ cursor: 'help', color: 'var(--text-muted)' }} />
                        <div className="prod-tooltip">
                          Dimensão recomendada: proporção 1:1 (quadrada), ex: 400x400px. Limite máximo: 2MB e resolução de até 2500x2500px.
                        </div>
                      </div>
                    </div>
                    <div className="cat-image-upload-area" onClick={() => document.getElementById('prod-img')?.click()} style={{ width: '150px', height: '150px', borderRadius: 'var(--radius-md)' }}>
                      <input type="file" id="prod-img" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                      {formData.imageBase64 ? (
                        <div className="cat-image-preview">
                          <img src={formData.imageBase64} alt="Preview" />
                          <div className="cat-image-overlay"><Pencil size={20} /></div>
                        </div>
                      ) : (
                        <div className="cat-image-placeholder">
                          <UploadCloud size={28} />
                          <span>Enviar foto (F4)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Nome e Categoria */}
                  <div className="prod-form-group">
                    <label>Nome do Produto *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Hambúrguer Clássico"
                      className="prod-input"
                    />
                  </div>

                  <div className="prod-form-group">
                    <label>Categoria *</label>
                    <select
                      value={formData.categoryId}
                      onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                      className="prod-select"
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.parentCategoryId ? `  ↳ ${c.name}` : c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Preços e Unidade */}
                  <div className="prod-form-group">
                    <label>Preço Base (R$)</label>
                    <input
                      type="text"
                      value={formData.basePrice}
                      onChange={e => setFormData({ ...formData, basePrice: formatCurrency(e.target.value) })}
                      placeholder="0,00"
                      className="prod-input"
                    />
                  </div>

                  <div className="prod-form-group">
                    <label>Unidade de Medida</label>
                    <select
                      value={formData.unit}
                      onChange={e => setFormData({ ...formData, unit: e.target.value })}
                      className="prod-select"
                    >
                      <option value="UN">Unidade (UN)</option>
                      <option value="KG">Quilo (KG)</option>
                      <option value="LT">Litro (LT)</option>
                      <option value="ML">Mililitro (ML)</option>
                      <option value="G">Grama (G)</option>
                    </select>
                  </div>

                  {/* Código, Abreviação e Local de Impressão */}
                  <div className="prod-form-group" style={{ gridColumn: 'span 2' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', width: '100%', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '120px' }}>
                        <label>Código do Produto</label>
                        <input
                          type="text"
                          value={formData.code}
                          onChange={e => setFormData({ ...formData, code: e.target.value })}
                          placeholder="Ex: 001"
                          className="prod-input"
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: '120px' }}>
                        <label>Abreviação</label>
                        <input
                          type="text"
                          value={formData.abbreviation}
                          onChange={e => setFormData({ ...formData, abbreviation: e.target.value })}
                          placeholder="Ex: Hambúrguer"
                          className="prod-input"
                        />
                      </div>
                      <div style={{ flex: 1.5, minWidth: '150px' }}>
                        <label>Local de Impressão</label>
                        <select
                          value={formData.printTarget}
                          onChange={e => setFormData({ ...formData, printTarget: e.target.value })}
                          className="prod-select"
                        >
                          <option value="">Sem Impressão</option>
                          <option value="Cozinha">Cozinha</option>
                          <option value="Bar">Bar</option>
                          <option value="Balcão">Balcão</option>
                          <option value="Copa">Copa</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Checkboxes e Extras */}
                  <div className="prod-form-group" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0 }}>
                      <input
                        type="checkbox"
                        checked={formData.isFractionable}
                        onChange={e => setFormData({ ...formData, isFractionable: e.target.checked })}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                      />
                      Permitir Venda Fracionada (Ex: 0,5 KG)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0 }}>
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                      />
                      Produto Ativo no Sistema
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0 }}>
                      <input
                        type="checkbox"
                        checked={formData.isVisible}
                        onChange={e => setFormData({ ...formData, isVisible: e.target.checked })}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                      />
                      Visível (Exibir este produto no painel de vendas)
                    </label>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'canais' && (
              <div className="prod-tab-section animate-fade-in">
                <div className="prod-form-group" style={{ marginBottom: '1.5rem' }}>
                  <h3 className="prod-section-title" style={{ margin: 0 }}>Tabela de Preços por Canal</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Deixe em branco para usar o <strong>Preço Base (R$ {formData.basePrice || '0,00'})</strong>.
                  </p>
                </div>

                <div style={{ background: 'rgba(15, 23, 42, 0.4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'rgba(30, 41, 59, 0.8)', borderBottom: '1px solid var(--border-strong)' }}>
                      <tr>
                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', width: '45%' }}>Canal de Venda</th>
                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', width: '35%' }}>Preço Diferenciado (R$)</th>
                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', textAlign: 'center' }}>Habilitado / Visível</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: 0, name: 'Comandas', icon: LayoutList },
                        { id: 1, name: 'Balcão', icon: MonitorPlay },
                        { id: 2, name: 'Mesas', icon: LayoutGrid },
                        { id: 3, name: 'Delivery', icon: Truck },
                        { id: 4, name: 'iFood', icon: ShoppingBag }
                      ].map(canal => {
                        const priceObj = formData.prices.find(p => p.channel === canal.id) || { channel: canal.id, price: '', isVisible: true };
                        return (
                          <tr key={canal.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <td style={{ padding: '1rem', color: 'var(--text-primary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <canal.icon size={16} className="text-primary" />
                              {canal.name}
                            </td>
                            <td style={{ padding: '0.5rem 1rem' }}>
                              <input
                                type="text"
                                value={priceObj.price}
                                onChange={(e) => {
                                  const newPrices = [...formData.prices];
                                  const index = newPrices.findIndex(p => p.channel === canal.id);
                                  if (index >= 0) newPrices[index].price = formatCurrency(e.target.value);
                                  setFormData({ ...formData, prices: newPrices });
                                }}
                                placeholder="Ex: 25,00"
                                className="prod-input"
                                style={{ background: 'rgba(0,0,0,0.2)', padding: '0.5rem 0.75rem' }}
                              />
                            </td>
                            <td style={{ padding: '0.5rem 1rem', textAlign: 'center' }}>
                              <input
                                type="checkbox"
                                checked={priceObj.isVisible !== false}
                                onChange={(e) => {
                                  const newPrices = [...formData.prices];
                                  const index = newPrices.findIndex(p => p.channel === canal.id);
                                  if (index >= 0) newPrices[index].isVisible = e.target.checked;
                                  setFormData({ ...formData, prices: newPrices });
                                }}
                                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === 'composicao' && (
              <div className="prod-tab-section animate-fade-in">
                <div className="prod-form-group" style={{ marginBottom: '1.25rem' }}>
                  <h3 className="prod-section-title" style={{ margin: 0 }}>Composição e Ingredientes</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Configure a ficha técnica do produto (ingredientes essenciais), opcionais removíveis na venda ou adicionais pagos.
                  </p>
                </div>

                {/* Formulário de Adição Rápida */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(30, 41, 59, 0.3)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  {/* Linha 1: Select de Ingrediente e Input de Quantidade */}
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', width: '100%' }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Selecione o item do produto</span>
                      <select
                        value={selectedIngredientId}
                        onChange={e => setSelectedIngredientId(e.target.value)}
                        className="prod-select"
                        style={{ width: '100%' }}
                      >
                        <option value="">- Selecione o item do produto</option>
                        {[...productsList]
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map(p => <option key={p.id} value={p.id}>{p.name}</option>)
                        }
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Quantidade</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <input
                          type="text"
                          value={ingredientQty}
                          onChange={e => setIngredientQty(e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.'))}
                          className="prod-input"
                          style={{ width: '90px', height: '38px', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', textAlign: 'right' }}
                        />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, minWidth: '24px' }}>
                          {productsList.find(p => p.id === selectedIngredientId)?.unit || 'UN'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Linha 2: Tipo de composição, Valor, Ativo e Botão de Adicionar */}
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', width: '100%', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '150px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Tipo de composição</span>
                      <select
                        value={ingredientType}
                        onChange={e => {
                          const type = parseInt(e.target.value);
                          setIngredientType(type);
                          if (type !== 2) {
                            setIngredientPrice('');
                          }
                        }}
                        className="prod-select"
                        style={{ width: '100%' }}
                      >
                        <option value={0}>Composição</option>
                        <option value={1}>Opcional</option>
                        <option value={2}>Adicional</option>
                      </select>
                    </div>

                    {ingredientType === 2 && (
                      <div style={{ width: '120px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Valor:</span>
                        <input
                          type="text"
                          value={ingredientPrice}
                          onChange={e => setIngredientPrice(formatCurrency(e.target.value))}
                          placeholder="0,00"
                          className="prod-input"
                          style={{ height: '38px' }}
                        />
                      </div>
                    )}

                    {ingredientType > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', height: '38px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-primary)', userSelect: 'none', margin: 0 }}>
                          <input
                            type="checkbox"
                            checked={ingredientActive}
                            onChange={e => setIngredientActive(e.target.checked)}
                            style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                          />
                          Ativo
                        </label>
                      </div>
                    )}

                    <div style={{ marginLeft: 'auto' }}>
                      <button
                        type="button"
                        className="prod-btn prod-btn-secondary"
                        style={{ padding: '0.65rem 1rem', height: '38px' }}
                        onClick={(e) => {
                          e.preventDefault();
                          if (selectedIngredientId) {
                            const matched = productsList.find(p => p.id === selectedIngredientId);
                            if (matched) {
                              const exists = formData.ingredients.some(i => i.ingredientProductId === selectedIngredientId);
                              if (exists) {
                                setError("Este ingrediente já foi adicionado.");
                                return;
                              }

                              setFormData({
                                ...formData,
                                ingredients: [...formData.ingredients, {
                                  ingredientProductId: selectedIngredientId,
                                  quantity: ingredientQty,
                                  type: ingredientType,
                                  additionalPrice: ingredientType === 2 ? ingredientPrice : '',
                                  isActive: ingredientType > 0 ? ingredientActive : true,
                                  name: matched.name
                                }]
                              });
                              setSelectedIngredientId('');
                              setIngredientQty('1');
                              setIngredientType(0);
                              setIngredientPrice('');
                              setIngredientActive(true);
                            }
                          } else {
                            setError("Por favor, selecione um ingrediente.");
                          }
                        }}
                      >
                        <Plus size={16} /> Adicionar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Listagem */}
                <div style={{ background: 'rgba(15, 23, 42, 0.4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'rgba(30, 41, 59, 0.8)', borderBottom: '1px solid var(--border-strong)' }}>
                      <tr>
                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Ingrediente</th>
                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, width: '120px' }}>Quantidade</th>
                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Tipo</th>
                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Preço Adicional</th>
                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center', width: '90px' }}>Ativo</th>
                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, width: '60px', textAlign: 'center' }}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.ingredients.length === 0 && (
                        <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Nenhum ingrediente ou opcional adicionado.</td></tr>
                      )}
                      {[...formData.ingredients]
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((ing) => {
                          const originalIdx = formData.ingredients.findIndex(item => item.ingredientProductId === ing.ingredientProductId);
                          const matchedProd = productsList.find(p => p.id === ing.ingredientProductId);
                          const unit = matchedProd ? matchedProd.unit : 'UN';

                          return (
                            <tr key={ing.ingredientProductId} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                              <td style={{ padding: '1rem', color: 'var(--text-primary)', fontWeight: 500 }}>{ing.name}</td>
                              <td style={{ padding: '0.5rem 1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                  <input
                                    type="number"
                                    step="any"
                                    min="0.001"
                                    value={ing.quantity}
                                    onChange={(e) => {
                                      const newIngs = [...formData.ingredients];
                                      newIngs[originalIdx].quantity = e.target.value;
                                      setFormData({ ...formData, ingredients: newIngs });
                                    }}
                                    className="prod-input"
                                    style={{ width: '90px', height: '32px', padding: '0.25rem 0.5rem', background: 'rgba(0,0,0,0.2)', textAlign: 'right', fontSize: '0.85rem' }}
                                  />
                                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, minWidth: '24px' }}>{unit}</span>
                                </div>
                              </td>
                              <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>
                                <select
                                  value={ing.type}
                                  onChange={(e) => {
                                    const newIngs = [...formData.ingredients];
                                    const newType = parseInt(e.target.value);
                                    newIngs[originalIdx].type = newType;
                                    if (newType !== 2) {
                                      newIngs[originalIdx].additionalPrice = '';
                                    }
                                    setFormData({ ...formData, ingredients: newIngs });
                                  }}
                                  className="prod-select"
                                  style={{ padding: '0.25rem 0.5rem', height: '32px', fontSize: '0.85rem' }}
                                >
                                  <option value={0}>Composição</option>
                                  <option value={1}>Opcional</option>
                                  <option value={2}>Adicional</option>
                                </select>
                              </td>
                              <td style={{ padding: '0.5rem 1rem' }}>
                                {ing.type === 2 ? (
                                  <input
                                    type="text"
                                    value={ing.additionalPrice}
                                    onChange={e => {
                                      const newIngs = [...formData.ingredients];
                                      newIngs[originalIdx].additionalPrice = formatCurrency(e.target.value);
                                      setFormData({ ...formData, ingredients: newIngs });
                                    }}
                                    className="prod-input"
                                    style={{ width: '100px', padding: '0.25rem 0.5rem', height: '32px', background: 'rgba(0,0,0,0.2)', fontSize: '0.85rem' }}
                                    placeholder="R$ 0,00"
                                  />
                                ) : (
                                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>-</span>
                                )}
                              </td>
                              <td style={{ padding: '0.5rem 1rem', textAlign: 'center' }}>
                                {ing.type > 0 ? (
                                  <input
                                    type="checkbox"
                                    checked={ing.isActive !== false}
                                    onChange={e => {
                                      const newIngs = [...formData.ingredients];
                                      newIngs[originalIdx].isActive = e.target.checked;
                                      setFormData({ ...formData, ingredients: newIngs });
                                    }}
                                    style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                                  />
                                ) : (
                                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Sempre Ativo</span>
                                )}
                              </td>
                              <td style={{ padding: '0.5rem 1rem', textAlign: 'center' }}>
                                <button
                                  className="prod-btn-close"
                                  style={{ margin: '0 auto' }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const newIngs = formData.ingredients.filter(item => item.ingredientProductId !== ing.ingredientProductId);
                                    setFormData({ ...formData, ingredients: newIngs });
                                  }}
                                >
                                  <X size={16} />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'pacotes' && (
              <div className="prod-tab-section animate-fade-in">
                <div className="prod-form-group" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 className="prod-section-title" style={{ margin: 0 }}>Construtor de Pacotes (Pizzas, Açaí, Adicionais)</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Crie etapas de escolha para o cliente. Ex: "Etapa 1: Tamanho", "Etapa 2: Sabores".
                    </p>
                  </div>
                  <button
                    className="prod-btn prod-btn-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      setFormData({
                        ...formData,
                        modifierGroups: [...formData.modifierGroups, {
                          uiId: Math.random().toString(36).substr(2, 9),
                          name: 'Novo Pacote (Ex: Sabores)',
                          minSelections: 1,
                          maxSelections: 1,
                          priceRule: 1, // Maior Valor
                          options: []
                        }]
                      })
                    }}
                  >
                    <Plus size={16} /> Adicionar Etapa/Pacote
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {formData.modifierGroups.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', background: 'rgba(15, 23, 42, 0.4)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-subtle)' }}>
                      <Layers size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto' }} />
                      <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Nenhum pacote configurado</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Produto simples sem adicionais ou etapas de escolha.</p>
                    </div>
                  )}

                  {formData.modifierGroups.map((group, groupIdx) => (
                    <div key={group.uiId} style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-strong)', overflow: 'hidden' }}>
                      {/* Header do Pacote */}
                      <div style={{ background: 'rgba(30, 41, 59, 0.8)', padding: '1rem', borderBottom: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '1rem', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={group.name}
                          onChange={(e) => {
                            const newGroups = [...formData.modifierGroups];
                            newGroups[groupIdx].name = e.target.value;
                            setFormData({ ...formData, modifierGroups: newGroups });
                          }}
                          className="prod-input"
                          style={{ background: 'rgba(0,0,0,0.3)' }}
                          placeholder="Nome do Pacote"
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mín:</span>
                          <input type="number" value={group.minSelections} onChange={e => { const ng = [...formData.modifierGroups]; ng[groupIdx].minSelections = parseInt(e.target.value) || 0; setFormData({ ...formData, modifierGroups: ng }) }} className="prod-input" style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Máx:</span>
                          <input type="number" value={group.maxSelections} onChange={e => { const ng = [...formData.modifierGroups]; ng[groupIdx].maxSelections = parseInt(e.target.value) || 0; setFormData({ ...formData, modifierGroups: ng }) }} className="prod-input" style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem' }} />
                        </div>
                        <select value={group.priceRule} onChange={e => { const ng = [...formData.modifierGroups]; ng[groupIdx].priceRule = parseInt(e.target.value); setFormData({ ...formData, modifierGroups: ng }) }} className="prod-select" style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem' }}>
                          <option value={0}>Média</option>
                          <option value={1}>Maior Valor</option>
                          <option value={2}>Soma</option>
                        </select>
                        <button className="prod-btn-close" onClick={() => {
                          const newGroups = [...formData.modifierGroups];
                          newGroups.splice(groupIdx, 1);
                          setFormData({ ...formData, modifierGroups: newGroups });
                        }}><Trash2 size={16} /></button>
                      </div>

                      {/* Body do Pacote (Opções) */}
                      <div style={{ padding: '1rem', background: 'rgba(15, 23, 42, 0.2)' }}>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                          <input type="text" id={`opt-name-${group.uiId}`} placeholder="Nome da Opção (Ex: Calabresa)" className="prod-input" style={{ flex: 2 }} />
                          <input type="number" id={`opt-price-${group.uiId}`} placeholder="R$ Adicional" step="0.01" className="prod-input" style={{ flex: 1 }} />
                          <select id={`opt-prod-${group.uiId}`} className="prod-select" style={{ flex: 2 }}>
                            <option value="">Vincular Produto de Estoque (Opcional)</option>
                            {productsList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                          </select>
                          <button className="prod-btn prod-btn-secondary" onClick={(e) => {
                            e.preventDefault();
                            const nameInput = document.getElementById(`opt-name-${group.uiId}`) as HTMLInputElement;
                            const priceInput = document.getElementById(`opt-price-${group.uiId}`) as HTMLInputElement;
                            const prodSelect = document.getElementById(`opt-prod-${group.uiId}`) as HTMLSelectElement;
                            if (nameInput.value) {
                              const ng = [...formData.modifierGroups];
                              ng[groupIdx].options.push({
                                name: nameInput.value,
                                additionalPrice: priceInput.value || '0',
                                maxQuantity: 1,
                                productId: prodSelect.value
                              });
                              setFormData({ ...formData, modifierGroups: ng });
                              nameInput.value = ''; priceInput.value = ''; prodSelect.value = '';
                            }
                          }}>Add Opção</button>
                        </div>

                        <div style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                            <thead style={{ background: 'rgba(30, 41, 59, 0.4)', borderBottom: '1px solid var(--border-strong)' }}>
                              <tr>
                                <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Opção</th>
                                <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>+ R$</th>
                                <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Máx Qtd</th>
                                <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, width: '40px' }}>Excluir</th>
                              </tr>
                            </thead>
                            <tbody>
                              {group.options.length === 0 && (
                                <tr><td colSpan={4} style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>Insira as opções acima.</td></tr>
                              )}
                              {group.options.map((opt, optIdx) => (
                                <tr key={optIdx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                  <td style={{ padding: '0.75rem', color: 'var(--text-primary)' }}>{opt.name} {opt.productId && <span style={{ fontSize: '0.75rem', color: 'var(--primary)', marginLeft: '0.5rem' }}>(Vinculado)</span>}</td>
                                  <td style={{ padding: '0.75rem', color: 'var(--text-primary)' }}>{opt.additionalPrice}</td>
                                  <td style={{ padding: '0.75rem' }}>
                                    <input type="number" value={opt.maxQuantity} onChange={e => { const ng = [...formData.modifierGroups]; ng[groupIdx].options[optIdx].maxQuantity = parseInt(e.target.value) || 1; setFormData({ ...formData, modifierGroups: ng }); }} className="prod-input" style={{ width: '60px', padding: '0.25rem 0.5rem', height: '28px' }} />
                                  </td>
                                  <td style={{ padding: '0.75rem' }}>
                                    <button className="prod-btn-close" style={{ padding: '2px' }} onClick={(e) => { e.preventDefault(); const ng = [...formData.modifierGroups]; ng[groupIdx].options.splice(optIdx, 1); setFormData({ ...formData, modifierGroups: ng }); }}><X size={14} /></button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ações de Salvar Globais do Modal */}
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '1rem', background: 'var(--bg-surface-hover)' }}>
            <button className="prod-btn prod-btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="prod-btn prod-btn-primary" onClick={handleSave}><Save size={16} /> Salvar Produto Completo</button>
          </div>
        </div>

      </div>
    </div>
  );

  return (
    isWindowMode ? (
      cardBody
    ) : (
      <div className="prod-modal-overlay animate-fade-in" onClick={onClose}>
        {cardBody}
      </div>
    )
  );
}
