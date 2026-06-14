import { Pencil, Trash2 } from 'lucide-react';
import type { Cliente } from '../../TelaClientesState';
import './ListaClientes.css';

interface ListaClientesProps {
  clientes: Cliente[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  onEditar: (id?: string) => void;
  onExcluir: (id?: string) => void;
}

export function ListaClientes({
  clientes,
  selectedId,
  setSelectedId,
  onEditar,
  onExcluir,
}: ListaClientesProps) {
  
  const getAniversarioFormatado = (c: Cliente) => {
    if (!c.birthDay || c.birthMonth === 'Não informado') {
      return 'Não informado';
    }
    return `${c.birthDay} de ${c.birthMonth}`;
  };

  return (
    <div className="lista-clientes-wrapper">
      <div className="lista-clientes-table-container">
        {clientes.length === 0 ? (
          <div className="lista-clientes-empty">
            <span className="lista-clientes-empty-icon">👥</span>
            <span>Nenhum cliente cadastrado ou encontrado com os filtros.</span>
          </div>
        ) : (
          <table className="lista-clientes-table">
            <thead>
              <tr>
                <th>Nome/Fantasia</th>
                <th>Telefone</th>
                <th>Celular</th>
                <th>E-mail</th>
                <th>Aniversário/Fundação</th>
                <th>CPF/CNPJ</th>
                <th>RG/IE</th>
                <th>Gênero</th>
                <th>Data de cadastro</th>
                <th style={{ textAlign: 'center', width: '100px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(c => {
                const nomeExibido = c.type === 'Física' ? c.name : c.tradingName;
                const documento = c.type === 'Física' ? c.cpf : c.cnpj;
                const registro = c.type === 'Física' ? c.rg : c.stateRegistration;
                const generoExibido = c.type === 'Física' ? (c.gender || 'Não informado') : 'Empresa';

                return (
                  <tr
                    key={c.id}
                    className={selectedId === c.id ? 'selected' : ''}
                    onClick={() => setSelectedId(selectedId === c.id ? null : c.id)}
                    onDoubleClick={() => onEditar(c.id)}
                    title="Clique para selecionar · Duplo clique para editar"
                  >
                    <td>{nomeExibido || 'Sem nome'}</td>
                    <td>{c.phone || '-'}</td>
                    <td>{c.cellphone || '-'}</td>
                    <td>{c.email || '-'}</td>
                    <td>{getAniversarioFormatado(c)}</td>
                    <td>{documento || '-'}</td>
                    <td>{registro || '-'}</td>
                    <td>{generoExibido}</td>
                    <td>{c.createdAt || '-'}</td>
                    <td style={{ textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                      <div className="lista-clientes-actions">
                        <button
                          type="button"
                          className="action-btn edit-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditar(c.id);
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
                            onExcluir(c.id);
                          }}
                          title="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="lista-clientes-footer">
        Total exibido: {clientes.length} registro(s)
      </div>
    </div>
  );
}
