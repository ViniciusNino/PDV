import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../services/apiClient';

export interface ProductMock {
  id: string;
  code: string;
  description: string;
  price: number;
  stock: number;
  unit: string;
}

export interface StockItem {
  code: string;
  description: string;
  units: number;
  quantity: number;
  price: number;
  total: number;
  sector: string;
  supplier: string;
  details: string;
}

export function useTelaEstoque() {
  const [activeTab, setActiveTab] = useState<'estoque' | 'xml'>('estoque');
  const [isSectorModalOpen, setIsSectorModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Mocks iniciais
  const defaultProducts: ProductMock[] = [
    { id: '9', code: '9', description: 'Catupiry 1kg', price: 0.00, stock: 3, unit: 'UN' },
    { id: '1', code: '1', description: 'Coca Cola 350ml', price: 3.50, stock: 23, unit: 'UN' },
    { id: '20', code: '20', description: 'Polpa de açai 1kg', price: 0.00, stock: 3, unit: 'UN' },
    { id: '2', code: '2', description: 'Fanta Laranja 350ml', price: 3.20, stock: 15, unit: 'UN' },
    { id: '3', code: '3', description: 'Guaraná Antarctica 350ml', price: 3.40, stock: 40, unit: 'UN' },
  ];

  // Listas de estados
  const [productsList, setProductsList] = useState<ProductMock[]>(defaultProducts);
  const [filteredProducts, setFilteredProducts] = useState<ProductMock[]>([]);
  const [isProductPopoverOpen, setIsProductPopoverOpen] = useState(false);
  const [sectorsList, setSectorsList] = useState<any[]>([]);

  // Itens adicionados à tabela
  const [stockItems, setStockItems] = useState<StockItem[]>(() => {
    const saved = localStorage.getItem('mock_stock_items');
    return saved ? JSON.parse(saved) : [];
  });

  // Formulário
  const [productQuery, setProductQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductMock | null>(null);
  const [movement, setMovement] = useState('Compra');
  const [supplierQuery, setSupplierQuery] = useState('');
  const [units, setUnits] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [currentStock, setCurrentStock] = useState(0);
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [batch, setBatch] = useState('');
  const [mfgDate, setMfgDate] = useState('2026-06-05'); // Data conforme vídeo: 05/06/2026
  const [sectorId, setSectorId] = useState('');
  const [useEntryDate, setUseEntryDate] = useState(false);
  const [entryDate, setEntryDate] = useState('2026-06-12'); // Data conforme vídeo: 12/06/2026

  // Carrega setores com fallback para localStorage
  const fetchSectors = useCallback(async () => {
    try {
      const data = await apiClient.get('/stocksectors');
      if (data && Array.isArray(data)) {
        setSectorsList(data);
        if (data.length > 0 && !sectorId) {
          setSectorId(String(data[0].id));
        }
      } else {
        throw new Error("Formato inválido");
      }
    } catch (err) {
      // Fallback offline
      const local = localStorage.getItem('mock_stocksectors');
      const list = local ? JSON.parse(local) : [
        { id: '1', name: 'Vendas', description: 'Setor de vendas' },
        { id: '2', name: 'Cozinha', description: 'Cozinha' },
        { id: '3', name: 'Churrasqueira', description: 'Churrasqueira' },
        { id: '4', name: 'Bar', description: 'Setor de bebidas' }
      ];
      setSectorsList(list);
      
      // Armazena no localStorage caso não exista para sincronia
      if (!local) {
        localStorage.setItem('mock_stocksectors', JSON.stringify(list));
      }
      
      if (list.length > 0) {
        setSectorId(String(list[0].id));
      }
    }
  }, [sectorId]);

  // Carrega produtos da API (caso exista) com fallback para os mocks
  const fetchProducts = useCallback(async () => {
    try {
      const data = await apiClient.get('/products');
        const mapped = data.map((p: any) => {
          const displayCode = p.code && p.code.trim() ? p.code.trim() : '-';
          return {
            id: String(p.id),
            code: displayCode,
            description: p.name || p.description,
            price: p.salePrice || p.price || 0,
            stock: p.stockQuantity || p.stock || 0,
            unit: p.unit || 'UN'
          };
        });
        setProductsList(mapped);
    } catch (err) {
      // Mantém os mocks locais caso falhe ou esteja sem API
      setProductsList(defaultProducts);
    }
  }, []);

  useEffect(() => {
    fetchSectors();
    fetchProducts();
  }, []);

  // Salva itens no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('mock_stock_items', JSON.stringify(stockItems));
  }, [stockItems]);

  // Filtra produtos conforme digita
  const handleProductSearchChange = (query: string) => {
    setProductQuery(query);
    if (!query.trim()) {
      setFilteredProducts([]);
      setIsProductPopoverOpen(false);
      return;
    }

    const filtered = productsList.filter(p => 
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.code.includes(query)
    );

    setFilteredProducts(filtered);
    setIsProductPopoverOpen(filtered.length > 0);
  };

  // Seleciona um produto do popover
  const handleSelectProduct = (product: ProductMock) => {
    setSelectedProduct(product);
    setProductQuery(product.description);
    setCurrentStock(product.stock);
    setSalePrice(product.price);
    setIsProductPopoverOpen(false);
    setError('');
  };

  // Sincronizações matemáticas dos campos de entrada
  const handleUnitsChange = (val: number) => {
    setUnits(val);
    setQuantity(val); // Relação direta 1:1 no exemplo do vídeo
    
    const calculatedTotal = val * purchasePrice;
    setTotalPrice(Number(calculatedTotal.toFixed(2)));
  };

  const handleQuantityChange = (val: number) => {
    setQuantity(val);
    
    const calculatedTotal = val * purchasePrice;
    setTotalPrice(Number(calculatedTotal.toFixed(2)));
  };

  const handlePurchasePriceChange = (val: number) => {
    setPurchasePrice(val);
    
    const calculatedTotal = quantity * val;
    setTotalPrice(Number(calculatedTotal.toFixed(2)));
  };

  const handleTotalPriceChange = (val: number) => {
    setTotalPrice(val);
    if (quantity > 0) {
      const calculatedPrice = val / quantity;
      setPurchasePrice(Number(calculatedPrice.toFixed(4)));
    }
  };

  // Limpa o formulário de entrada
  const handleClearForm = () => {
    setSelectedProduct(null);
    setProductQuery('');
    setUnits(0);
    setQuantity(0);
    setCurrentStock(0);
    setPurchasePrice(0);
    setTotalPrice(0);
    setSalePrice(0);
    setBatch('');
    setSupplierQuery('');
    setError('');
  };

  // Insere o produto na tabela
  const handleInsertItem = () => {
    setError('');
    setSuccessMessage('');

    if (!selectedProduct) {
      setError("Por favor, selecione um produto válido na listagem.");
      return;
    }

    if (quantity <= 0) {
      setError("A quantidade deve ser maior do que zero.");
      return;
    }

    const targetSector = sectorsList.find(s => String(s.id) === String(sectorId));
    const sectorName = targetSector ? targetSector.name : 'Vendas';

    const newItem: StockItem = {
      code: selectedProduct.code,
      description: selectedProduct.description,
      units: units,
      quantity: quantity,
      price: purchasePrice,
      total: totalPrice,
      sector: sectorName,
      supplier: supplierQuery.trim() || '-',
      details: batch.trim() ? `Lote: ${batch.trim()}` : ''
    };

    setStockItems(prev => [...prev, newItem]);
    setSuccessMessage(`Item "${selectedProduct.description}" adicionado com sucesso!`);
    
    // Limpa apenas o formulário mantendo as configurações de Setor, Movimento e Datas
    handleClearForm();
  };

  // Remove um item da tabela
  const handleRemoveItem = (index: number) => {
    setStockItems(prev => prev.filter((_, i) => i !== index));
    setSuccessMessage("Item removido da lista.");
  };

  // Limpa a tabela inteira
  const handleClearTable = () => {
    if (window.confirm("Deseja realmente limpar toda a lista de estoque?")) {
      setStockItems([]);
      setSuccessMessage("Lista de estoque limpa.");
    }
  };

  return {
    activeTab,
    setActiveTab,
    isSectorModalOpen,
    setIsSectorModalOpen,
    error,
    setError,
    successMessage,
    setSuccessMessage,
    
    // Mocks / Listas
    productsList,
    filteredProducts,
    isProductPopoverOpen,
    setIsProductPopoverOpen,
    sectorsList,
    stockItems,
    
    // Form States
    productQuery,
    setProductQuery,
    selectedProduct,
    movement,
    setMovement,
    supplierQuery,
    setSupplierQuery,
    units,
    quantity,
    currentStock,
    purchasePrice,
    totalPrice,
    salePrice,
    setSalePrice,
    batch,
    setBatch,
    mfgDate,
    setMfgDate,
    sectorId,
    setSectorId,
    useEntryDate,
    setUseEntryDate,
    entryDate,
    setEntryDate,
    
    // Ações
    handleProductSearchChange,
    handleSelectProduct,
    handleUnitsChange,
    handleQuantityChange,
    handlePurchasePriceChange,
    handleTotalPriceChange,
    handleInsertItem,
    handleRemoveItem,
    handleClearTable,
    handleClearForm,
    reloadSectors: fetchSectors
  };
}
