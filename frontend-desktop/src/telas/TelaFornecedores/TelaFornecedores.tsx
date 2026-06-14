import { Truck, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useTelaFornecedores } from './TelaFornecedoresState';
import { FormularioFornecedor } from './components/FormularioFornecedor/FormularioFornecedor';
import { ListaFornecedores } from './components/ListaFornecedores/ListaFornecedores';
import { PainelFiltrosFornecedor } from './components/PainelFiltrosFornecedor/PainelFiltrosFornecedor';
import { BuscaClienteModal } from '../TelaConfiguracao/components/BuscaClienteModal/BuscaClienteModal';
import './TelaFornecedores.css';

interface TelaFornecedoresProps {
  onClose: () => void;
  isWindowMode?: boolean;
}

export function TelaFornecedores({ onClose, isWindowMode = false }: TelaFornecedoresProps) {
  const {
    fornecedoresFiltrados,
    selectedId,
    setSelectedId,
    formData,
    setFormData,
    logoUrl,
    setLogoUrl,
    activeSubTab,
    setActiveSubTab,
    isSearchModalOpen,
    setIsSearchModalOpen,
    error,
    setError,
    successMessage,
    setSuccessMessage,
    handleEditar,
    handleSalvar,
    handleExcluir,
    handleCancelar,
    handleNovo,
    
    // Filtros
    filterNome,
    setFilterNome,
    filterCnpj,
    setFilterCnpj,
    filterTelefone,
    setFilterTelefone,
    filterEmail,
    setFilterEmail,
  } = useTelaFornecedores();

  return (
    <>
      <div className="fornec-window-card animate-fade-in" style={{ position: 'relative' }}>
        {/* Header */}
        {!isWindowMode && (
          <div className="fornec-window-header">
            <div className="fornec-header-title">
              <Truck size={16} />
              <h2>Cadastro de Fornecedores</h2>
            </div>
            <button onClick={onClose} className="fornec-header-close" title="Fechar">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Alertas */}
        {error && (
          <div className="fornec-alert error">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}
        {successMessage && (
          <div className="fornec-alert success">
            <CheckCircle2 size={15} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Corpo principal em duas colunas, exatamente como clientes */}
        <div className="fornec-main-layout">
          {/* Painel esquerdo de filtros */}
          <PainelFiltrosFornecedor
            totalFornecedores={fornecedoresFiltrados.length}
            filterNome={filterNome}
            setFilterNome={setFilterNome}
            filterCnpj={filterCnpj}
            setFilterCnpj={setFilterCnpj}
            filterTelefone={filterTelefone}
            setFilterTelefone={setFilterTelefone}
            filterEmail={filterEmail}
            setFilterEmail={setFilterEmail}
            onFechar={onClose}
          />

          {/* Painel direito com formulário e listagem */}
          <div className="fornec-content-right">
            {/* Formulário no Topo */}
            <div className="fornec-form-panel">
              <FormularioFornecedor
                formData={formData}
                setFormData={setFormData}
                logoUrl={logoUrl}
                setLogoUrl={setLogoUrl}
                activeSubTab={activeSubTab}
                setActiveSubTab={setActiveSubTab}
                setIsSearchModalOpen={setIsSearchModalOpen}
                onNovo={handleNovo}
                onSalvar={() => {
                  setError('');
                  setSuccessMessage('');
                  handleSalvar();
                }}
                onCancelar={() => {
                  setError('');
                  setSuccessMessage('');
                  handleCancelar();
                }}
                selectedId={selectedId}
              />
            </div>

            {/* Listagem na base */}
            <div className="fornec-list-panel">
              <ListaFornecedores
                fornecedoresFiltrados={fornecedoresFiltrados}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                onEditar={(id) => {
                  setError('');
                  setSuccessMessage('');
                  handleEditar(id);
                }}
                onExcluir={(id) => {
                  setError('');
                  setSuccessMessage('');
                  handleExcluir(id);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal de busca de clientes/acionistas */}
      {isSearchModalOpen && (
        <BuscaClienteModal onClose={() => setIsSearchModalOpen(false)} />
      )}
    </>
  );
}
