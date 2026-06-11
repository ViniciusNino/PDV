import {
  Package, Save, Settings, Tag, LayoutList, Layers
} from 'lucide-react';
import './ModalProdutos.css';
import { useModalProdutos } from './ModalProdutosState';

import { ProductList } from './components/ProductList/ProductList';
import { TabGeral } from './components/tabs/TabGeral/TabGeral';
import { TabPrecos } from './components/tabs/TabPrecos/TabPrecos';
import { TabComposicao } from './components/tabs/TabComposicao/TabComposicao';
import { TabPacotes } from './components/tabs/TabPacotes/TabPacotes';
import { TabEstoque } from './components/tabs/TabEstoque/TabEstoque';
import { TabPromocoes } from './components/tabs/TabPromocoes/TabPromocoes';
import { Header } from '../../components/Header/Header';
import { FormActions } from '../../components/FormActions/FormActions';
import { NotificationAlert } from '../../components/NotificationAlert/NotificationAlert';
import { PropertyModal } from './components/PropertyModal/PropertyModal';
import { StockSectorModal } from './components/StockSectorModal/StockSectorModal';

interface ModalProdutosProps {
  onClose: () => void;
  isWindowMode?: boolean;
}

export function ModalProdutos({ onClose, isWindowMode = false }: ModalProdutosProps) {
  const {
    activeTab,
    setActiveTab,
    error,
    setError,
    successMessage,
    editingId,
    categories,
    productsList,
    formData,
    setFormData,
    isSectorModalOpen,
    setIsSectorModalOpen,
    promotionsHook,
    modifierGroupsHook,
    isPropertyModalOpen,
    setIsPropertyModalOpen,
    handleEditStart,
    handleNewProduct,
    handleDeleteProduct,
    handleSave
  } = useModalProdutos();

  const { optPropName, setOptPropName } = modifierGroupsHook.state;

  const tabs = [
    { id: 'geral', label: 'Dados Gerais', icon: Settings },
    { id: 'canais', label: 'Canais de Venda', icon: Tag },
    { id: 'composicao', label: 'Composição', icon: LayoutList },
    { id: 'pacotes', label: 'Pacotes', icon: Layers },
    { id: 'estoque', label: 'Estoque', icon: Package },
    { id: 'promocao', label: 'Promoções', icon: Tag }
  ];

  const cardBody = (
    <div className={`prod-modal-card glass-panel ${isWindowMode ? 'window-mode' : ''}`} onClick={(e) => e.stopPropagation()}>

      {/* Header */}
      {!isWindowMode && (
        <Header title="Gerenciamento de Produtos" icon={Package} onClose={onClose} />
      )}

      {/* Mensagens de Notificação */}
      {error && <NotificationAlert type="error" message={error} />}
      {successMessage && <NotificationAlert type="success" message={successMessage} />}

      {/* Body */}
      <div className="prod-modal-body">

        {/* Coluna Esquerda: Listagem de Produtos */}
        <ProductList
          productsList={productsList}
          editingId={editingId}
          onNewProduct={handleNewProduct}
          onEditProduct={handleEditStart}
          onDeleteProduct={handleDeleteProduct}
        />

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
              <TabGeral
                formData={formData}
                setFormData={setFormData}
                categories={categories}
                setError={setError}
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === 'canais' && (
              <TabPrecos
                formData={formData}
                setFormData={setFormData}
              />
            )}
            {activeTab === 'composicao' && (
              <TabComposicao
                formData={formData}
                setFormData={setFormData}
                productsList={productsList}
                setError={setError}
              />
            )}
            {activeTab === 'pacotes' && (
              <TabPacotes
                formData={formData}
                productsList={productsList}
                modifierGroupsState={modifierGroupsHook.state}
                modifierGroupsActions={modifierGroupsHook.actions}
              />
            )}
            {activeTab === 'estoque' && (
              <TabEstoque
                formData={formData}
                setFormData={setFormData}
                setIsSectorModalOpen={setIsSectorModalOpen}
              />
            )}
            {activeTab === 'promocao' && (
              <TabPromocoes
                formData={formData}
                promoState={promotionsHook.state}
                promoActions={promotionsHook.actions}
              />
            )}
          </div>

          {/* Ações de Salvar Globais do Modal */}
          <FormActions 
            onCancel={onClose} 
            onSave={handleSave} 
            saveIcon={Save} 
            saveText="Salvar Produto Completo" 
          />
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

      <PropertyModal 
        isOpen={isPropertyModalOpen} 
        onClose={() => setIsPropertyModalOpen(false)} 
        onPropertyDeleted={(name) => {
          if (optPropName === name) {
            setOptPropName('');
          }
        }}
      />

      <StockSectorModal 
        isOpen={isSectorModalOpen} 
        onClose={() => setIsSectorModalOpen(false)} 
      />
    </>
  );
}

