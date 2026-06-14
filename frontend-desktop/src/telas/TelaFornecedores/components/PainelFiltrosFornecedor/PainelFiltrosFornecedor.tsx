import { Search, Printer, LogOut, FileDown } from 'lucide-react';
import { useCallback } from 'react';
import './PainelFiltrosFornecedor.css';

interface PainelFiltrosFornecedorProps {
  totalFornecedores: number;
  
  // Estados de Filtros
  filterNome: string;
  setFilterNome: (val: string) => void;
  filterCnpj: string;
  setFilterCnpj: (val: string) => void;
  filterTelefone: string;
  setFilterTelefone: (val: string) => void;
  filterEmail: string;
  setFilterEmail: (val: string) => void;

  // Ações
  onFechar: () => void;
}

export function PainelFiltrosFornecedor({
  totalFornecedores,
  filterNome,
  setFilterNome,
  filterCnpj,
  setFilterCnpj,
  filterTelefone,
  setFilterTelefone,
  filterEmail,
  setFilterEmail,
  onFechar
}: PainelFiltrosFornecedorProps) {

  const formatCnpj = useCallback((val: string): string => {
    const digits = val.replace(/\D/g, '');
    if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
  }, []);

  const formatPhone = useCallback((val: string): string => {
    const digits = val.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  }, []);

  const handleExport = () => {
    alert('Exportação de fornecedores iniciada (simulada).');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="painel-filtros-fornec-container">
      {/* Header com totalizador */}
      <div className="filtros-fornec-header">
        <h3 className="filtros-fornec-title">Fornecedores:</h3>
        <span className="filtros-fornec-counter">{totalFornecedores}</span>
      </div>

      {/* Inputs de Pesquisa */}
      <div className="filtros-fornec-fields-list">
        <div className="field-item">
          <label className="field-label">Nome / Fantasia:</label>
          <input
            type="text"
            className="nino-input"
            value={filterNome}
            onChange={e => setFilterNome(e.target.value)}
          />
        </div>

        <div className="field-item">
          <label className="field-label">CNPJ:</label>
          <input
            type="text"
            className="nino-input"
            placeholder="Digite o CNPJ"
            value={filterCnpj}
            onChange={e => setFilterCnpj(formatCnpj(e.target.value))}
          />
        </div>

        <div className="field-item">
          <label className="field-label">Telefone:</label>
          <input
            type="text"
            className="nino-input"
            placeholder="(__) ____-____"
            value={filterTelefone}
            onChange={e => setFilterTelefone(formatPhone(e.target.value))}
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
      </div>

      {/* Botões de Ações Verticais */}
      <div className="filtros-fornec-actions-grid">
        <button
          type="button"
          className="filtro-fornec-action-btn"
          title="Pesquisar fornecedores"
        >
          <Search size={18} />
          Pesquisar
        </button>

        <button
          type="button"
          className="filtro-fornec-action-btn"
          onClick={handlePrint}
          title="Imprimir relatório de fornecedores"
        >
          <Printer size={18} />
          Imprimir
        </button>

        <button
          type="button"
          className="filtro-fornec-action-btn close-fornec-btn"
          onClick={onFechar}
          title="Fechar tela de fornecedores"
        >
          <LogOut size={18} />
          Fechar
        </button>

        <button
          type="button"
          className="filtro-fornec-action-btn"
          onClick={handleExport}
          title="Exportar fornecedores para CSV"
        >
          <FileDown size={18} />
          Exportar
        </button>
      </div>
    </div>
  );
}
