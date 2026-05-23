import React, { useState } from 'react';
import { 
  X, Package, Search, Plus, Save, Settings, Tag, LayoutList, Grip, Layers, UploadCloud, Pencil, Image as ImageIcon, MonitorPlay, LayoutGrid, Truck, Trash2, Edit2, ArrowDown, ArrowUp
} from 'lucide-react';
import './ModalProdutos.css';

interface ModalProdutosProps {
  onClose: () => void;
}

export function ModalProdutos({ onClose }: ModalProdutosProps) {
  const [activeTab, setActiveTab] = useState<string>('geral');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
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
    isActive: true,
    isVisible: true,
    imageBase64: '',
    prices: [
      { channel: 0, price: '' }, // Balcao
      { channel: 1, price: '' }, // Mesa
      { channel: 2, price: '' }  // Delivery
    ],
    ingredients: [] as Array<{ ingredientProductId: string; quantity: string; name: string }>,
    comboItems: [] as Array<{ childProductId: string; quantity: string; fixedPrice: string; name: string }>,
    modifierGroups: [] as Array<{
      uiId: string;
      name: string;
      minSelections: number;
      maxSelections: number;
      priceRule: number;
      options: Array<{
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
        basePrice: prod.basePrice?.toString() || '',
        costPrice: prod.costPrice?.toString() || '',
        unit: prod.unit || 'UN',
        isFractionable: prod.isFractionable || false,
        barcode: prod.barcode || '',
        isActive: prod.isActive ?? true,
        isVisible: prod.isVisible ?? true,
        imageBase64: prod.imageBase64 || '',
        prices: [
          { channel: 0, price: prod.prices?.find((p: any) => p.channel === 0)?.price?.toString() || '' },
          { channel: 1, price: prod.prices?.find((p: any) => p.channel === 1)?.price?.toString() || '' },
          { channel: 2, price: prod.prices?.find((p: any) => p.channel === 2)?.price?.toString() || '' }
        ],
        ingredients: prod.ingredients?.map((i: any) => {
          const matchedProd = productsList.find(p => p.id === i.ingredientProductId);
          return {
            ingredientProductId: i.ingredientProductId,
            quantity: i.quantity?.toString() || '0',
            name: matchedProd ? matchedProd.name : "Ingrediente Desconhecido"
          };
        }) || [],
        comboItems: prod.comboItems?.map((c: any) => {
          const matchedProd = productsList.find(p => p.id === c.childProductId);
          return {
            childProductId: c.childProductId,
            quantity: c.quantity?.toString() || '0',
            fixedPrice: c.fixedPrice?.toString() || '',
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
            name: o.name,
            additionalPrice: o.additionalPrice?.toString() || '0',
            maxQuantity: o.maxQuantity,
            productId: o.productId
          })) || []
        })) || []
      });
      setActiveTab('geral');
    } catch (err: any) {
      alert("Erro ao carregar produto para edição: " + err.message);
    }
  };

  const handleNewProduct = () => {
    setEditingId(null);
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
      isActive: true,
      isVisible: true,
      imageBase64: '',
      prices: [
        { channel: 0, price: '' },
        { channel: 1, price: '' },
        { channel: 2, price: '' }
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

      alert("Produto excluído com sucesso!");
      fetchProducts();
      if (editingId === id) {
        handleNewProduct();
      }
    } catch (err: any) {
      alert("Erro ao excluir produto: " + err.message);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.categoryId) {
      alert("Nome e Categoria são obrigatórios.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // Sanitizando os dados para a API
      const payload = {
        ...formData,
        basePrice: parseFloat(formData.basePrice) || 0,
        costPrice: parseFloat(formData.costPrice) || 0,
        prices: formData.prices.filter(p => p.price !== '').map(p => ({
          channel: p.channel,
          price: parseFloat(p.price)
        })),
        ingredients: formData.ingredients.map(i => ({
          ingredientProductId: i.ingredientProductId,
          quantity: parseFloat(i.quantity)
        })),
        comboItems: formData.comboItems.map(c => ({
          childProductId: c.childProductId,
          quantity: parseFloat(c.quantity),
          fixedPrice: c.fixedPrice ? parseFloat(c.fixedPrice) : null
        })),
        modifierGroups: formData.modifierGroups.map(g => ({
          name: g.name,
          minSelections: g.minSelections,
          maxSelections: g.maxSelections,
          priceRule: g.priceRule,
          sequence: 0,
          options: g.options.map((o, idx) => ({
            name: o.name,
            additionalPrice: parseFloat(o.additionalPrice) || 0,
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

      alert(editingId ? "Produto atualizado com sucesso!" : "Produto salvo com sucesso!");
      fetchProducts();
      handleNewProduct();
    } catch (err: any) {
      alert("Erro ao salvar produto: " + err.message);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação de tipo de arquivo
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert("Tipo de arquivo inválido. Apenas imagens nos formatos PNG, JPG, JPEG e WEBP são permitidas.");
      return;
    }

    // Validação de tamanho (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('A imagem é muito grande. O limite máximo permitido é de 2MB. Otimize a imagem ou envie um arquivo de menor resolução.');
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
          alert(`As dimensões da imagem são muito grandes (${img.width}x${img.height}px). O limite sugerido para o sistema é de até ${MAX_WIDTH}x${MAX_HEIGHT}px. Por favor, envie uma imagem com dimensões menores.`);
          return;
        }
        setFormData(prev => ({ ...prev, imageBase64: event.target?.result as string }));
      };
      img.onerror = () => {
        alert("Erro ao decodificar a imagem. O arquivo pode estar corrompido.");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const tabs = [
    { id: 'geral', label: 'Dados Gerais', icon: Settings },
    { id: 'canais', label: 'Canais de Venda', icon: Tag },
    { id: 'composicao', label: 'Composição', icon: LayoutList },
    { id: 'combos', label: 'Combos', icon: Grip },
    { id: 'pacotes', label: 'Pacotes / Opcionais', icon: Layers }
  ];

  const filteredProducts = productsList.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.categoryName && p.categoryName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="prod-modal-overlay animate-fade-in" onClick={onClose}>
      <div className="prod-modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <header className="prod-modal-header">
          <div className="prod-header-title">
            <Package size={20} className="text-primary" />
            <span>Gerenciamento de Produtos</span>
          </div>
          <button className="prod-btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </header>

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
               <button className="prod-btn prod-btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={handleNewProduct}>
                 <Plus size={16} /> Novo Produto
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
                      <label>Imagem do Produto</label>
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
                            <span>Clique para enviar foto</span>
                          </div>
                        )}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                        Dimensão recomendada: proporção 1:1 (quadrada), ex: 400x400px. Limite máximo: 2MB e resolução de até 2500x2500px.
                      </span>
                    </div>

                    {/* Nome e Categoria */}
                    <div className="prod-form-group">
                      <label>Nome do Produto *</label>
                      <input 
                        type="text" 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        placeholder="Ex: Hambúrguer Clássico" 
                        className="prod-input"
                      />
                    </div>

                    <div className="prod-form-group">
                      <label>Categoria *</label>
                      <select 
                        value={formData.categoryId} 
                        onChange={e => setFormData({...formData, categoryId: e.target.value})}
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
                        type="number" 
                        step="0.01" 
                        value={formData.basePrice} 
                        onChange={e => setFormData({...formData, basePrice: e.target.value})} 
                        placeholder="0,00" 
                        className="prod-input"
                      />
                    </div>

                    <div className="prod-form-group">
                      <label>Unidade de Medida</label>
                      <select 
                        value={formData.unit} 
                        onChange={e => setFormData({...formData, unit: e.target.value})}
                        className="prod-select"
                      >
                        <option value="UN">Unidade (UN)</option>
                        <option value="KG">Quilo (KG)</option>
                        <option value="LT">Litro (LT)</option>
                        <option value="ML">Mililitro (ML)</option>
                        <option value="G">Grama (G)</option>
                      </select>
                    </div>

                    {/* Checkboxes e Extras */}
                    <div className="prod-form-group" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0 }}>
                        <input 
                          type="checkbox" 
                          checked={formData.isFractionable} 
                          onChange={e => setFormData({...formData, isFractionable: e.target.checked})}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                        />
                        Permitir Venda Fracionada (Ex: 0,5 KG)
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0 }}>
                        <input 
                          type="checkbox" 
                          checked={formData.isActive} 
                          onChange={e => setFormData({...formData, isActive: e.target.checked})}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                        />
                        Produto Ativo no Sistema
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0 }}>
                        <input 
                          type="checkbox" 
                          checked={formData.isVisible} 
                          onChange={e => setFormData({...formData, isVisible: e.target.checked})}
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
                          <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', width: '60%' }}>Canal de Venda</th>
                          <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>Preço Diferenciado (R$)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 0, name: 'PDV / Balcão', icon: MonitorPlay },
                          { id: 1, name: 'Mesas / Comandas', icon: LayoutGrid },
                          { id: 2, name: 'Delivery (Site/iFood)', icon: Truck }
                        ].map(canal => {
                          const priceObj = formData.prices.find(p => p.channel === canal.id) || { channel: canal.id, price: '' };
                          return (
                            <tr key={canal.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                              <td style={{ padding: '1rem', color: 'var(--text-primary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <canal.icon size={16} className="text-primary" />
                                {canal.name}
                              </td>
                              <td style={{ padding: '0.5rem 1rem' }}>
                                <input 
                                  type="number"
                                  step="0.01"
                                  value={priceObj.price}
                                  onChange={(e) => {
                                    const newPrices = [...formData.prices];
                                    const index = newPrices.findIndex(p => p.channel === canal.id);
                                    if (index >= 0) newPrices[index].price = e.target.value;
                                    setFormData({ ...formData, prices: newPrices });
                                  }}
                                  placeholder="Ex: 25,00"
                                  className="prod-input"
                                  style={{ background: 'rgba(0,0,0,0.2)', padding: '0.5rem 0.75rem' }}
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
                  <div className="prod-form-group" style={{ marginBottom: '1.5rem' }}>
                    <h3 className="prod-section-title" style={{ margin: 0 }}>Ficha Técnica (Ingredientes)</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Adicione os produtos que compõem esta receita. O estoque deles será descontado automaticamente.
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                    <select id="select-ingredient" className="prod-select" style={{ flex: 1 }}>
                      <option value="">Selecione um ingrediente...</option>
                      {productsList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <input type="number" id="qtd-ingredient" placeholder="Qtd" step="0.01" className="prod-input" style={{ width: '100px' }} />
                    <button 
                      className="prod-btn prod-btn-secondary"
                      onClick={(e) => {
                        e.preventDefault();
                        const select = document.getElementById('select-ingredient') as HTMLSelectElement;
                        const qtdInput = document.getElementById('qtd-ingredient') as HTMLInputElement;
                        if(select.value && qtdInput.value) {
                          const name = select.options[select.selectedIndex].text;
                          setFormData({
                            ...formData, 
                            ingredients: [...formData.ingredients, { ingredientProductId: select.value, quantity: qtdInput.value, name }]
                          });
                          select.value = ''; qtdInput.value = '';
                        }
                      }}
                    >
                      <Plus size={16} /> Adicionar
                    </button>
                  </div>

                  <div style={{ background: 'rgba(15, 23, 42, 0.4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead style={{ background: 'rgba(30, 41, 59, 0.8)', borderBottom: '1px solid var(--border-strong)' }}>
                        <tr>
                          <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Ingrediente</th>
                          <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Quantidade</th>
                          <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, width: '60px' }}>Remover</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.ingredients.length === 0 && (
                          <tr><td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Nenhum ingrediente adicionado.</td></tr>
                        )}
                        {formData.ingredients.map((ing, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>{ing.name}</td>
                            <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>{ing.quantity}</td>
                            <td style={{ padding: '1rem' }}>
                              <button className="prod-btn-close" onClick={(e) => {
                                e.preventDefault();
                                const newIngs = [...formData.ingredients];
                                newIngs.splice(idx, 1);
                                setFormData({...formData, ingredients: newIngs});
                              }}>
                                <X size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {activeTab === 'combos' && (
                <div className="prod-tab-section animate-fade-in">
                  <div className="prod-form-group" style={{ marginBottom: '1.5rem' }}>
                    <h3 className="prod-section-title" style={{ margin: 0 }}>Montagem de Combo</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Vincule os produtos que fazem parte dessa promoção e defina preços fixos opcionais.
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                    <select id="select-combo" className="prod-select" style={{ flex: 1 }}>
                      <option value="">Selecione o produto integrante...</option>
                      {productsList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <input type="number" id="qtd-combo" placeholder="Qtd" step="0.01" className="prod-input" style={{ width: '100px' }} />
                    <input type="number" id="price-combo" placeholder="Preço Fixo (Opcional)" step="0.01" className="prod-input" style={{ width: '180px' }} />
                    <button 
                      className="prod-btn prod-btn-secondary"
                      onClick={(e) => {
                        e.preventDefault();
                        const select = document.getElementById('select-combo') as HTMLSelectElement;
                        const qtdInput = document.getElementById('qtd-combo') as HTMLInputElement;
                        const priceInput = document.getElementById('price-combo') as HTMLInputElement;
                        if(select.value && qtdInput.value) {
                          const name = select.options[select.selectedIndex].text;
                          setFormData({
                            ...formData, 
                            comboItems: [...formData.comboItems, { childProductId: select.value, quantity: qtdInput.value, fixedPrice: priceInput.value, name }]
                          });
                          select.value = ''; qtdInput.value = ''; priceInput.value = '';
                        }
                      }}
                    >
                      <Plus size={16} /> Adicionar
                    </button>
                  </div>

                  <div style={{ background: 'rgba(15, 23, 42, 0.4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead style={{ background: 'rgba(30, 41, 59, 0.8)', borderBottom: '1px solid var(--border-strong)' }}>
                        <tr>
                          <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Produto do Combo</th>
                          <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Quantidade</th>
                          <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Preço Fixo</th>
                          <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, width: '60px' }}>Remover</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.comboItems.length === 0 && (
                          <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Nenhum produto adicionado ao combo.</td></tr>
                        )}
                        {formData.comboItems.map((item, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>{item.name}</td>
                            <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>{item.quantity}</td>
                            <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>
                              {item.fixedPrice ? `R$ ${parseFloat(item.fixedPrice).toFixed(2)}` : <span style={{ color: 'var(--text-muted)' }}>Original</span>}
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <button className="prod-btn-close" onClick={(e) => {
                                e.preventDefault();
                                const newItems = [...formData.comboItems];
                                newItems.splice(idx, 1);
                                setFormData({...formData, comboItems: newItems});
                              }}>
                                <X size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
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
                            <input type="number" value={group.minSelections} onChange={e => { const ng = [...formData.modifierGroups]; ng[groupIdx].minSelections = parseInt(e.target.value)||0; setFormData({...formData, modifierGroups: ng})}} className="prod-input" style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem' }} />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Máx:</span>
                            <input type="number" value={group.maxSelections} onChange={e => { const ng = [...formData.modifierGroups]; ng[groupIdx].maxSelections = parseInt(e.target.value)||0; setFormData({...formData, modifierGroups: ng})}} className="prod-input" style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem' }} />
                          </div>
                          <select value={group.priceRule} onChange={e => { const ng = [...formData.modifierGroups]; ng[groupIdx].priceRule = parseInt(e.target.value); setFormData({...formData, modifierGroups: ng})}} className="prod-select" style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem' }}>
                            <option value={0}>Média</option>
                            <option value={1}>Maior Valor</option>
                            <option value={2}>Soma</option>
                          </select>
                          <button className="prod-btn-close" onClick={() => {
                            const newGroups = [...formData.modifierGroups];
                            newGroups.splice(groupIdx, 1);
                            setFormData({...formData, modifierGroups: newGroups});
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
                               if(nameInput.value) {
                                 const ng = [...formData.modifierGroups];
                                 ng[groupIdx].options.push({
                                   name: nameInput.value,
                                   additionalPrice: priceInput.value || '0',
                                   maxQuantity: 1,
                                   productId: prodSelect.value
                                 });
                                 setFormData({...formData, modifierGroups: ng});
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
                                    <td style={{ padding: '0.75rem', color: 'var(--text-primary)' }}>{opt.name} {opt.productId && <span style={{fontSize: '0.75rem', color: 'var(--primary)', marginLeft:'0.5rem'}}>(Vinculado)</span>}</td>
                                    <td style={{ padding: '0.75rem', color: 'var(--text-primary)' }}>{opt.additionalPrice}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                      <input type="number" value={opt.maxQuantity} onChange={e => { const ng = [...formData.modifierGroups]; ng[groupIdx].options[optIdx].maxQuantity = parseInt(e.target.value)||1; setFormData({...formData, modifierGroups: ng}); }} className="prod-input" style={{ width: '60px', padding: '0.25rem 0.5rem', height: '28px' }} />
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>
                                      <button className="prod-btn-close" style={{ padding: '2px' }} onClick={(e) => { e.preventDefault(); const ng = [...formData.modifierGroups]; ng[groupIdx].options.splice(optIdx, 1); setFormData({...formData, modifierGroups: ng}); }}><X size={14}/></button>
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
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '1rem', background: 'rgba(30, 41, 59, 0.5)' }}>
               <button className="prod-btn prod-btn-secondary" onClick={onClose}>Cancelar</button>
               <button className="prod-btn prod-btn-primary" onClick={handleSave}><Save size={16} /> Salvar Produto Completo</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
