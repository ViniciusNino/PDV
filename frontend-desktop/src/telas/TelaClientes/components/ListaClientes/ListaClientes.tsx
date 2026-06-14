import type { Cliente } from '../../TelaClientesState';
import './ListaClientes.css';

interface ListaClientesProps {
  clientes: Cliente[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export function ListaClientes({
  clientes,
  selectedId,
  setSelectedId
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
