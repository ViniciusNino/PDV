import { Package, AlertCircle, CheckCircle2, X } from 'lucide-react';
import './TelaEstoque.css';
import { useTelaEstoque } from './TelaEstoqueState';
import { StockSectorModal } from '../ModalProdutos/components/StockSectorModal/StockSectorModal';
import { CadastroEstoque } from './components/CadastroEstoque/CadastroEstoque';
import { LancamentoLoteList } from './components/LancamentoLoteList/LancamentoLoteList';
import { ImportarXml } from './components/ImportarXml/ImportarXml';

interface TelaEstoqueProps {
  onClose: () => void;
  isWindowMode?: boolean;
}

export function TelaEstoque({ onClose, isWindowMode = false }: TelaEstoqueProps) {
  const {
    activeTab,
    setActiveTab,
    isSectorModalOpen,
    setIsSectorModalOpen,
    error,
    setError,
    successMessage,
    setSuccessMessage,
    
    // Mocks / Listas
    filteredProducts,
    isProductPopoverOpen,
    setIsProductPopoverOpen,
    sectorsList,
    stockItems,
    
    // Form States
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
    reloadSectors
  } = useTelaEstoque();

  const handleXmlSuccess = (msg: string) => {
    setError('');
    setSuccessMessage(msg);
  };

  const handleXmlError = (msg: string) => {
    setSuccessMessage('');
    setError(msg);
  };

  const windowBody = (
    <div className={`estoque-window-card glass-panel ${isWindowMode ? 'window-mode' : ''}`} onClick={e => e.stopPropagation()}>
      {/* Header */}
      {!isWindowMode && (
        <div className="estoque-window-header">
          <div className="header-title-wrapper">
            <Package size={16} className="title-icon" />
            <h2>Controle de Estoque</h2>
          </div>
          <button onClick={onClose} className="header-close-btn" title="Fechar">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Alertas de Notificação */}
      {error && (
        <div className="estoque-alert-notification error animate-fade-in">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
      {successMessage && (
        <div className="estoque-alert-notification success animate-fade-in">
          <CheckCircle2 size={16} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="estoque-tabs-menu">
        <button
          type="button"
          onClick={() => setActiveTab('estoque')}
          className={`tab-menu-btn ${activeTab === 'estoque' ? 'active' : ''}`}
        >
          Estoque
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('xml')}
          className={`tab-menu-btn ${activeTab === 'xml' ? 'active' : ''}`}
        >
          Importar XML
        </button>
      </div>

      {/* Conteúdo da Aba Ativa */}
      <div className="estoque-tab-content-wrapper">
        {activeTab === 'estoque' ? (
          <div className="estoque-tab-container animate-fade-in">
            <CadastroEstoque
              productQuery={productQuery}
              selectedProduct={selectedProduct}
              movement={movement}
              setMovement={setMovement}
              supplierQuery={supplierQuery}
              setSupplierQuery={setSupplierQuery}
              units={units}
              quantity={quantity}
              currentStock={currentStock}
              purchasePrice={purchasePrice}
              totalPrice={totalPrice}
              salePrice={salePrice}
              setSalePrice={setSalePrice}
              batch={batch}
              setBatch={setBatch}
              mfgDate={mfgDate}
              setMfgDate={setMfgDate}
              sectorId={sectorId}
              setSectorId={setSectorId}
              useEntryDate={useEntryDate}
              setUseEntryDate={setUseEntryDate}
              entryDate={entryDate}
              setEntryDate={setEntryDate}
              sectorsList={sectorsList}
              filteredProducts={filteredProducts}
              isProductPopoverOpen={isProductPopoverOpen}
              setIsProductPopoverOpen={setIsProductPopoverOpen}
              handleProductSearchChange={handleProductSearchChange}
              handleSelectProduct={handleSelectProduct}
              handleUnitsChange={handleUnitsChange}
              handleQuantityChange={handleQuantityChange}
              handlePurchasePriceChange={handlePurchasePriceChange}
              handleTotalPriceChange={handleTotalPriceChange}
              handleInsertItem={handleInsertItem}
              handleClearForm={handleClearForm}
              setIsSectorModalOpen={setIsSectorModalOpen}
              onError={(msg) => {
                setSuccessMessage('');
                setError(msg);
              }}
            />
            <LancamentoLoteList
              stockItems={stockItems}
              handleRemoveItem={handleRemoveItem}
              handleClearTable={handleClearTable}
            />
          </div>
        ) : (
          <ImportarXml 
            onSuccess={handleXmlSuccess}
            onError={handleXmlError}
          />
        )}
      </div>
    </div>
  );

  return (
    <>
      {isWindowMode ? (
        windowBody
      ) : (
        <div className="estoque-modal-overlay animate-fade-in" onClick={onClose}>
          {windowBody}
        </div>
      )}

      {/* Reaproveitamento do Modal de Setores do Projeto */}
      <StockSectorModal 
        isOpen={isSectorModalOpen}
        onClose={() => {
          setIsSectorModalOpen(false);
          reloadSectors();
        }}
      />
    </>
  );
}
