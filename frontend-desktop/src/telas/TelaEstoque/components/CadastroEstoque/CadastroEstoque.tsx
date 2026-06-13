import { Search, Plus } from 'lucide-react';
import { FiltroProdutos } from '../FiltroProdutos/FiltroProdutos';
import { useCadastroEstoque } from './CadastroEstoqueState';
import './CadastroEstoque.css';
import type { ProductMock } from '../../TelaEstoqueState';

interface CadastroEstoqueProps {
  productQuery: string;
  selectedProduct: ProductMock | null;
  movement: string;
  setMovement: (val: string) => void;
  supplierQuery: string;
  setSupplierQuery: (val: string) => void;
  units: number;
  quantity: number;
  currentStock: number;
  purchasePrice: number;
  totalPrice: number;
  salePrice: number;
  setSalePrice: (val: number) => void;
  batch: string;
  setBatch: (val: string) => void;
  mfgDate: string;
  setMfgDate: (val: string) => void;
  sectorId: string;
  setSectorId: (val: string) => void;
  useEntryDate: boolean;
  setUseEntryDate: (val: boolean) => void;
  entryDate: string;
  setEntryDate: (val: string) => void;
  sectorsList: any[];
  filteredProducts: ProductMock[];
  isProductPopoverOpen: boolean;
  setIsProductPopoverOpen: (val: boolean) => void;
  handleProductSearchChange: (query: string) => void;
  handleSelectProduct: (product: ProductMock) => void;
  handleUnitsChange: (val: number) => void;
  handleQuantityChange: (val: number) => void;
  handlePurchasePriceChange: (val: number) => void;
  handleTotalPriceChange: (val: number) => void;
  handleInsertItem: () => void;
  handleClearForm: () => void;
  setIsSectorModalOpen: (val: boolean) => void;
  onError: (msg: string) => void;
}

