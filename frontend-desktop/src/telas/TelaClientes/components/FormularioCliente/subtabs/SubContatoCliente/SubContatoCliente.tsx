import { useSubContatoCliente } from './SubContatoClienteState';
import './SubContatoCliente.css';

interface SubContatoClienteProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  entityType?: 'cliente' | 'fornecedor';
}

export function SubContatoCliente({
  formData,
  setFormData,
  entityType = 'cliente'
}: SubContatoClienteProps) {
  const { formatCellphone } = useSubContatoCliente();

  return (
    <div className="subtab-contato">
      <div className="contato-row">
        <div className="field-item flex-2">
          <label className="field-label">E-mail:</label>
          <input
            type="email"
            className="nino-input"
            placeholder="nome@email.com"
            value={formData.email || ''}
            onChange={e => setFormData((prev: any) => ({ ...prev, email: e.target.value }))}
          />
        </div>
        <div className="field-item flex-1">
          <label className="field-label">Celular:</label>
          <input
            type="text"
            className="nino-input"
            placeholder="(__) _____-____"
            value={formData.cellphone || ''}
            onChange={e => setFormData((prev: any) => ({ ...prev, cellphone: formatCellphone(e.target.value) }))}
          />
        </div>
      </div>

      {entityType === 'fornecedor' && (
        <div className="contato-row" style={{ marginTop: '0.75rem' }}>
          <div className="field-item flex-1">
            <label className="field-label">Login:</label>
            <input
              type="text"
              className="nino-input"
              placeholder="Usuário de acesso"
              value={formData.login || ''}
              onChange={e => setFormData((prev: any) => ({ ...prev, login: e.target.value }))}
            />
          </div>
          <div className="field-item flex-1">
            <label className="field-label">Senha:</label>
            <input
              type="password"
              className="nino-input"
              placeholder="Senha de acesso"
              value={formData.password || ''}
              onChange={e => setFormData((prev: any) => ({ ...prev, password: e.target.value }))}
            />
          </div>
        </div>
      )}
    </div>
  );
}
