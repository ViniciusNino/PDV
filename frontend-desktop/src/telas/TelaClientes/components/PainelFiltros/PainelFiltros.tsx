import { Search, Printer, LogOut, FileDown } from 'lucide-react';
import { usePainelFiltros } from './PainelFiltrosState';
import './PainelFiltros.css';

interface PainelFiltrosProps {
  totalClientes: number;
  
  // Estados de Filtros
  filterNome: string;
  setFilterNome: (val: string) => void;
  filterCpfCnpj: string;
  setFilterCpfCnpj: (val: string) => void;
  filterTelefone: string;
  setFilterTelefone: (val: string) => void;
  filterEmail: string;
  setFilterEmail: (val: string) => void;
  filterGenero: string;
  setFilterGenero: (val: string) => void;
  filterSomenteAniversariantes: boolean;
  setFilterSomenteAniversariantes: (val: boolean) => void;

  // Ações
  onFechar: () => void;
}

export function PainelFiltros({
  totalClientes,
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
  onFechar
}: PainelFiltrosProps) {
  const { formatCpfCnpj, formatPhoneFilter } = usePainelFiltros();

  const handleExport = () => {
    alert('Exportação de dados iniciada (simulada).');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="painel-filtros-container">
      {/* Header com totalizador */}
      <div className="filtros-header">
        <h3 className="filtros-title">Clientes:</h3>
        <span className="filtros-counter">{totalClientes}</span>
      </div>

      {/* Inputs de Pesquisa */}
      <div className="filtros-fields-list">
        <div className="field-item">
          <label className="field-label">Nome do cliente:</label>
          <input
            type="text"
            className="nino-input"
            value={filterNome}
            onChange={e => setFilterNome(e.target.value)}
          />
        </div>

        <div className="field-item">
          <label className="field-label">CPF/CNPJ:</label>
          <input
            type="text"
            className="nino-input"
            placeholder="Digite CPF ou CNPJ"
            value={filterCpfCnpj}
            onChange={e => setFilterCpfCnpj(formatCpfCnpj(e.target.value))}
          />
        </div>

        <div className="field-item">
          <label className="field-label">Telefone:</label>
          <input
            type="text"
            className="nino-input"
            placeholder="(__) ____-____"
            value={filterTelefone}
            onChange={e => setFilterTelefone(formatPhoneFilter(e.target.value))}
          />
        </div>

        <div className="field-item">
          <label className="field-label">E-mail:</label>
          <input
            type="text"
            className="nino-input"
            value={filterEmail}
            onChange={e => setFilterEmail(e.target.value)}
          />
        </div>

        <div className="field-item">
          <label className="field-label">Gênero:</label>
          <select
            className="nino-input"
            value={filterGenero}
            onChange={e => setFilterGenero(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
          </select>
        </div>

        <label className="filtros-checkbox-row">
          <input
            type="checkbox"
            checked={filterSomenteAniversariantes}
            onChange={e => setFilterSomenteAniversariantes(e.target.checked)}
          />
          <span className="filtros-checkbox-label">Somente aniversariantes</span>
        </label>
      </div>

      {/* Botões de Ações Verticais */}
      <div className="filtros-actions-grid">
        <button
          type="button"
          className="filtro-action-btn"
          title="Pesquisar clientes"
        >
          <Search size={18} />
          Pesquisar
        </button>

        <button
          type="button"
          className="filtro-action-btn"
          onClick={handlePrint}
          title="Imprimir relatório de clientes"
        >
          <Printer size={18} />
          Imprimir
        </button>

        <button
          type="button"
          className="filtro-action-btn close-btn"
          onClick={onFechar}
          title="Fechar tela de clientes"
        >
          <LogOut size={18} />
          Fechar
        </button>

        <button
          type="button"
          className="filtro-action-btn"
          onClick={handleExport}
          title="Exportar clientes para CSV"
        >
          <FileDown size={18} />
          Exportar
        </button>
      </div>
    </div>
  );
}
