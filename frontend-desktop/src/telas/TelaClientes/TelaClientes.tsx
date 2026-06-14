import { Users, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useTelaClientes } from './TelaClientesState';
import { PainelFiltros } from './components/PainelFiltros/PainelFiltros';
import { FormularioCliente } from './components/FormularioCliente/FormularioCliente';
import { ListaClientes } from './components/ListaClientes/ListaClientes';
import { ModalLocalizacoes } from './components/ModalLocalizacoes/ModalLocalizacoes';
import './TelaClientes.css';

interface TelaClientesProps {
  onClose: () => void;
  isWindowMode?: boolean;
}

export function TelaClientes({ onClose, isWindowMode = false }: TelaClientesProps) {
  const {
    clientesFiltrados,
    selectedId,
    setSelectedId,
    formData,
    setFormData,
    logoUrl,
    setLogoUrl,
    activeSubTab,
    setActiveSubTab,
    error,
    successMessage,
    showEndereco,
    setShowEndereco,
    isLocalizacoesOpen,
    setIsLocalizacoesOpen,
    
    // Filtros
    filterNome,
    setFilterNome,
    filterCpfCnpj,
    setFilterCpfCnpj,
    filterTelefone,
    setFilterTelefone,
    filterEmail,
    setFilterEmail,
    filterGenero,
    setFilterGenero,
    filterSomenteAniversariantes,
    setFilterSomenteAniversariantes,

    // CRUD
    handleNovo,
    handleEditar,
    handleSalvar,
    handleExcluir,
    handleCancelar
  } = useTelaClientes();

  const clienteSelecionado = selectedId
    ? clientesFiltrados.find(c => c.id === selectedId)
    : null;

  return (
    <>
      <div className="clientes-window-card animate-fade-in" style={{ position: 'relative' }}>
        {/* Header principal da MDI (caso não renderizado no container geral) */}
        {!isWindowMode && (
          <div className="clientes-window-header">
            <div className="clientes-header-title">
              <Users size={16} />
              <h2>Cadastro de Clientes</h2>
            </div>
            <button onClick={onClose} className="clientes-header-close" title="Fechar">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Notificações Flutuantes */}
        {error && (
          <div className="clientes-alert error">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}
        {successMessage && (
          <div className="clientes-alert success">
            <CheckCircle2 size={15} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Corpo principal em duas colunas */}
        <div className="clientes-main-layout">
          {/* Painel esquerdo de filtros */}
          <PainelFiltros
            totalClientes={clientesFiltrados.length}
            filterNome={filterNome}
            setFilterNome={setFilterNome}
            filterCpfCnpj={filterCpfCnpj}
            setFilterCpfCnpj={setFilterCpfCnpj}
            filterTelefone={filterTelefone}
            setFilterTelefone={setFilterTelefone}
            filterEmail={filterEmail}
            setFilterEmail={setFilterEmail}
            filterGenero={filterGenero}
            setFilterGenero={setFilterGenero}
            filterSomenteAniversariantes={filterSomenteAniversariantes}
            setFilterSomenteAniversariantes={setFilterSomenteAniversariantes}
            onFechar={onClose}
          />

          {/* Painel direito com formulário e listagem */}
          <div className="clientes-content-right">
            {/* Formulário no Topo */}
            <div className="clientes-form-panel">
              <FormularioCliente
                formData={formData}
                setFormData={setFormData}
                logoUrl={logoUrl}
                setLogoUrl={setLogoUrl}
                activeSubTab={activeSubTab}
                setActiveSubTab={setActiveSubTab}
                showEndereco={showEndereco}
                setShowEndereco={setShowEndereco}
                selectedId={selectedId}
                onNovo={handleNovo}
                onSalvar={handleSalvar}
                onCancelar={handleCancelar}
                onExcluir={() => handleExcluir()}
                setIsLocalizacoesOpen={setIsLocalizacoesOpen}
              />
            </div>

            {/* Listagem na base */}
            <div className="clientes-list-panel">
              <ListaClientes
                clientes={clientesFiltrados}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                onEditar={handleEditar}
                onExcluir={handleExcluir}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Múltiplos Endereços */}
      {isLocalizacoesOpen && clienteSelecionado && (
        <ModalLocalizacoes
          cliente={clienteSelecionado}
          onClose={() => setIsLocalizacoesOpen(false)}
        />
      )}
    </>
  );
}
export default TelaClientes;
