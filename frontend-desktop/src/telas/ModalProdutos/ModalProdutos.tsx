import React, { useState } from 'react';
import {
  X, Package, Search, Plus, Save, Settings, Tag, LayoutList, Layers, UploadCloud, Pencil, MonitorPlay, LayoutGrid, Truck, Trash2, HelpCircle, AlertCircle, ShoppingBag
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

const formatQuantityDecimal = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  if (!cleanValue) return '0,000';
  const numberValue = parseFloat(cleanValue) / 1000;
  return numberValue.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
};

const generateGuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const getNextProductCode = (products: any[]): string => {
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
      id?: string;
      name: string;
      minSelections: number;
      maxSelections: number;
      priceRule: number;
      isPropType: boolean;
      canBeFractioned: boolean;
      options: Array<{
        id?: string;
        name: string;
        additionalPrice: string;
        basePrice: string;
        totalPrice: string;
        minQuantity: number;
        maxQuantity: number;
        productId: string;
        isPreSelected: boolean;
        isVisible: boolean;
        abbreviation: string;
        parentOptionId: string;
      }>
    }>,
    preparationTime: 0,
    controlStock: false,
    stockSectorId: '',
    minStock: 0,
    maxStock: 0,
    stockContent: 0,
    isDivisible: false,
    isPerishable: false,
    isAutoWeight: false,
    promotions: [] as Array<{
      id?: string;
      uiId?: string;
      dayStart: string;
      hourStart: number;
      dayEnd: string;
      hourEnd: number;
      price: string;
      isSaleForbidden: boolean;
    }>
  });

  const [isSectorModalOpen, setIsSectorModalOpen] = useState(false);

  // Estados para CRUD de Setores de Estoque
  const [sectorsList, setSectorsList] = useState<any[]>([]);
  const [sectorName, setSectorName] = useState('');
  const [sectorDescription, setSectorDescription] = useState('');
  const [editingSectorId, setEditingSectorId] = useState<string | null>(null);

  // Estados locais para CRUD de Promoções
  const [promoDiaInicio, setPromoDiaInicio] = useState('Segunda-feira');
  const [promoHoraInicio, setPromoHoraInicio] = useState<number>(0);
  const [promoDiaFim, setPromoDiaFim] = useState('Segunda-feira');
  const [promoHoraFim, setPromoHoraFim] = useState<number>(0);
  const [promoPreco, setPromoPreco] = useState('');
  const [promoProibirVenda, setPromoProibirVenda] = useState(false);
  const [editingPromoId, setEditingPromoId] = useState<string | null>(null);
  const [editingPromoUiId, setEditingPromoUiId] = useState<string | null>(null);

  // Estados para CRUD de Etapas de Pacotes
  const [selectedGroupUiId, setSelectedGroupUiId] = useState<string | null>(null);
  const [isEditingGroup, setIsEditingGroup] = useState<boolean>(false);
  const [groupName, setGroupName] = useState<string>('');
  const [groupCanBeFractioned, setGroupCanBeFractioned] = useState<boolean>(false);
  const [groupPriceRule, setGroupPriceRule] = useState<number>(1); // Padrão Máximo (1)
  const [groupMinSelections, setGroupMinSelections] = useState<number>(1);
  const [groupMaxSelections, setGroupMaxSelections] = useState<number>(1);

  // Estados para CRUD de Opções (Itens da Etapa)
  const [customProperties, setCustomProperties] = useState<Array<{ id: string; name: string; abbreviation: string }>>([]);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState<boolean>(false);
  const [propNameInput, setPropNameInput] = useState<string>('');
  const [propAbbrevInput, setPropAbbrevInput] = useState<string>('');
  const [selectedPropId, setSelectedPropId] = useState<string | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isEditingOption, setIsEditingOption] = useState<boolean>(false);
  const [optType, setOptType] = useState<'prod' | 'prop'>('prop');
  const [optProductId, setOptProductId] = useState<string>('');
  const [optProductNameInput, setOptProductNameInput] = useState<string>(''); // Texto digitado na busca
  const [optPropName, setOptPropName] = useState<string>('');
  const [optBasePrice, setOptBasePrice] = useState<string>('0,00');
  const [optTotalPrice, setOptTotalPrice] = useState<string>('0,00');
  const [optMinQuantity, setOptMinQuantity] = useState<number>(0);
  const [optMaxQuantity, setOptMaxQuantity] = useState<number>(1);
  const [optParentOptionId, setOptParentOptionId] = useState<string>('');
  const [optAbbreviation, setOptAbbreviation] = useState<string>('');
  const [optIsPreSelected, setOptIsPreSelected] = useState<boolean>(false);
  const [optIsVisible, setOptIsVisible] = useState<boolean>(true);
  const [showProductSuggestions, setShowProductSuggestions] = useState<boolean>(false);

  const handleSelectOption = (optId: string) => {
    if (isEditingOption) return;
    setSelectedOptionId(optId);
  };

  const handleStartEditOption = (opt: any) => {
    const matchedId = opt.id || opt.uiId || opt.name;
    setSelectedOptionId(matchedId);
    setOptType(opt.productId ? 'prod' : 'prop');
    setOptProductId(opt.productId || '');
    if (opt.productId) {
      const matched = productsList.find(p => p.id === opt.productId);
      setOptProductNameInput(matched ? matched.name : opt.name);
    } else {
      setOptProductNameInput('');
    }
    setOptPropName(opt.productId ? '' : opt.name);
    setOptBasePrice(opt.basePrice || '0,00');
    setOptTotalPrice(opt.totalPrice || opt.additionalPrice || '0,00');
    setOptMinQuantity(opt.minQuantity || 0);
    setOptMaxQuantity(opt.maxQuantity || 1);
    setOptParentOptionId(opt.parentOptionId || '');
    setOptAbbreviation(opt.abbreviation || '');
    setOptIsPreSelected(opt.isPreSelected || false);
    setOptIsVisible(opt.isVisible !== false);
    setIsEditingOption(true);
  };

  const handleCancelEditOption = () => {
    setIsEditingOption(false);
    setSelectedOptionId(null);
    setOptProductId('');
    setOptProductNameInput('');
    setOptPropName('');
    setOptBasePrice('0,00');
    setOptTotalPrice('0,00');
    setOptMinQuantity(0);
    setOptMaxQuantity(1);
    setOptParentOptionId('');
    setOptAbbreviation('');
    setOptIsPreSelected(false);
    setOptIsVisible(true);
  };

  const handleAddOption = () => {
    if (!selectedGroupUiId) return;
    
    let optName = '';
    if (optType === 'prop') {
      optName = optPropName;
      if (!optName) {
        setError("Por favor, selecione uma propriedade.");
        return;
      }
    } else {
      if (!optProductId) {
        setError("Por favor, selecione um produto de estoque.");
        return;
      }
      const matched = productsList.find(p => p.id === optProductId);
      optName = matched ? matched.name : '';
    }

    const selectedGroup = formData.modifierGroups.find(g => (g.uiId || g.id) === selectedGroupUiId);
    if (!selectedGroup) return;

    // Regra: propriedade não mistura com produto
    if (selectedGroup.options.length > 0) {
      const hasProducts = selectedGroup.options.some(o => !!o.productId);
      if (optType === 'prod' && !hasProducts) {
        setError("Esta etapa está configurada para Propriedades. Remova os itens existentes ou crie outra etapa.");
        return;
      }
      if (optType === 'prop' && hasProducts) {
        setError("Esta etapa está configurada para Produtos. Remova os itens existentes ou crie outra etapa.");
        return;
      }
    }

    const newOption = {
      uiId: generateGuid(), // Para identificação no frontend se não tiver ID
      id: generateGuid(),
      name: optName,
      additionalPrice: optTotalPrice,
      basePrice: optBasePrice,
      totalPrice: optTotalPrice,
      minQuantity: optMinQuantity,
      maxQuantity: optMaxQuantity,
      productId: optType === 'prod' ? optProductId : '',
      isPreSelected: optIsPreSelected,
      isVisible: optIsVisible,
      abbreviation: optAbbreviation,
      parentOptionId: optParentOptionId
    };

    setFormData(prev => {
      const updated = prev.modifierGroups.map(g => {
        if ((g.uiId || g.id) === selectedGroupUiId) {
          return {
            ...g,
            options: [...g.options, newOption]
          };
        }
        return g;
      });
      return { ...prev, modifierGroups: updated };
    });

    handleCancelEditOption();
  };

  const handleSaveOption = () => {
    if (!selectedGroupUiId || !selectedOptionId) return;

    let optName = '';
    if (optType === 'prop') {
      optName = optPropName;
      if (!optName) {
        setError("Por favor, selecione uma propriedade.");
        return;
      }
    } else {
      if (!optProductId) {
        setError("Por favor, selecione um produto de estoque.");
        return;
      }
      const matched = productsList.find(p => p.id === optProductId);
      optName = matched ? matched.name : '';
    }

    setFormData(prev => {
      const updatedGroups = prev.modifierGroups.map(g => {
        if ((g.uiId || g.id) === selectedGroupUiId) {
          const updatedOptions = g.options.map(o => {
            const idToCompare = o.id || (o as any).uiId || o.name;
            if (idToCompare === selectedOptionId) {
              return {
                ...o,
                name: optName,
                additionalPrice: optTotalPrice,
                basePrice: optBasePrice,
                totalPrice: optTotalPrice,
                minQuantity: optMinQuantity,
                maxQuantity: optMaxQuantity,
                productId: optType === 'prod' ? optProductId : '',
                isPreSelected: optIsPreSelected,
                isVisible: optIsVisible,
                abbreviation: optAbbreviation,
                parentOptionId: optParentOptionId
              };
            }
            return o;
          });
          return { ...g, options: updatedOptions };
        }
        return g;
      });
      return { ...prev, modifierGroups: updatedGroups };
    });

    handleCancelEditOption();
  };

  const handleDeleteOption = (opt?: any) => {
    const targetOptionId = opt ? (opt.id || (opt as any).uiId || opt.name) : selectedOptionId;
    if (!selectedGroupUiId || !targetOptionId) return;
    const targetOpt = opt || (formData.modifierGroups.find(g => (g.uiId || g.id) === selectedGroupUiId)?.options.find(o => (o.id || (o as any).uiId || o.name) === targetOptionId));
    const targetName = targetOpt ? targetOpt.name : 'esta opção';
    if (!window.confirm(`Tem certeza que deseja excluir a opção "${targetName}"?`)) return;

    setFormData(prev => {
      const updatedGroups = prev.modifierGroups.map(g => {
        if ((g.uiId || g.id) === selectedGroupUiId) {
          const filteredOptions = g.options.filter(o => {
            const idToCompare = o.id || (o as any).uiId || o.name;
            return idToCompare !== targetOptionId;
          });
          return { ...g, options: filteredOptions };
        }
        return g;
      });
      return { ...prev, modifierGroups: updatedGroups };
    });

    if (selectedOptionId === targetOptionId) {
      handleCancelEditOption();
    }
  };

  const handleSelectGroup = (uiId: string) => {
    if (isEditingGroup) return; // Não muda a seleção se estiver editando
    setSelectedGroupUiId(uiId);
  };

  const handleStartEditGroup = (group: any) => {
    setGroupName(group.name);
    setGroupCanBeFractioned(group.canBeFractioned);
    setGroupPriceRule(group.priceRule);
    setGroupMinSelections(group.minSelections);
    setGroupMaxSelections(group.maxSelections);
    setIsEditingGroup(true);
    setSelectedGroupUiId(group.uiId || group.id);
  };

  const handleCancelEditGroup = () => {
    setIsEditingGroup(false);
    setSelectedGroupUiId(null);
    setGroupName('');
    setGroupCanBeFractioned(false);
    setGroupPriceRule(1);
    setGroupMinSelections(1);
    setGroupMaxSelections(1);
  };

  const handleAddGroup = () => {
    if (!groupName.trim()) {
      setError("A descrição da etapa é obrigatória.");
      return;
    }
    const newGroup = {
      uiId: generateGuid(),
      name: groupName,
      minSelections: groupMinSelections,
      maxSelections: groupMaxSelections,
      priceRule: groupPriceRule,
      isPropType: true,
      canBeFractioned: groupCanBeFractioned,
      options: []
    };
    setFormData(prev => ({
      ...prev,
      modifierGroups: [...prev.modifierGroups, newGroup]
    }));
    setGroupName('');
    setGroupCanBeFractioned(false);
    setGroupPriceRule(1);
    setGroupMinSelections(1);
    setGroupMaxSelections(1);
  };

  const handleSaveGroup = () => {
    if (!groupName.trim()) {
      setError("A descrição da etapa é obrigatória.");
      return;
    }
    setFormData(prev => {
      const updated = prev.modifierGroups.map(g => {
        const idToCompare = g.uiId || g.id;
        if (idToCompare === selectedGroupUiId) {
          return {
            ...g,
            name: groupName,
            minSelections: groupMinSelections,
            maxSelections: groupMaxSelections,
            priceRule: groupPriceRule,
            canBeFractioned: groupCanBeFractioned
          };
        }
        return g;
      });
      return { ...prev, modifierGroups: updated };
    });
    handleCancelEditGroup();
  };

  const handleDeleteGroup = (group?: any) => {
    const targetGroupUiId = group ? (group.uiId || group.id) : selectedGroupUiId;
    if (!targetGroupUiId) return;
    const targetGroup = group || formData.modifierGroups.find(g => (g.uiId || g.id) === targetGroupUiId);
    const targetName = targetGroup ? targetGroup.name : 'esta etapa';
    if (!window.confirm(`Tem certeza que deseja excluir a etapa "${targetName}" e todas as suas opções?`)) return;
    setFormData(prev => {
      const filtered = prev.modifierGroups.filter(g => (g.uiId || g.id) !== targetGroupUiId);
      return { ...prev, modifierGroups: filtered };
    });
    if (selectedGroupUiId === targetGroupUiId) {
      handleCancelEditGroup();
    }
  };

  const fetchSectors = React.useCallback(() => {
    const token = localStorage.getItem('token');
    return fetch('http://localhost:5121/api/stocksectors', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao carregar setores.");
        return res.json();
      })
      .then(data => {
        setSectorsList(data);
        return data;
      })
      .catch(console.error);
  }, []);

  const handleSaveSector = async () => {
    if (!sectorName.trim()) {
      setError("O nome do setor é obrigatório.");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const payload = {
        name: sectorName.trim(),
        description: sectorDescription.trim()
      };
      const url = editingSectorId
        ? `http://localhost:5121/api/stocksectors/${editingSectorId}`
        : 'http://localhost:5121/api/stocksectors';
      const method = editingSectorId ? 'PUT' : 'POST';

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

      setSuccessMessage(editingSectorId ? "Setor atualizado com sucesso!" : "Setor cadastrado com sucesso!");
      setSectorName('');
      setSectorDescription('');
      setEditingSectorId(null);
      fetchSectors();
    } catch (err: any) {
      setError("Erro ao salvar setor: " + err.message);
    }
  };

  const handleEditSector = (sector: any) => {
    setEditingSectorId(sector.id);
    setSectorName(sector.name);
    setSectorDescription(sector.description || '');
  };

  const handleDeleteSector = async (sectorId: string, sectorName: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o setor "${sectorName}"?`)) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5121/api/stocksectors/${sectorId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      setSuccessMessage("Setor excluído com sucesso!");
      if (editingSectorId === sectorId) {
        setEditingSectorId(null);
        setSectorName('');
        setSectorDescription('');
      }
      fetchSectors();
    } catch (err: any) {
      setError("Erro ao excluir setor: " + err.message);
    }
  };

  const handleAddPromotion = () => {
    if (!promoPreco.trim()) {
      setError("O preço promocional é obrigatório.");
      return;
    }
    const newPromo = {
      id: editingPromoId || undefined,
      uiId: editingPromoUiId || Math.random().toString(36).substr(2, 9),
      dayStart: promoDiaInicio,
      hourStart: promoHoraInicio,
      dayEnd: promoDiaFim,
      hourEnd: promoHoraFim,
      price: promoPreco,
      isSaleForbidden: promoProibirVenda
    };

    setFormData(prev => {
      let updatedPromos = [...prev.promotions];
      if (editingPromoUiId || editingPromoId) {
        updatedPromos = updatedPromos.map(p => {
          const isMatch = editingPromoId ? p.id === editingPromoId : p.uiId === editingPromoUiId;
          return isMatch ? newPromo : p;
        });
      } else {
        updatedPromos.push(newPromo);
      }
      return { ...prev, promotions: updatedPromos };
    });

    setPromoDiaInicio('Segunda-feira');
    setPromoHoraInicio(0);
    setPromoDiaFim('Segunda-feira');
    setPromoHoraFim(0);
    setPromoPreco('');
    setPromoProibirVenda(false);
    setEditingPromoId(null);
    setEditingPromoUiId(null);
  };

  const handleEditPromotion = (promo: any) => {
    setEditingPromoId(promo.id || null);
    setEditingPromoUiId(promo.uiId || null);
    setPromoDiaInicio(promo.dayStart);
    setPromoHoraInicio(promo.hourStart);
    setPromoDiaFim(promo.dayEnd);
    setPromoHoraFim(promo.hourEnd);
    setPromoPreco(promo.price);
    setPromoProibirVenda(promo.isSaleForbidden);
  };

  const handleDeletePromotion = (promo: any) => {
    if (!window.confirm("Tem certeza que deseja excluir esta promoção?")) return;
    setFormData(prev => {
      const filtered = prev.promotions.filter(p => {
        if (promo.id) return p.id !== promo.id;
        return p.uiId !== promo.uiId;
      });
      return { ...prev, promotions: filtered };
    });

    if (editingPromoId === promo.id || editingPromoUiId === promo.uiId) {
      setPromoDiaInicio('Segunda-feira');
      setPromoHoraInicio(0);
      setPromoDiaFim('Segunda-feira');
      setPromoHoraFim(0);
      setPromoPreco('');
      setPromoProibirVenda(false);
      setEditingPromoId(null);
      setEditingPromoUiId(null);
    }
  };

  if (false as boolean) {
    console.log(
      sectorsList,
      handleSaveSector,
      handleEditSector,
      handleDeleteSector,
      handleAddPromotion,
      handleEditPromotion,
      handleDeletePromotion
    );
  }

  const fetchProducts = React.useCallback(() => {
    const token = localStorage.getItem('token');
    return fetch('http://localhost:5121/api/products', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setProductsList(data);
        return data;
      })
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

    fetchSectors();

    fetchProducts().then(data => {
      if (data) {
        setFormData(prev => ({
          ...prev,
          code: getNextProductCode(data)
        }));
      }
    });
  }, [fetchProducts, fetchSectors]);

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
          const unit = matchedProd ? matchedProd.unit : 'UN';
          const qtyStr = (unit === 'KG' || unit === 'LT')
            ? formatQuantityDecimal((i.quantity * 1000).toFixed(0))
            : i.quantity?.toString() || '0';
          return {
            ingredientProductId: i.ingredientProductId,
            quantity: qtyStr,
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
          id: mg.id,
          name: mg.name,
          minSelections: mg.minSelections,
          maxSelections: mg.maxSelections,
          priceRule: mg.priceRule,
          isPropType: mg.isPropType || false,
          canBeFractioned: mg.canBeFractioned || false,
          options: mg.options?.map((o: any) => ({
            id: o.id,
            name: o.name,
            additionalPrice: o.additionalPrice ? formatCurrency((o.additionalPrice * 100).toFixed(0)) : '0,00',
            basePrice: o.basePrice ? formatCurrency((o.basePrice * 100).toFixed(0)) : '0,00',
            totalPrice: o.totalPrice ? formatCurrency((o.totalPrice * 100).toFixed(0)) : '0,00',
            minQuantity: o.minQuantity || 0,
            maxQuantity: o.maxQuantity,
            productId: o.productId || '',
            isPreSelected: o.isPreSelected || false,
            isVisible: o.isVisible !== false,
            abbreviation: o.abbreviation || '',
            parentOptionId: o.parentOptionId || ''
          })) || []
        })) || [],
        preparationTime: prod.preparationTime ?? 0,
        controlStock: prod.controlStock ?? false,
        stockSectorId: prod.stockSectorId || '',
        minStock: prod.minStock ?? 0,
        maxStock: prod.maxStock ?? 0,
        stockContent: prod.stockContent ?? 0,
        isDivisible: prod.isDivisible ?? false,
        isPerishable: prod.isPerishable ?? false,
        isAutoWeight: prod.isAutoWeight ?? false,
        promotions: prod.promotions?.map((promo: any) => ({
          id: promo.id,
          dayStart: promo.dayStart || 'Segunda-feira',
          hourStart: promo.hourStart ?? 0,
          dayEnd: promo.dayEnd || 'Segunda-feira',
          hourEnd: promo.hourEnd ?? 0,
          price: promo.price ? formatCurrency((promo.price * 100).toFixed(0)) : '',
          isSaleForbidden: promo.isSaleForbidden ?? false
        })) || []
      });
      setSelectedGroupUiId(null);
      setIsEditingGroup(false);
      setGroupName('');
      setGroupCanBeFractioned(false);
      setGroupPriceRule(1);
      setGroupMinSelections(1);
      setGroupMaxSelections(1);
      setActiveTab('geral');
    } catch (err: any) {
      setError("Erro ao carregar produto para edição: " + err.message);
    }
  };

  const handleNewProduct = (listOverride?: any[]) => {
    setEditingId(null);
    setActiveTab('geral');
    const currentList = listOverride || productsList;
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
      code: getNextProductCode(currentList),
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
      modifierGroups: [],
      preparationTime: 0,
      controlStock: false,
      stockSectorId: '',
      minStock: 0,
      maxStock: 0,
      stockContent: 0,
      isDivisible: false,
      isPerishable: false,
      isAutoWeight: false,
      promotions: []
    });
    setSelectedGroupUiId(null);
    setIsEditingGroup(false);
    setGroupName('');
    setGroupCanBeFractioned(false);
    setGroupPriceRule(1);
    setGroupMinSelections(1);
    setGroupMaxSelections(1);
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
      fetchProducts().then(data => {
        if (editingId === id) {
          handleNewProduct(data);
        }
      });
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
        stockSectorId: formData.stockSectorId ? formData.stockSectorId : null,
        basePrice: parseCurrencyToFloat(formData.basePrice),
        costPrice: parseCurrencyToFloat(formData.costPrice),
        prices: formData.prices.map(p => ({
          channel: p.channel,
          price: parseCurrencyToFloat(p.price),
          isVisible: p.isVisible
        })),
        ingredients: formData.ingredients.map(i => ({
          ingredientProductId: i.ingredientProductId,
          quantity: parseCurrencyToFloat(i.quantity),
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
          id: g.id || (g.uiId && g.uiId.includes('-') ? g.uiId : null),
          name: g.name,
          minSelections: g.minSelections,
          maxSelections: g.maxSelections,
          priceRule: g.priceRule,
          sequence: 0,
          isPropType: g.isPropType,
          canBeFractioned: g.canBeFractioned,
          options: g.options.map((o, idx) => ({
            id: o.id || null,
            name: o.name,
            additionalPrice: parseCurrencyToFloat(o.additionalPrice) || 0,
            basePrice: parseCurrencyToFloat(o.basePrice) || 0,
            totalPrice: parseCurrencyToFloat(o.totalPrice) || 0,
            minQuantity: o.minQuantity,
            maxQuantity: o.maxQuantity,
            sequence: idx,
            productId: o.productId || null,
            isPreSelected: o.isPreSelected,
            isVisible: o.isVisible,
            abbreviation: o.abbreviation || '',
            parentOptionId: o.parentOptionId || null
          }))
        })),
        preparationTime: parseInt(formData.preparationTime?.toString() || '0', 10),
        minStock: parseFloat(formData.minStock?.toString() || '0'),
        maxStock: parseFloat(formData.maxStock?.toString() || '0'),
        stockContent: parseFloat(formData.stockContent?.toString() || '0'),
        promotions: formData.promotions.map(promo => ({
          id: promo.id || null,
          dayStart: promo.dayStart,
          hourStart: parseInt(promo.hourStart?.toString() || '0', 10),
          dayEnd: promo.dayEnd,
          hourEnd: parseInt(promo.hourEnd?.toString() || '0', 10),
          price: parseCurrencyToFloat(promo.price),
          isSaleForbidden: promo.isSaleForbidden
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
      fetchProducts().then(data => {
        handleNewProduct(data);
      });
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
    { id: 'pacotes', label: 'Pacotes', icon: Layers },
    { id: 'estoque', label: 'Estoque', icon: Package },
    { id: 'promocao', label: 'Promoções', icon: Tag }
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
            <button className="prod-btn prod-btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => handleNewProduct()} title="Atalho: F2">
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
            {tabs.map(tab => {
              const isTabDisabled = (tabId: string) => {
                if (formData.type === undefined) return false;
                if (tabId === 'composicao' && formData.type !== 1) return true;
                if (tabId === 'pacotes' && formData.type !== 2) return true;
                if (tabId === 'estoque' && formData.type !== 0) return true;
                return false;
              };
              const disabled = isTabDisabled(tab.id);
              return (
                <button
                  key={tab.id}
                  className={`prod-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => {
                    if (!disabled) {
                      setActiveTab(tab.id);
                    }
                  }}
                  disabled={disabled}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    opacity: disabled ? 0.35 : 1,
                    cursor: disabled ? 'not-allowed' : 'pointer'
                  }}
                  title={disabled ? "Esta aba está desativada para o tipo de produto selecionado." : ""}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="prod-tab-content">
            {activeTab === 'geral' && (
              <div className="prod-tab-section animate-fade-in" style={{ display: 'flex', gap: '1.5rem', width: '100%' }}>
                
                {/* Coluna Esquerda - Imagem e Status (Checkboxes) */}
                <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '1.25rem', flexShrink: 0 }}>
                  
                  {/* Imagem do Produto */}
                  <div className="prod-form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
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

                  {/* Checkboxes empilhadas verticalmente abaixo da imagem */}
                  <div className="prod-form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start', marginTop: '0.25rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0, userSelect: 'none' }}>
                      <input
                        type="checkbox"
                        checked={formData.isFractionable}
                        onChange={e => setFormData({ ...formData, isFractionable: e.target.checked })}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                      />
                      Venda Fracionada
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0, userSelect: 'none' }}>
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                      />
                      Produto Ativo
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0, userSelect: 'none' }}>
                      <input
                        type="checkbox"
                        checked={formData.isVisible}
                        onChange={e => setFormData({ ...formData, isVisible: e.target.checked })}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                      />
                      Produto Visível
                    </label>
                  </div>

                </div>

                {/* Coluna Direita - Formulário de Dados */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  {/* Nome do Produto */}
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

                  {/* Tipo de Produto e Categoria lado a lado */}
                  <div className="prod-form-group">
                    <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                      <div style={{ flex: 1 }}>
                        <label>Tipo do Produto *</label>
                        <select
                          value={formData.type}
                          onChange={e => {
                            const newType = parseInt(e.target.value, 10) || 0;
                            setFormData(prev => ({ ...prev, type: newType }));
                            setActiveTab('geral');
                          }}
                          className="prod-select"
                          style={{ height: '36px', padding: '0 0.5rem' }}
                        >
                          <option value={0}>Estoque</option>
                          <option value={1}>Composição</option>
                          <option value={2}>Pacote</option>
                        </select>
                      </div>
                      <div style={{ flex: 1.2 }}>
                        <label>Categoria *</label>
                        <select
                          value={formData.categoryId}
                          onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                          className="prod-select"
                          style={{ height: '36px', padding: '0 0.5rem' }}
                        >
                          <option value="">Selecione...</option>
                          {categories.map(c => (
                            <option key={c.id} value={c.id}>
                              {c.parentCategoryId ? `  ↳ ${c.name}` : c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Preço Base, Código e Abreviação lado a lado */}
                  <div className="prod-form-group">
                    <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                      <div style={{ flex: 1 }}>
                        <label>Preço Base (R$)</label>
                        <input
                          type="text"
                          value={formData.basePrice}
                          onChange={e => setFormData({ ...formData, basePrice: formatCurrency(e.target.value) })}
                          placeholder="0,00"
                          className="prod-input"
                          style={{ height: '36px', padding: '0 0.75rem' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label>Código do Produto</label>
                        <input
                          type="text"
                          value={formData.code}
                          onChange={e => setFormData({ ...formData, code: e.target.value })}
                          placeholder="Ex: 001"
                          className="prod-input"
                          style={{ height: '36px', padding: '0 0.75rem' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label>Abreviação</label>
                        <input
                          type="text"
                          value={formData.abbreviation}
                          onChange={e => setFormData({ ...formData, abbreviation: e.target.value })}
                          placeholder="Ex: Hambúrguer"
                          className="prod-input"
                          style={{ height: '36px', padding: '0 0.75rem' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Unidade, Impressão e Tempo de Preparo lado a lado */}
                  <div className="prod-form-group">
                    <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                      <div style={{ flex: 1 }}>
                        <label>Unidade</label>
                        <select
                          value={formData.unit}
                          onChange={e => setFormData({ ...formData, unit: e.target.value })}
                          className="prod-select"
                          style={{ height: '36px', padding: '0 0.5rem' }}
                        >
                          <option value="UN">UN</option>
                          <option value="KG">KG</option>
                          <option value="LT">LT</option>
                          <option value="ML">ML</option>
                          <option value="G">G</option>
                        </select>
                      </div>
                      <div style={{ flex: 1.5 }}>
                        <label>Impressão</label>
                        <select
                          value={formData.printTarget}
                          onChange={e => setFormData({ ...formData, printTarget: e.target.value })}
                          className="prod-select"
                          style={{ height: '36px', padding: '0 0.5rem' }}
                        >
                          <option value="">Sem Impressão</option>
                          <option value="Cozinha">Cozinha</option>
                          <option value="Bar">Bar</option>
                          <option value="Balcão">Balcão</option>
                          <option value="Copa">Copa</option>
                        </select>
                      </div>
                      <div style={{ flex: 1 }}>
                        <label>Preparo (min)</label>
                        <input
                          type="number"
                          value={formData.preparationTime || ''}
                          onChange={e => setFormData({ ...formData, preparationTime: parseInt(e.target.value) || 0 })}
                          placeholder="Ex: 15"
                          className="prod-input"
                          style={{ height: '36px', padding: '0 0.75rem' }}
                          min="0"
                        />
                      </div>
                    </div>
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
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Selecione o item do product</span>
                      <select
                        value={selectedIngredientId}
                        onChange={e => {
                          const id = e.target.value;
                          setSelectedIngredientId(id);
                          const matched = productsList.find(p => p.id === id);
                          const unit = matched?.unit || 'UN';
                          if (unit === 'KG' || unit === 'LT') {
                            setIngredientQty('0,000');
                          } else {
                            setIngredientQty('1');
                          }
                        }}
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
                          onChange={e => {
                            const unit = productsList.find(p => p.id === selectedIngredientId)?.unit || 'UN';
                            if (unit === 'KG' || unit === 'LT') {
                              setIngredientQty(formatQuantityDecimal(e.target.value));
                            } else {
                              setIngredientQty(e.target.value.replace(/\D/g, ''));
                            }
                          }}
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
                                    type="text"
                                    value={ing.quantity}
                                    onChange={(e) => {
                                      let val = e.target.value;
                                      if (unit === 'KG' || unit === 'LT') {
                                        val = formatQuantityDecimal(val);
                                      } else {
                                        val = val.replace(/\D/g, '');
                                      }
                                      const newIngs = [...formData.ingredients];
                                      newIngs[originalIdx].quantity = val;
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
              <div className="prod-tab-section animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* 1. PAINEL SUPERIOR - CONFIGURAÇÃO DE ETAPA (CADASTRO E EDIÇÃO) */}
                <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-strong)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h4 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Layers size={16} style={{ color: 'var(--primary)' }} />
                    {isEditingGroup ? 'Editar Etapa do Pacote' : 'Cadastrar Etapa do Pacote'}
                  </h4>

                  {/* Linha 1 */}
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', width: '100%' }}>
                    {/* Linha 1 Esquerda */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Descrição:</span>
                      <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Ex: Etapa 1: Tamanho, Etapa 2: Sabores, Etapa 3: Bordas..."
                        className="prod-input"
                        style={{ height: '38px', background: 'rgba(0,0,0,0.2)' }}
                      />
                    </div>

                    {/* Linha 1 Direita */}
                    <div style={{ display: 'flex', gap: '1rem', width: '246px' }}>
                      <div style={{ width: '120px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tipo de Seleção:</span>
                        <select
                          value={groupCanBeFractioned ? "fracionado" : "inteiro"}
                          onChange={(e) => setGroupCanBeFractioned(e.target.value === "fracionado")}
                          className="prod-select"
                          style={{ height: '38px', background: 'rgba(0,0,0,0.2)', padding: '0 0.5rem', width: '120px' }}
                        >
                          <option value="inteiro">Inteiro</option>
                          <option value="fracionado">Fracionado</option>
                        </select>
                      </div>

                      <div style={{ width: '110px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Função de Preço:</span>
                        <select
                          value={groupPriceRule}
                          onChange={(e) => setGroupPriceRule(parseInt(e.target.value))}
                          className="prod-select"
                          style={{ height: '38px', background: 'rgba(0,0,0,0.2)', padding: '0 0.5rem', width: '110px' }}
                        >
                          <option value={3}>Mínimo</option>
                          <option value={0}>Média</option>
                          <option value={1}>Máximo</option>
                          <option value={2}>Soma</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Linha 2 */}
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', width: '100%' }}>
                    {/* Linha 2 Esquerda */}
                    <div style={{ flex: 1, display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                      <div style={{ width: '140px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Quantidade Mínima:</span>
                        <input
                          type="number"
                          min="0"
                          value={groupMinSelections}
                          onChange={(e) => setGroupMinSelections(Math.max(0, parseInt(e.target.value) || 0))}
                          className="prod-input"
                          style={{ height: '38px', background: 'rgba(0,0,0,0.2)', width: '140px', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div style={{ width: '140px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Quantidade Máxima:</span>
                        <input
                          type="number"
                          min="1"
                          value={groupMaxSelections}
                          onChange={(e) => setGroupMaxSelections(Math.max(1, parseInt(e.target.value) || 1))}
                          className="prod-input"
                          style={{ height: '38px', background: 'rgba(0,0,0,0.2)', width: '140px', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>

                    {/* Linha 2 Direita */}
                    <div style={{ display: 'flex', gap: '0.5rem', width: '246px', justifyContent: 'flex-end' }}>
                      <button
                        className="prod-btn prod-btn-primary"
                        onClick={(e) => { e.preventDefault(); isEditingGroup ? handleSaveGroup() : handleAddGroup(); }}
                        style={{ background: 'var(--primary)', width: isEditingGroup ? '110px' : '120px', height: '38px', padding: 0 }}
                      >
                        {isEditingGroup ? 'Salvar' : 'Cadastrar'}
                      </button>

                      {isEditingGroup && (
                        <button
                          className="prod-btn prod-btn-secondary"
                          onClick={(e) => { e.preventDefault(); handleCancelEditGroup(); }}
                          style={{ width: '110px', height: '38px', padding: 0 }}
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>

                </div>

                {/* 2. TABELA CENTRAL - LISTAGEM DE ETAPAS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Etapas Cadastradas (Clique simples para selecionar | Duplo clique para editar):</span>
                  <div style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden', background: 'var(--bg-primary)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                      <thead style={{ background: '#1e293b', borderBottom: '1px solid var(--border-strong)' }}>
                        <tr>
                          <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Descrição</th>
                          <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, width: '100px', textAlign: 'center' }}>Múltiplo</th>
                          <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, width: '140px' }}>Tipo de Seleção</th>
                          <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, width: '120px' }}>Função</th>
                          <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, width: '80px', textAlign: 'center' }}>Mínimo</th>
                          <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, width: '80px', textAlign: 'center' }}>Máximo</th>
                          <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, width: '90px', textAlign: 'center' }}>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.modifierGroups.length === 0 && (
                          <tr>
                            <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                              Nenhuma etapa cadastrada. Preencha os campos acima para cadastrar a primeira etapa.
                            </td>
                          </tr>
                        )}
                        {formData.modifierGroups.map((group) => {
                          const uiId = group.uiId || group.id || '';
                          const isSelected = selectedGroupUiId === uiId;
                          
                          let pricingText = 'Média';
                          if (group.priceRule === 1) pricingText = 'Máximo';
                          else if (group.priceRule === 2) pricingText = 'Soma';
                          else if (group.priceRule === 3) pricingText = 'Mínimo';

                          return (
                            <tr
                              key={uiId}
                              onClick={() => handleSelectGroup(uiId)}
                              onDoubleClick={() => handleStartEditGroup(group)}
                              style={{
                                cursor: 'pointer',
                                background: isSelected ? 'rgba(249, 115, 22, 0.08)' : 'transparent',
                                borderBottom: '1px solid var(--border-subtle)',
                                borderLeft: isSelected ? '3px solid #f97316' : '3px solid transparent',
                                transition: 'all var(--transition-fast)',
                                fontWeight: isSelected ? '600' : 'normal',
                                color: isSelected ? '#f97316' : 'var(--text-primary)'
                              }}
                              className="package-row-hover"
                            >
                              <td style={{ padding: '0.6rem 0.75rem' }}>{group.name}</td>
                              <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>
                                {group.maxSelections > 1 ? (
                                  <span style={{ color: '#10b981', fontWeight: 600 }}>Sim</span>
                                ) : 'Não'}
                              </td>
                              <td style={{ padding: '0.6rem 0.75rem' }}>
                                {group.canBeFractioned ? 'Fracionada' : 'Inteira'}
                              </td>
                              <td style={{ padding: '0.6rem 0.75rem' }}>{pricingText}</td>
                              <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>{group.minSelections}</td>
                              <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>{group.maxSelections}</td>
                              <td style={{ padding: '0.25rem 0.75rem', textAlign: 'center', verticalAlign: 'middle' }} onClick={(e) => e.stopPropagation()}>
                                <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center', alignItems: 'center' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleStartEditGroup(group)}
                                    className="action-btn edit-btn"
                                    title="Editar Etapa"
                                    style={{ width: '24px', height: '24px', padding: 0 }}
                                  >
                                    <Pencil size={10} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteGroup(group)}
                                    className="action-btn delete-btn"
                                    title="Excluir Etapa"
                                    style={{ width: '24px', height: '24px', padding: 0 }}
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3. PAINEL INFERIOR - ITENS/OPÇÕES DA ETAPA SELECIONADA */}
                {(() => {
                  const selectedGroup = formData.modifierGroups.find(g => (g.uiId || g.id) === selectedGroupUiId);
                  const selectedIdx = formData.modifierGroups.findIndex(g => (g.uiId || g.id) === selectedGroupUiId);

                  if (!selectedGroup) {
                    return (
                      <div style={{ flex: 1, padding: '2.5rem', textAlign: 'center', background: 'rgba(15, 23, 42, 0.2)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <Layers size={28} style={{ color: 'var(--text-muted)' }} />
                        <h5 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '0.9rem' }}>Nenhuma etapa selecionada</h5>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Selecione uma etapa na lista acima para gerenciar e configurar seus itens e opções.</p>
                      </div>
                    );
                  }

                  // Função auxiliar para pegar opções qualificadas das etapas anteriores
                  const getParentOptionsForGroup = (currentIdx: number) => {
                    const list: Array<{ id: string; name: string; groupName: string }> = [];
                    for (let i = 0; i < currentIdx; i++) {
                      const prevGroup = formData.modifierGroups[i];
                      prevGroup.options.forEach(opt => {
                        const optId = opt.id || opt.productId || opt.name;
                        list.push({
                          id: optId,
                          name: opt.name,
                          groupName: prevGroup.name || `Etapa ${i + 1}`
                        });
                      });
                    }
                    return list;
                  };

                  const parentOptions = getParentOptionsForGroup(selectedIdx);

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1, minHeight: '350px' }}>
                      
                      {/* PAINEL INFERIOR - CADASTRO/EDIÇÃO DE OPÇÕES */}
                      <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-strong)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h4 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Layers size={16} style={{ color: '#f97316' }} />
                          {isEditingOption ? `Editar Item da Etapa: ${selectedGroup.name}` : `Cadastrar Item na Etapa: ${selectedGroup.name}`}
                        </h4>

                        {/* Linha 1 */}
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', width: '100%' }}>
                          {/* Linha 1 Esquerda (Tipo e Nome do Item) */}
                          <div style={{ flex: 1, display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                            <div style={{ width: '130px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tipo de Item:</span>
                              <select
                                value={optType}
                                onChange={(e) => {
                                  setOptType(e.target.value as 'prod' | 'prop');
                                  handleCancelEditOption();
                                }}
                                disabled={selectedGroup.options.length > 0}
                                className="prod-select"
                                style={{ height: '36px', background: 'rgba(0,0,0,0.2)', padding: '0 0.75rem', width: '130px' }}
                              >
                                <option value="prop">Propriedade</option>
                                <option value="prod">Produto</option>
                              </select>
                            </div>

                            {/* Campo Condicional baseia-se em optType */}
                            {optType === 'prod' ? (
                              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem', position: 'relative' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Produto:</span>
                                <div style={{ position: 'relative', width: '100%' }}>
                                  <input
                                    type="text"
                                    value={optProductNameInput}
                                    onChange={(e) => {
                                      setOptProductNameInput(e.target.value);
                                      setShowProductSuggestions(true);
                                    }}
                                    onFocus={() => setShowProductSuggestions(true)}
                                    placeholder="Digite para buscar produto..."
                                    className="prod-input"
                                    style={{ height: '36px', padding: '0 2.2rem 0 0.75rem', background: 'rgba(0,0,0,0.2)', width: '100%', boxSizing: 'border-box' }}
                                  />
                                  <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                                    <div className="prod-tooltip-container">
                                      <Search size={16} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
                                      <span className="prod-tooltip" style={{ bottom: '125%', right: '0', left: 'auto', transform: 'none', width: '220px' }}>Procurar produto com dados informados</span>
                                    </div>
                                  </div>
                                  
                                  {/* Lista suspensa de sugestões */}
                                  {showProductSuggestions && optProductNameInput.trim() && (
                                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', zIndex: 1000, maxHeight: '200px', overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                                      {productsList
                                        .filter(p => p.name.toLowerCase().includes(optProductNameInput.toLowerCase()))
                                        .map(p => (
                                          <div
                                            key={p.id}
                                            onClick={() => {
                                              setOptProductId(p.id);
                                              setOptProductNameInput(p.name);
                                              setShowProductSuggestions(false);
                                            }}
                                            style={{ padding: '0.5rem 0.75rem', cursor: 'pointer', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}
                                            className="package-row-hover"
                                          >
                                            {p.name}
                                          </div>
                                        ))
                                      }
                                      {productsList.filter(p => p.name.toLowerCase().includes(optProductNameInput.toLowerCase())).length === 0 && (
                                        <div style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Nenhum produto encontrado.</div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Propriedade:</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                                  <select
                                    value={optPropName}
                                    onChange={(e) => {
                                      const selectedVal = e.target.value;
                                      setOptPropName(selectedVal);
                                      const matchedProp = customProperties.find(p => p.name === selectedVal);
                                      if (matchedProp && !optAbbreviation) {
                                        setOptAbbreviation(matchedProp.abbreviation);
                                      }
                                    }}
                                    className="prod-select"
                                    style={{ height: '36px', background: 'rgba(0,0,0,0.2)', padding: '0 0.75rem', flex: 1 }}
                                  >
                                    <option value="">Selecione...</option>
                                    {customProperties.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                                  </select>
                                  
                                  {/* Botão de + com tooltip */}
                                  <div className="prod-tooltip-container">
                                    <div
                                      onClick={() => {
                                        setIsPropertyModalOpen(true);
                                      }}
                                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary)', color: 'white', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer' }}
                                    >
                                      <Plus size={14} />
                                    </div>
                                    <span className="prod-tooltip" style={{ bottom: '125%', right: '0', left: 'auto', transform: 'none', width: '120px' }}>Clique para cadastrar</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Linha 1 Direita (Preços e Quantidades) */}
                          <div style={{ display: 'flex', gap: '1rem', width: '368px' }}>
                            <div style={{ width: '80px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Preço Base:</span>
                              <input
                                type="text"
                                value={optBasePrice}
                                onChange={(e) => setOptBasePrice(formatCurrency(e.target.value))}
                                className="prod-input"
                                style={{ height: '36px', padding: '0 0.5rem', background: 'rgba(0,0,0,0.2)', textAlign: 'right', fontSize: '0.85rem' }}
                              />
                            </div>

                            <div style={{ width: '80px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total:</span>
                              <input
                                type="text"
                                value={optTotalPrice}
                                onChange={(e) => setOptTotalPrice(formatCurrency(e.target.value))}
                                className="prod-input"
                                style={{ height: '36px', padding: '0 0.5rem', background: 'rgba(0,0,0,0.2)', textAlign: 'right', fontSize: '0.85rem' }}
                              />
                            </div>

                            <div style={{ width: '80px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Qtd. Mínima:</span>
                              <input
                                type="number"
                                min="0"
                                value={optMinQuantity}
                                onChange={(e) => setOptMinQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                                className="prod-input"
                                style={{ height: '36px', padding: '0 0.5rem', background: 'rgba(0,0,0,0.2)', width: '80px', boxSizing: 'border-box', fontSize: '0.85rem' }}
                              />
                            </div>

                            <div style={{ width: '80px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Qtd. Máxima:</span>
                              <input
                                type="number"
                                min="1"
                                value={optMaxQuantity}
                                onChange={(e) => setOptMaxQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                className="prod-input"
                                style={{ height: '36px', padding: '0 0.5rem', background: 'rgba(0,0,0,0.2)', width: '80px', boxSizing: 'border-box', fontSize: '0.85rem' }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Linha 2 */}
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', width: '100%' }}>
                          {/* Linha 2 Esquerda (Abreviação, Associação) */}
                          <div style={{ flex: 1, display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                            {/* Abreviação */}
                            <div style={{ width: '130px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Abreviação:</span>
                              <input
                                type="text"
                                value={optAbbreviation}
                                onChange={(e) => setOptAbbreviation(e.target.value)}
                                placeholder="Ex: PEQ"
                                className="prod-input"
                                style={{ height: '36px', padding: '0 0.75rem', background: 'rgba(0,0,0,0.2)', width: '130px', boxSizing: 'border-box' }}
                              />
                            </div>

                            {/* Associação (Etapa anterior) */}
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>Associação (Etapa anterior):</span>
                              <select
                                value={optParentOptionId}
                                onChange={(e) => setOptParentOptionId(e.target.value)}
                                className="prod-select"
                                style={{ height: '36px', padding: '0 0.75rem', background: 'rgba(0,0,0,0.2)', width: '100%' }}
                              >
                                <option value="">Sem Associação (Disponível sempre)</option>
                                {parentOptions.map(po => <option key={po.id} value={po.id}>{po.groupName} → {po.name}</option>)}
                              </select>
                            </div>
                          </div>

                          {/* Linha 2 Direita (Checkboxes + Botões de Ação) */}
                          <div style={{ display: 'flex', gap: '0.5rem', width: '368px', justifyContent: 'flex-end', alignItems: 'center', height: '36px' }}>
                            {/* Checkboxes */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', userSelect: 'none', marginRight: 'auto' }}>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--text-primary)', margin: 0, whiteSpace: 'nowrap' }}>
                                <input
                                  type="checkbox"
                                  checked={optIsPreSelected}
                                  onChange={(e) => setOptIsPreSelected(e.target.checked)}
                                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                                />
                                Selecionado
                              </label>

                              <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--text-primary)', margin: 0, whiteSpace: 'nowrap' }}>
                                <input
                                  type="checkbox"
                                  checked={optIsVisible}
                                  onChange={(e) => setOptIsVisible(e.target.checked)}
                                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                                />
                                Visível
                              </label>
                            </div>

                            {/* Botões */}
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button
                                className="prod-btn prod-btn-primary"
                                onClick={(e) => { e.preventDefault(); isEditingOption ? handleSaveOption() : handleAddOption(); }}
                                style={{ background: 'var(--primary)', width: isEditingOption ? '95px' : '110px', height: '36px', padding: 0 }}
                              >
                                {isEditingOption ? 'Salvar' : 'Cadastrar'}
                              </button>

                              {isEditingOption && (
                                <button
                                  className="prod-btn prod-btn-secondary"
                                  onClick={(e) => { e.preventDefault(); handleCancelEditOption(); }}
                                  style={{ width: '95px', height: '36px', padding: 0 }}
                                >
                                  Cancelar
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Lista de Opções da Etapa Selecionada */}
                      <div style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflowX: 'auto', background: 'var(--bg-primary)' }}>
                        <table style={{ width: '100%', minWidth: '1100px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                          <thead style={{ background: '#1e293b', borderBottom: '1px solid var(--border-strong)' }}>
                            <tr>
                              <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Opção (Descrição)</th>
                              <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, width: '90px' }}>Abreviação</th>
                              <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, width: '180px' }}>Associação (Etapa anterior)</th>
                              <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, width: '100px', textAlign: 'center' }}>Selecionado</th>
                              <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, width: '80px', textAlign: 'center' }}>Visível</th>
                              <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, width: '110px', textAlign: 'right' }}>Preço Base</th>
                              <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, width: '110px', textAlign: 'right' }}>Total</th>
                              <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, width: '80px', textAlign: 'center' }}>Mín Qtd</th>
                              <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, width: '80px', textAlign: 'center' }}>Máx Qtd</th>
                              <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, width: '90px', textAlign: 'center', position: 'sticky', right: 0, background: '#1e293b', zIndex: 10 }}>Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedGroup.options.length === 0 && (
                              <tr>
                                <td colSpan={10} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                  Nenhuma opção inserida para esta etapa. Adicione opções acima.
                                </td>
                              </tr>
                            )}
                            {selectedGroup.options.map((opt, optIdx) => {
                              const matchedId = opt.id || (opt as any).uiId || opt.name || '';
                              const isSelected = selectedOptionId === matchedId;

                              let parentLabel = 'Sem Associação';
                              if (opt.parentOptionId) {
                                const po = parentOptions.find(p => p.id === opt.parentOptionId);
                                if (po) parentLabel = `${po.groupName} → ${po.name}`;
                              }

                              return (
                                <tr
                                  key={optIdx}
                                  onClick={() => handleSelectOption(matchedId)}
                                  onDoubleClick={() => handleStartEditOption(opt)}
                                  style={{
                                    cursor: 'pointer',
                                    background: isSelected ? 'rgba(249, 115, 22, 0.08)' : 'transparent',
                                    borderBottom: '1px solid var(--border-subtle)',
                                    borderLeft: isSelected ? '3px solid #f97316' : '3px solid transparent',
                                    transition: 'all var(--transition-fast)',
                                    fontWeight: isSelected ? '600' : 'normal',
                                    color: isSelected ? '#f97316' : 'var(--text-primary)'
                                  }}
                                  className="package-row-hover"
                                >
                                  <td style={{ padding: '0.5rem 0.75rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                      <span>{opt.name}</span>
                                      {opt.productId && (
                                        <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600 }}>
                                          ↳ Vinculado ao produto
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td style={{ padding: '0.5rem 0.75rem' }}>{opt.abbreviation || '-'}</td>
                                  <td style={{ padding: '0.5rem 0.75rem' }}>{parentLabel}</td>
                                  <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>
                                    {opt.isPreSelected ? (
                                      <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Sim</span>
                                    ) : 'Não'}
                                  </td>
                                  <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>
                                    {opt.isVisible !== false ? (
                                      <span style={{ color: '#10b981', fontWeight: 600 }}>Sim</span>
                                    ) : (
                                      <span style={{ color: '#ef4444', fontWeight: 600 }}>Não</span>
                                    )}
                                  </td>
                                  <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right' }}>
                                    R$ {opt.basePrice || '0,00'}
                                  </td>
                                  <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontWeight: 600 }}>
                                    R$ {opt.totalPrice || opt.additionalPrice || '0,00'}
                                  </td>
                                  <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>{opt.minQuantity || 0}</td>
                                  <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>{opt.maxQuantity}</td>
                                  <td style={{ padding: '0.25rem 0.75rem', textAlign: 'center', verticalAlign: 'middle', position: 'sticky', right: 0, background: 'var(--bg-primary)', zIndex: 1 }} onClick={(e) => e.stopPropagation()}>
                                    <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center', alignItems: 'center' }}>
                                      <button
                                        type="button"
                                        onClick={() => handleStartEditOption(opt)}
                                        className="action-btn edit-btn"
                                        title="Editar Opção"
                                        style={{ width: '24px', height: '24px', padding: 0 }}
                                      >
                                        <Pencil size={10} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteOption(opt)}
                                        className="action-btn delete-btn"
                                        title="Excluir Opção"
                                        style={{ width: '24px', height: '24px', padding: 0 }}
                                      >
                                        <Trash2 size={10} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {activeTab === 'estoque' && (
              <div className="prod-tab-section animate-fade-in">
                <div className="prod-form-grid">
                  <div className="prod-form-group" style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0 }}>
                      <input
                        type="checkbox"
                        checked={formData.controlStock}
                        onChange={e => setFormData({ ...formData, controlStock: e.target.checked })}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                      />
                      Controlar estoque
                    </label>
                  </div>

                  <div className="prod-form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Setor de Estoque</label>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <select
                        value={formData.stockSectorId || ''}
                        onChange={e => setFormData({ ...formData, stockSectorId: e.target.value || '' })}
                        className="prod-select"
                        style={{ flex: 1 }}
                      >
                        <option value="">Selecione um setor...</option>
                        {sectorsList.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                      
                      <div className="prod-tooltip-container">
                        <button
                          type="button"
                          onClick={() => setIsSectorModalOpen(true)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '26px',
                            height: '26px',
                            cursor: 'pointer',
                            padding: 0,
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                            transition: 'all 0.2s ease-in-out',
                            outline: 'none'
                          }}
                          className="btn-circular-plus"
                          title="Cadastrar Setor"
                        >
                          <Plus size={16} />
                        </button>
                        <span className="prod-tooltip" style={{ bottom: '125%', right: '0', left: 'auto', transform: 'none', width: '120px' }}>Clique para cadastrar</span>
                      </div>
                    </div>
                  </div>

                  <div className="prod-form-group">
                    <label>Quantidade Mínima</label>
                    <input
                      type="number"
                      value={formData.minStock || ''}
                      onChange={e => setFormData({ ...formData, minStock: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                      className="prod-input"
                    />
                  </div>

                  <div className="prod-form-group">
                    <label>Quantidade Máxima</label>
                    <input
                      type="number"
                      value={formData.maxStock || ''}
                      onChange={e => setFormData({ ...formData, maxStock: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                      className="prod-input"
                    />
                  </div>

                  <div className="prod-form-group">
                    <label>Conteúdo</label>
                    <input
                      type="number"
                      value={formData.stockContent || ''}
                      onChange={e => setFormData({ ...formData, stockContent: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                      className="prod-input"
                    />
                  </div>

                  <div className="prod-form-group" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start', marginTop: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0 }}>
                      <input
                        type="checkbox"
                        checked={formData.isDivisible}
                        onChange={e => setFormData({ ...formData, isDivisible: e.target.checked })}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                      />
                      Divisível
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0 }}>
                      <input
                        type="checkbox"
                        checked={formData.isPerishable}
                        onChange={e => setFormData({ ...formData, isPerishable: e.target.checked })}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                      />
                      Perecível
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0 }}>
                      <input
                        type="checkbox"
                        checked={formData.isAutoWeight}
                        onChange={e => setFormData({ ...formData, isAutoWeight: e.target.checked })}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                      />
                      Peso automático
                    </label>
                  </div>

                  <div className="prod-form-group" style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                    <button
                      type="button"
                      className="prod-btn"
                      disabled
                      style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)', cursor: 'not-allowed', width: '200px' }}
                    >
                      Estoque (Entrada)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'promocao' && (
              <div className="prod-tab-section animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <h3 className="prod-section-title" style={{ margin: 0 }}>Gerenciamento de Promoções</h3>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div><strong>Produto:</strong> <span style={{ color: 'var(--text-primary)' }}>{formData.name || '(Sem nome definido)'}</span></div>
                    <div><strong>Preço normal:</strong> <span style={{ color: 'var(--primary)', fontWeight: 600 }}>R$ {formData.basePrice || '0,00'}</span></div>
                  </div>
                </div>

                {/* Form de Promoção */}
                <div style={{ background: 'rgba(30, 41, 59, 0.3)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', width: '100%', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1.8, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Do dia</span>
                      <select
                        value={promoDiaInicio}
                        onChange={e => setPromoDiaInicio(e.target.value)}
                        className="prod-select"
                        style={{ height: '38px', padding: '0 2.2rem 0 0.75rem', fontSize: '0.85rem', textOverflow: 'ellipsis' }}
                      >
                        <option value="Segunda-feira">Segunda-feira</option>
                        <option value="Terça-feira">Terça-feira</option>
                        <option value="Quarta-feira">Quarta-feira</option>
                        <option value="Quinta-feira">Quinta-feira</option>
                        <option value="Sexta-feira">Sexta-feira</option>
                        <option value="Sábado">Sábado</option>
                        <option value="Domingo">Domingo</option>
                        <option value="Todos os dias">Todos os dias</option>
                      </select>
                    </div>

                    <div style={{ flex: 1, minWidth: '80px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Às (Hora)</span>
                      <input
                        type="number"
                        min="0"
                        max="23"
                        value={promoHoraInicio}
                        onChange={e => setPromoHoraInicio(Math.min(23, Math.max(0, parseInt(e.target.value) || 0)))}
                        className="prod-input"
                        style={{ height: '38px' }}
                        placeholder="14"
                      />
                    </div>

                    <div style={{ flex: 1.8, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Até o dia</span>
                      <select
                        value={promoDiaFim}
                        onChange={e => setPromoDiaFim(e.target.value)}
                        className="prod-select"
                        style={{ height: '38px', padding: '0 2.2rem 0 0.75rem', fontSize: '0.85rem', textOverflow: 'ellipsis' }}
                      >
                        <option value="Segunda-feira">Segunda-feira</option>
                        <option value="Terça-feira">Terça-feira</option>
                        <option value="Quarta-feira">Quarta-feira</option>
                        <option value="Quinta-feira">Quinta-feira</option>
                        <option value="Sexta-feira">Sexta-feira</option>
                        <option value="Sábado">Sábado</option>
                        <option value="Domingo">Domingo</option>
                        <option value="Todos os dias">Todos os dias</option>
                      </select>
                    </div>

                    <div style={{ flex: 1, minWidth: '80px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Às (Hora)</span>
                      <input
                        type="number"
                        min="0"
                        max="23"
                        value={promoHoraFim}
                        onChange={e => setPromoHoraFim(Math.min(23, Math.max(0, parseInt(e.target.value) || 0)))}
                        className="prod-input"
                        style={{ height: '38px' }}
                        placeholder="18"
                      />
                    </div>

                    <div style={{ flex: 1.2, minWidth: '100px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Preço (R$)</span>
                      <input
                        type="text"
                        value={promoPreco}
                        onChange={e => setPromoPreco(formatCurrency(e.target.value))}
                        className="prod-input"
                        style={{ height: '38px', textAlign: 'right' }}
                        placeholder="0,00"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0 }}>
                      <input
                        type="checkbox"
                        checked={promoProibirVenda}
                        onChange={e => setPromoProibirVenda(e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                      />
                      Proibir a venda neste período
                    </label>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={handleAddPromotion}
                        className="prod-btn prod-btn-primary"
                      >
                        {editingPromoUiId || editingPromoId ? 'Salvar' : 'Cadastrar'}
                      </button>
                      {(editingPromoUiId || editingPromoId) && (
                        <button
                          type="button"
                          onClick={() => {
                            setPromoDiaInicio('Segunda-feira');
                            setPromoHoraInicio(0);
                            setPromoDiaFim('Segunda-feira');
                            setPromoHoraFim(0);
                            setPromoPreco('');
                            setPromoProibirVenda(false);
                            setEditingPromoId(null);
                            setEditingPromoUiId(null);
                          }}
                          className="prod-btn prod-btn-secondary"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tabela de Promoções */}
                <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(15, 23, 42, 0.4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead style={{ background: 'rgba(30, 41, 59, 0.8)', borderBottom: '1px solid var(--border-strong)' }}>
                      <tr>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>De (Dia)</th>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600, width: '90px' }}>Às (Hora)</th>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Até (Dia)</th>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600, width: '90px' }}>Às (Hora)</th>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'right', width: '110px' }}>Preço</th>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'center', width: '110px' }}>Proibir Venda</th>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600, width: '100px', textAlign: 'center' }}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.promotions.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            Nenhuma promoção cadastrada para este produto.
                          </td>
                        </tr>
                      ) : (
                        formData.promotions.map((p, idx) => (
                          <tr key={p.id || p.uiId || idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <td style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}>{p.dayStart}</td>
                            <td style={{ padding: '0.75rem 1rem' }}>{p.hourStart}:00h</td>
                            <td style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}>{p.dayEnd}</td>
                            <td style={{ padding: '0.75rem 1rem' }}>{p.hourEnd}:00h</td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: 'var(--primary)', fontWeight: 600 }}>R$ {p.price}</td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                              {p.isSaleForbidden ? (
                                <span style={{ color: '#ef4444', fontWeight: 600 }}>Sim</span>
                              ) : 'Não'}
                            </td>
                            <td style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                              <button
                                type="button"
                                onClick={() => handleEditPromotion(p)}
                                className="action-btn edit-btn"
                                title="Editar"
                                style={{ width: '28px', height: '28px' }}
                              >
                                <Pencil size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePromotion(p)}
                                className="action-btn delete-btn"
                                title="Excluir"
                                style={{ width: '28px', height: '28px' }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
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
    <>
      {isWindowMode ? (
        cardBody
      ) : (
        <div className="prod-modal-overlay animate-fade-in" onClick={onClose}>
          {cardBody}
        </div>
      )}

      {/* Modal de Cadastro de Propriedades */}
      {isPropertyModalOpen && (
        <div className="prod-modal-overlay animate-fade-in" style={{ zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setIsPropertyModalOpen(false)}>
          <div 
            className="prod-modal-card" 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              width: '520px', 
              maxWidth: '95%', 
              background: 'var(--bg-surface)', 
              border: '1px solid var(--border-strong)', 
              borderRadius: 'var(--radius-lg)', 
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Cabeçalho */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface-hover)' }}>
              <h3 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={16} style={{ color: 'var(--primary)' }} />
                Cadastro de Propriedades
              </h3>
              <button 
                onClick={() => setIsPropertyModalOpen(false)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Conteúdo */}
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Inputs na mesma linha */}
              <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Nome:</span>
                  <input 
                    type="text" 
                    value={propNameInput}
                    onChange={(e) => setPropNameInput(e.target.value)}
                    placeholder="Ex: Pequeno, Médio, Calabresa..."
                    className="prod-input"
                    style={{ height: '36px', padding: '0 0.75rem', background: 'rgba(0,0,0,0.2)' }}
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Abreviação:</span>
                  <input 
                    type="text" 
                    value={propAbbrevInput}
                    onChange={(e) => setPropAbbrevInput(e.target.value)}
                    placeholder="Ex: PEQ, MED, CAL..."
                    className="prod-input"
                    style={{ height: '36px', padding: '0 0.75rem', background: 'rgba(0,0,0,0.2)' }}
                  />
                </div>
              </div>

              {/* Botões Cadastrar, Editar e Excluir */}
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                <button 
                  className="prod-btn prod-btn-primary" 
                  disabled={!!selectedPropId}
                  style={{ height: '32px', fontSize: '0.8rem', padding: '0 1rem' }}
                  onClick={() => {
                    const nameTrimmed = propNameInput.trim();
                    if (!nameTrimmed) return;
                    if (customProperties.some(p => p.name.toLowerCase() === nameTrimmed.toLowerCase())) {
                      alert("Esta propriedade já está cadastrada.");
                      return;
                    }
                    const newProp = {
                      id: generateGuid(),
                      name: nameTrimmed,
                      abbreviation: propAbbrevInput.trim()
                    };
                    setCustomProperties(prev => [...prev, newProp]);
                    setPropNameInput('');
                    setPropAbbrevInput('');
                  }}
                >
                  Cadastrar
                </button>

                <button 
                  className="prod-btn prod-btn-secondary" 
                  disabled={!selectedPropId}
                  style={{ height: '32px', fontSize: '0.8rem', padding: '0 1rem' }}
                  onClick={() => {
                    if (!selectedPropId) return;
                    const nameTrimmed = propNameInput.trim();
                    if (!nameTrimmed) return;
                    setCustomProperties(prev => prev.map(p => p.id === selectedPropId ? { ...p, name: nameTrimmed, abbreviation: propAbbrevInput.trim() } : p));
                    setSelectedPropId(null);
                    setPropNameInput('');
                    setPropAbbrevInput('');
                  }}
                >
                  Editar (Salvar)
                </button>

                <button 
                  className="prod-btn prod-btn-secondary" 
                  disabled={!selectedPropId}
                  style={{ height: '32px', fontSize: '0.8rem', padding: '0 1rem', color: '#ef4444', borderColor: '#ef4444' }}
                  onClick={() => {
                    if (!selectedPropId) return;
                    const prop = customProperties.find(p => p.id === selectedPropId);
                    if (prop && window.confirm(`Deseja realmente excluir a propriedade "${prop.name}"?`)) {
                      setCustomProperties(prev => prev.filter(p => p.id !== selectedPropId));
                      if (optPropName === prop.name) {
                        setOptPropName('');
                      }
                      setSelectedPropId(null);
                      setPropNameInput('');
                      setPropAbbrevInput('');
                    }
                  }}
                >
                  Excluir
                </button>
              </div>

              {/* Tabela de Propriedades Cadastradas */}
              <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', maxHeight: '180px', overflowY: 'auto', background: 'var(--bg-primary)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                  <thead style={{ background: 'rgba(30, 41, 59, 0.4)', borderBottom: '1px solid var(--border-strong)', position: 'sticky', top: 0, zIndex: 5 }}>
                    <tr>
                      <th style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Nome</th>
                      <th style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Abreviação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customProperties.length === 0 && (
                      <tr>
                        <td colSpan={2} style={{ padding: '1rem 0.75rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          Nenhuma propriedade cadastrada. Use os campos acima para cadastrar.
                        </td>
                      </tr>
                    )}
                    {customProperties.map(p => {
                      const isSelected = selectedPropId === p.id;
                      return (
                        <tr 
                          key={p.id} 
                          onClick={() => {
                            setSelectedPropId(p.id);
                            setPropNameInput(p.name);
                            setPropAbbrevInput(p.abbreviation);
                          }}
                          style={{ 
                            cursor: 'pointer', 
                            background: isSelected ? 'rgba(249, 115, 22, 0.08)' : 'transparent',
                            borderBottom: '1px solid var(--border-subtle)',
                            borderLeft: isSelected ? '3px solid #f97316' : '3px solid transparent'
                          }}
                          className="package-row-hover"
                        >
                          <td style={{ padding: '0.5rem 0.75rem' }}>{p.name}</td>
                          <td style={{ padding: '0.5rem 0.75rem' }}>{p.abbreviation || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Rodapé do Modal */}
            <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', background: 'var(--bg-surface-hover)' }}>
              <button className="prod-btn prod-btn-secondary" style={{ height: '32px', fontSize: '0.8rem' }} onClick={() => setIsPropertyModalOpen(false)}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cadastro de Setores de Estoque (Sobreposto, Sem Minimizar) */}
      {isSectorModalOpen && (
        <div className="prod-modal-overlay animate-fade-in" style={{ zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.6)' }} onClick={() => setIsSectorModalOpen(false)}>
          <div 
            className="mdi-window active" 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              position: 'relative',
              width: '580px', 
              maxWidth: '95%', 
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              height: 'auto',
              maxHeight: '85vh',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
            }}
          >
            {/* Cabeçalho de Janela MDI */}
            <div 
              className="mdi-window-header" 
              style={{ 
                cursor: 'default', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                height: '38px', 
                padding: '0 1rem', 
                flexShrink: 0 
              }}
            >
              <div className="mdi-window-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="mdi-window-icon">💻</span>
                <span>Setores de Estoque</span>
              </div>
              <div className="mdi-window-controls">
                {/* Sem botões de minimizar e maximizar, apenas fechar */}
                <button 
                  className="mdi-control-btn btn-close" 
                  title="Fechar" 
                  onClick={() => setIsSectorModalOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Conteúdo */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>
              {/* Form de Cadastro */}
              <div style={{ display: 'flex', gap: '1rem', width: '100%', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Nome Setor *</span>
                  <input
                    type="text"
                    value={sectorName}
                    onChange={e => setSectorName(e.target.value)}
                    placeholder="Ex: Cozinha, Bar..."
                    className="prod-input"
                    style={{ height: '36px', padding: '0 0.75rem', background: 'rgba(0,0,0,0.2)' }}
                  />
                </div>
                <div style={{ flex: 2, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Descrição</span>
                  <input
                    type="text"
                    value={sectorDescription}
                    onChange={e => setSectorDescription(e.target.value)}
                    placeholder="Descrição do setor"
                    className="prod-input"
                    style={{ height: '36px', padding: '0 0.75rem', background: 'rgba(0,0,0,0.2)' }}
                  />
                </div>
              </div>

              {/* Botões Cadastrar, Editar e Excluir */}
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  className="prod-btn prod-btn-primary"
                  style={{ height: '32px', fontSize: '0.8rem', background: 'var(--primary)' }}
                  onClick={handleSaveSector}
                >
                  {editingSectorId ? 'Salvar' : 'Cadastrar'}
                </button>
                {editingSectorId && (
                  <button
                    className="prod-btn prod-btn-secondary"
                    style={{ height: '32px', fontSize: '0.8rem' }}
                    onClick={() => {
                      setEditingSectorId(null);
                      setSectorName('');
                      setSectorDescription('');
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </div>

              {/* Tabela de Setores */}
              <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', maxHeight: '220px', overflowY: 'auto', background: 'var(--bg-primary)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                  <thead style={{ background: 'rgba(30, 41, 59, 0.4)', borderBottom: '1px solid var(--border-strong)', position: 'sticky', top: 0, zIndex: 5 }}>
                    <tr>
                      <th style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Nome</th>
                      <th style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Descrição</th>
                      <th style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, width: '90px', textAlign: 'center' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sectorsList.length === 0 ? (
                      <tr>
                        <td colSpan={3} style={{ padding: '1rem 0.75rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          Nenhum setor de estoque cadastrado.
                        </td>
                      </tr>
                    ) : (
                      sectorsList.map(s => (
                        <tr key={s.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-primary)', fontWeight: 500 }}>{s.name}</td>
                          <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)' }}>{s.description || '-'}</td>
                          <td style={{ padding: '0.25rem 0.75rem', display: 'flex', gap: '0.25rem', justifyContent: 'center', alignItems: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleEditSector(s)}
                              className="action-btn edit-btn"
                              title="Editar"
                              style={{ width: '24px', height: '24px' }}
                            >
                              <Pencil size={10} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSector(s.id, s.name)}
                              className="action-btn delete-btn"
                              title="Excluir"
                              style={{ width: '24px', height: '24px' }}
                            >
                              <Trash2 size={10} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rodapé */}
            <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', background: 'var(--bg-surface-hover)' }}>
              <button className="prod-btn prod-btn-secondary" style={{ height: '32px', fontSize: '0.8rem' }} onClick={() => setIsSectorModalOpen(false)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
