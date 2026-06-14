import { Pencil, Trash2 } from 'lucide-react';
import type { Fornecedor } from '../../TelaFornecedoresState';
import { useListaFornecedores } from './ListaFornecedoresState';
import './ListaFornecedores.css';

interface ListaFornecedoresProps {
  fornecedoresFiltrados: Fornecedor[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  onEditar: (id?: string) => void;
  onExcluir: (id?: string) => void;
}

export function ListaFornecedores({
  fornecedoresFiltrados,
  selectedId,
  setSelectedId,
  onEditar,
  onExcluir,
}: ListaFornecedoresProps) {
  const { handleRowClick, handleRowDoubleClick } = useListaFornecedores({
    selectedId,
    setSelectedId,
  });

  return (
    <>
      {/* Tabela */}
      <div className="lista-fornec-table-wrapper">
        {fornecedoresFiltrados.length === 0 ? (
          <div className="lista-fornec-empty">
            <span className="lista-fornec-empty-icon">🚚</span>
            <span>Nenhum fornecedor cadastrado ou encontrado com os filtros.</span>
          </div>
        ) : (
          <table className="lista-fornec-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Fantasia</th>
                <th>Razão Social</th>
                <th>CNPJ</th>
                <th>Telefone</th>
                <th>Cidade / UF</th>
                <th style={{ textAlign: 'center', width: '100px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {fornecedoresFiltrados.map((f, idx) => (
                <tr
                  key={f.id}
                  className={selectedId === f.id ? 'selected' : ''}
                  onClick={() => handleRowClick(f.id)}
                  onDoubleClick={() => handleRowDoubleClick(f.id, onEditar)}
                  title="Clique para selecionar · Duplo clique para editar"
                >
                  <td>{idx + 1}</td>
                  <td>{f.tradingName || '—'}</td>
                  <td>{f.companyName || '—'}</td>
                  <td>{f.cnpj || '—'}</td>
                  <td>{f.phone || '—'}</td>
                  <td>
                    {f.city
                      ? `${f.city}${f.state ? ` / ${f.state}` : ''}`
                      : '—'}
                  </td>
                  <td style={{ textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                    <div className="lista-fornec-actions">
                      <button
                        type="button"
                        className="action-btn edit-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditar(f.id);
                        }}
                        title="Editar"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        className="action-btn delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onExcluir(f.id);
                        }}
                        title="Excluir"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Rodapé */}
      <div className="lista-fornec-footer">
        {fornecedoresFiltrados.length} fornecedor
        {fornecedoresFiltrados.length !== 1 ? 'es' : ''} exibido
        {fornecedoresFiltrados.length !== 1 ? 's' : ''}
      </div>
    </>
  );
}
