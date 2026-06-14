import { Truck, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useTelaFornecedores } from './TelaFornecedoresState';
import { FormularioFornecedor } from './components/FormularioFornecedor/FormularioFornecedor';
import { ListaFornecedores } from './components/ListaFornecedores/ListaFornecedores';
import { BuscaClienteModal } from '../TelaConfiguracao/components/BuscaClienteModal/BuscaClienteModal';
import './TelaFornecedores.css';

interface TelaFornecedoresProps {
  onClose: () => void;
  isWindowMode?: boolean;
}

export function TelaFornecedores({ onClose, isWindowMode = false }: TelaFornecedoresProps) {
  const {
    fornecedoresFiltrados,
    filterQuery,
    setFilterQuery,
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

        {/* Corpo */}
        <div className="fornec-body">
          {/* Formulário (sempre visível e habilitado) */}
          <div className="fornec-panel-formulario">
            <FormularioFornecedor
              formData={formData}
              setFormData={setFormData}
              logoUrl={logoUrl}
              setLogoUrl={setLogoUrl}
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
              setIsSearchModalOpen={setIsSearchModalOpen}
            />
          </div>

          {/* Lista de fornecedores */}
          <div className="fornec-panel-lista">
            <ListaFornecedores
              fornecedoresFiltrados={fornecedoresFiltrados}
              filterQuery={filterQuery}
              setFilterQuery={q => {
                setFilterQuery(q);
                setError('');
                setSuccessMessage('');
              }}
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
            />
          </div>
        </div>
      </div>

      {/* Modal de busca de clientes/acionistas — idêntico à TelaConfiguracao */}
      {isSearchModalOpen && (
        <BuscaClienteModal onClose={() => setIsSearchModalOpen(false)} />
      )}
    </>
  );
}
