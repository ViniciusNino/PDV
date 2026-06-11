import { useState, useEffect, useCallback } from 'react';
import { formatCurrency, parseCurrencyToFloat, generateGuid, getNextProductCode, formatQuantityDecimal } from '../../utils/formatters';
import type { ProductFormData } from '../../types/product.types';
import { apiClient } from '../../services/apiClient';
import { usePromotions } from './components/tabs/TabPromocoes/TabPromocoesState';
import { useModifierGroups } from './components/tabs/TabPacotes/TabPacotesState';

interface UseModalProdutosProps {
}

export function useModalProdutos(_props?: UseModalProdutosProps) {
  const [activeTab, setActiveTab] = useState<string>('geral');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Limpa mensagens após alguns segundos
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState<ProductFormData>({
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

  const [isSectorModalOpen, setIsSectorModalOpen] = useState(false);

  // Estados para CRUD de Setores de Estoque
  const [sectorsList, setSectorsList] = useState<any[]>([]);
  const [sectorName, setSectorName] = useState('');
  const [sectorDescription, setSectorDescription] = useState('');
  const [editingSectorId, setEditingSectorId] = useState<string | null>(null);

  // Instanciando os Hooks de abas específicas
  const promotionsHook = usePromotions({
    promotions: formData.promotions,
    setPromotions: (promos) => setFormData(prev => ({ ...prev, promotions: promos })),
    setError
  });

  const modifierGroupsHook = useModifierGroups({
    modifierGroups: formData.modifierGroups,
    setModifierGroups: (groups) => {
      if (typeof groups === 'function') {
        setFormData(prev => ({ ...prev, modifierGroups: groups(prev.modifierGroups) }));
      } else {
        setFormData(prev => ({ ...prev, modifierGroups: groups }));
      }
    },
    productsList,
    setError
  });

  const {
    isPropertyModalOpen,
    setIsPropertyModalOpen,
    propNameInput,
    setPropNameInput,
    propAbbrevInput,
    setPropAbbrevInput,
    selectedPropId,
    setSelectedPropId,
    customProperties,
    setCustomProperties,
    optPropName,
    setOptPropName
  } = modifierGroupsHook.state;

  const fetchSectors = useCallback(() => {
    return apiClient.get('/stocksectors')
      .then(data => {
        setSectorsList(data);
        return data;
      })
      .catch(err => {
        console.error("Erro ao carregar setores:", err);
      });
  }, []);

  const handleSaveSector = async () => {
    if (!sectorName.trim()) {
      setError("O nome do setor é obrigatório.");
      return;
    }
    try {
      const payload = {
        name: sectorName.trim(),
        description: sectorDescription.trim()
      };
      
      if (editingSectorId) {
        await apiClient.put(`/stocksectors/${editingSectorId}`, payload);
      } else {
        await apiClient.post('/stocksectors', payload);
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
      await apiClient.delete(`/stocksectors/${sectorId}`);

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

  const fetchProducts = useCallback(() => {
    return apiClient.get('/products')
      .then(data => {
        setProductsList(data);
        return data;
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    apiClient.get('/categories')
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
      const prod = await apiClient.get(`/products/${prodId}`);

      setEditingId(prod.id);
      
      const newFormData: ProductFormData = {
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
      };

      setFormData(newFormData);
      modifierGroupsHook.state.setSelectedGroupUiId(null);
      modifierGroupsHook.state.setIsEditingGroup(false);
      modifierGroupsHook.state.setGroupName('');
      modifierGroupsHook.state.setGroupCanBeFractioned(false);
      modifierGroupsHook.state.setGroupPriceRule(1);
      modifierGroupsHook.state.setGroupMinSelections(1);
      modifierGroupsHook.state.setGroupMaxSelections(1);
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
    modifierGroupsHook.state.setSelectedGroupUiId(null);
    modifierGroupsHook.state.setIsEditingGroup(false);
    modifierGroupsHook.state.setGroupName('');
    modifierGroupsHook.state.setGroupCanBeFractioned(false);
    modifierGroupsHook.state.setGroupPriceRule(1);
    modifierGroupsHook.state.setGroupMinSelections(1);
    modifierGroupsHook.state.setGroupMaxSelections(1);
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir permanentemente o produto "${name}"?`)) return;

    try {
      await apiClient.delete(`/products/${id}`);

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
      // Sanitizando os dados para a API
      const payload = {
        ...formData,
        stockSectorId: formData.stockSectorId ? formData.stockSectorId : null,
        basePrice: parseCurrencyToFloat(formData.basePrice),
        costPrice: parseCurrencyToFloat(formData.costPrice),
        prices: formData.prices.map((p: any) => ({
          channel: p.channel,
          price: parseCurrencyToFloat(p.price),
          isVisible: p.isVisible
        })),
        ingredients: formData.ingredients.map((i: any) => ({
          ingredientProductId: i.ingredientProductId,
          quantity: parseCurrencyToFloat(i.quantity),
          type: i.type,
          additionalPrice: parseCurrencyToFloat(i.additionalPrice),
          isActive: i.isActive
        })),
        comboItems: formData.comboItems.map((c: any) => ({
          childProductId: c.childProductId,
          quantity: parseFloat(c.quantity) || 0,
          fixedPrice: c.fixedPrice ? parseCurrencyToFloat(c.fixedPrice) : null
        })),
        modifierGroups: formData.modifierGroups.map((g: any) => ({
          id: g.id || (g.uiId && g.uiId.includes('-') ? g.uiId : null),
          name: g.name,
          minSelections: g.minSelections,
          maxSelections: g.maxSelections,
          priceRule: g.priceRule,
          sequence: 0,
          isPropType: g.isPropType,
          canBeFractioned: g.canBeFractioned,
          options: g.options.map((o: any, idx: number) => ({
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
        promotions: formData.promotions.map((promo: any) => ({
          id: promo.id || null,
          dayStart: promo.dayStart,
          hourStart: parseInt(promo.hourStart?.toString() || '0', 10),
          dayEnd: promo.dayEnd,
          hourEnd: parseInt(promo.hourEnd?.toString() || '0', 10),
          price: parseCurrencyToFloat(promo.price),
          isSaleForbidden: promo.isSaleForbidden
        }))
      };

      if (editingId) {
        await apiClient.put(`/products/${editingId}`, payload);
      } else {
        await apiClient.post('/products', payload);
      }

      setSuccessMessage(editingId ? "Produto atualizado com sucesso!" : "Produto salvo com sucesso!");
      fetchProducts().then(data => {
        handleNewProduct(data);
      });
    } catch (err: any) {
      setError("Erro ao salvar produto: " + err.message);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        handleNewProduct();
      }
      if (e.key === 'F4') {
        e.preventDefault();
        document.getElementById('prod-img')?.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [productsList]);

  // Novas funções para limpar a lógica TS do JSX
  const handleCancelSectorEdit = () => {
    setEditingSectorId(null);
    setSectorName('');
    setSectorDescription('');
  };

  const handleAddProperty = () => {
    const nameTrimmed = propNameInput.trim();
    if (!nameTrimmed) return;
    if (customProperties.some((p: any) => p.name.toLowerCase() === nameTrimmed.toLowerCase())) {
      alert("Esta propriedade já está cadastrada.");
      return;
    }
    const newProp = {
      id: generateGuid(),
      name: nameTrimmed,
      abbreviation: propAbbrevInput.trim()
    };
    setCustomProperties((prev: any) => [...prev, newProp]);
    setPropNameInput('');
    setPropAbbrevInput('');
  };

  const handleSaveProperty = () => {
    if (!selectedPropId) return;
    const nameTrimmed = propNameInput.trim();
    if (!nameTrimmed) return;
    setCustomProperties((prev: any) =>
      prev.map((p: any) =>
        p.id === selectedPropId
          ? { ...p, name: nameTrimmed, abbreviation: propAbbrevInput.trim() }
          : p
      )
    );
    setSelectedPropId(null);
    setPropNameInput('');
    setPropAbbrevInput('');
  };

  const handleDeleteProperty = () => {
    if (!selectedPropId) return;
    const prop = customProperties.find((p: any) => p.id === selectedPropId);
    if (prop && window.confirm(`Deseja realmente excluir a propriedade "${prop.name}"?`)) {
      setCustomProperties((prev: any) => prev.filter((p: any) => p.id !== selectedPropId));
      if (optPropName === prop.name) {
        setOptPropName('');
      }
      setSelectedPropId(null);
      setPropNameInput('');
      setPropAbbrevInput('');
    }
  };

  const handleSelectProperty = (prop: any) => {
    setSelectedPropId(prop.id);
    setPropNameInput(prop.name);
    setPropAbbrevInput(prop.abbreviation || '');
  };

  return {
    activeTab,
    setActiveTab,
    error,
    setError,
    successMessage,
    setSuccessMessage,
    editingId,
    setEditingId,
    categories,
    productsList,
    searchTerm,
    setSearchTerm,
    formData,
    setFormData,
    isSectorModalOpen,
    setIsSectorModalOpen,
    sectorsList,
    sectorName,
    setSectorName,
    sectorDescription,
    setSectorDescription,
    editingSectorId,
    setEditingSectorId,
    promotionsHook,
    modifierGroupsHook,
    isPropertyModalOpen,
    setIsPropertyModalOpen,
    propNameInput,
    setPropNameInput,
    propAbbrevInput,
    setPropAbbrevInput,
    selectedPropId,
    setSelectedPropId,
    customProperties,
    setCustomProperties,
    optPropName,
    setOptPropName,
    fetchSectors,
    handleSaveSector,
    handleEditSector,
    handleDeleteSector,
    fetchProducts,
    handleEditStart,
    handleNewProduct,
    handleDeleteProduct,
    handleSave,
    handleCancelSectorEdit,
    handleAddProperty,
    handleSaveProperty,
    handleDeleteProperty,
    handleSelectProperty
  };
}