export function CadastroEstoque({
  productQuery,
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
  sectorsList,
  filteredProducts,
  isProductPopoverOpen,
  setIsProductPopoverOpen,
  handleProductSearchChange,
  handleSelectProduct,
  handleUnitsChange,
  handleQuantityChange,
  handlePurchasePriceChange,
  handleTotalPriceChange,
  handleInsertItem,
  handleClearForm,
  setIsSectorModalOpen,
  onError
}: CadastroEstoqueProps) {

  const { validateForm } = useCadastroEstoque({
    selectedProduct,
    quantity,
    purchasePrice,
    totalPrice,
    onError
  });

  const onSubmit = () => {
    if (validateForm()) {
      handleInsertItem();
    }
  };

  return (
    <div className="estoque-form-section">
      {/* Linha 1: Produto e Movimento */}
      <div className="estoque-form-row">
        <div className="estoque-field-group product-search-field-wrapper">
          <label>Produto:</label>
          <div className="search-input-wrapper">
            <input
              type="text"
              value={productQuery}
              onChange={e => handleProductSearchChange(e.target.value)}
              placeholder="Descrição ou código do produto..."
              className="estoque-input"
            />
            <button type="button" className="search-action-btn" title="Buscar Produto">
              <Search size={14} />
            </button>

            {/* Popover de Auto-complete de Produtos */}
            <FiltroProdutos
              filteredProducts={filteredProducts}
              isOpen={isProductPopoverOpen}
              onSelectProduct={handleSelectProduct}
              onClose={() => setIsProductPopoverOpen(false)}
              selectedProduct={selectedProduct}
            />
          </div>
        </div>

        <div className="estoque-field-group movement-field-wrapper">
          <label>Movimento:</label>
          <select
            value={movement}
            onChange={e => setMovement(e.target.value)}
            className="estoque-input"
          >
            <option value="Compra">Compra</option>
            <option value="Consumo">Consumo</option>
            <option value="Desperdício">Desperdício</option>
            <option value="Retirar (Acerto)">Retirar (Acerto)</option>
            <option value="Inserir (Acerto)">Inserir (Acerto)</option>
            <option value="Transferência">Transferência</option>
          </select>
        </div>
      </div>

      {/* Linha 2: Fornecedor */}
      <div className="estoque-form-row">
        <div className="estoque-field-group full-width">
          <label>Telefone ou Fantasia do Fornecedor:</label>
          <div className="search-input-wrapper">
            <input
              type="text"
              value={supplierQuery}
              onChange={e => setSupplierQuery(e.target.value)}
              placeholder="Digite o nome ou telefone do fornecedor..."
              className="estoque-input"
            />
            <button type="button" className="search-action-btn" title="Buscar Fornecedor">
              <Search size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Linha 3: Unidades, Quantidade, Estoque, Preços */}
      <div className="estoque-form-grid-6">
        <div className="estoque-field-group">
          <label>Unidades:</label>
          <input
            type="number"
            value={units === 0 ? '' : units}
            onChange={e => handleUnitsChange(Number(e.target.value) || 0)}
            className="estoque-input align-right"
            placeholder="0"
            min="0"
          />
        </div>

        <div className="estoque-field-group quantity-field-group">
          <label>Quantidade:</label>
          <div className="input-with-badge">
            <input
              type="number"
              value={quantity === 0 ? '' : quantity}
              onChange={e => handleQuantityChange(Number(e.target.value) || 0)}
              className="estoque-input align-right"
              placeholder="0"
              min="0"
            />
            <span className="unit-badge">{selectedProduct?.unit || 'UN'}</span>
          </div>
        </div>

        <div className="estoque-field-group stock-field-group">
          <label>Estoque:</label>
          <input
            type="text"
            value={currentStock}
            readOnly
            className="estoque-input align-right readonly-yellow-field"
          />
        </div>

        <div className="estoque-field-group">
          <label>Preço de compra:</label>
          <input
            type="number"
            step="0.01"
            value={purchasePrice === 0 ? '' : purchasePrice}
            onChange={e => handlePurchasePriceChange(Number(e.target.value) || 0)}
            className="estoque-input align-right"
            placeholder="0,00"
            min="0"
          />
        </div>

        <div className="estoque-field-group">
          <label>Total da compra:</label>
          <input
            type="number"
            step="0.01"
            value={totalPrice === 0 ? '' : totalPrice}
            onChange={e => handleTotalPriceChange(Number(e.target.value) || 0)}
            className="estoque-input align-right"
            placeholder="0,00"
            min="0"
          />
        </div>

        <div className="estoque-field-group">
          <label>Preço de venda:</label>
          <input
            type="number"
            step="0.01"
            value={salePrice === 0 ? '' : salePrice}
            onChange={e => setSalePrice(Number(e.target.value) || 0)}
            className="estoque-input align-right"
            placeholder="0,00"
            min="0"
          />
        </div>
      </div>

      {/* Linha 4: Lote e Data de Fabricação */}
      <div className="estoque-form-row">
        <div className="estoque-field-group half-width">
          <label>Lote:</label>
          <input
            type="text"
            value={batch}
            onChange={e => setBatch(e.target.value)}
            placeholder="Ex: LOT-123A..."
            className="estoque-input"
          />
        </div>

        <div className="estoque-field-group half-width">
          <label>Data de fabricação:</label>
          <input
            type="date"
            value={mfgDate}
            onChange={e => setMfgDate(e.target.value)}
            className="estoque-input"
          />
        </div>
      </div>

      {/* Linha 5: Setor, Data de Entrada, Botões de Ação */}
      <div className="estoque-form-row-flexible">
        <div className="estoque-field-group sector-field-group">
          <label>Setor:</label>
          <div className="select-with-plus">
            <select
              value={sectorId}
              onChange={e => setSectorId(e.target.value)}
              className="estoque-input"
            >
              {sectorsList.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <button
              type="button"
              className="plus-btn"
              title="Gerenciar Setores"
              onClick={() => setIsSectorModalOpen(true)}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="estoque-field-group entry-date-field-group">
          <label>Data de entrada:</label>
          <div className="checkbox-with-date">
            <input
              type="checkbox"
              checked={useEntryDate}
              onChange={e => setUseEntryDate(e.target.checked)}
              id="checkbox-use-entry-date"
              className="estoque-checkbox"
            />
            <input
              type="date"
              value={entryDate}
              onChange={e => setEntryDate(e.target.value)}
              disabled={!useEntryDate}
              className={`estoque-input ${!useEntryDate ? 'disabled-date-input' : ''}`}
            />
          </div>
        </div>

        {/* Botões Inserir / Cancelar */}
        <div className="estoque-form-actions">
          <button
            type="button"
            onClick={onSubmit}
            disabled={!selectedProduct}
            className={`estoque-btn btn-insert ${!selectedProduct ? 'disabled' : ''}`}
          >
            Inserir
          </button>
          <button
            type="button"
            onClick={handleClearForm}
            className="estoque-btn btn-clear"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
