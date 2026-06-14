import { useSubDocumentosCliente } from './SubDocumentosClienteState';
import './SubDocumentosCliente.css';

interface SubDocumentosClienteProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const MESES = [
  'Não informado',
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
];

export function SubDocumentosCliente({ formData, setFormData }: SubDocumentosClienteProps) {
  const { formatCpf, formatCnpj } = useSubDocumentosCliente();
  const isFisica = formData.type === 'Física';

  return (
    <div className="subtab-documentos">
      {isFisica ? (
        <>
          {/* CPF e RG */}
          <div className="documentos-row">
            <div className="field-item flex-1">
              <label className="field-label">CPF:</label>
              <input
                type="text"
                className="nino-input"
                placeholder="___.___.___-__"
                value={formData.cpf || ''}
                onChange={e => setFormData((prev: any) => ({ ...prev, cpf: formatCpf(e.target.value) }))}
              />
            </div>
            <div className="field-item flex-1">
              <label className="field-label">RG:</label>
              <input
                type="text"
                className="nino-input"
                value={formData.rg || ''}
                onChange={e => setFormData((prev: any) => ({ ...prev, rg: e.target.value }))}
              />
            </div>
          </div>

          {/* Aniversário */}
          <div className="documentos-row" style={{ marginTop: '0.5rem' }}>
            <div className="field-item flex-1">
              <span className="birthday-title">Data de aniversário</span>
              <div className="birthday-container">
                <div style={{ width: '80px' }}>
                  <label className="field-label" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Dia:</label>
                  <input
                    type="number"
                    min="0"
                    max="31"
                    className="nino-input"
                    value={formData.birthDay || 0}
                    onChange={e => setFormData((prev: any) => ({ ...prev, birthDay: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="flex-1">
                  <label className="field-label" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Mês:</label>
                  <select
                    className="nino-input"
                    value={formData.birthMonth || 'Não informado'}
                    onChange={e => setFormData((prev: any) => ({ ...prev, birthMonth: e.target.value }))}
                  >
                    {MESES.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {/* Espaço em branco para manter alinhamento em grid */}
            <div className="flex-1"></div>
          </div>
        </>
      ) : (
        <>
          {/* CNPJ e IE */}
          <div className="documentos-row">
            <div className="field-item flex-1">
              <label className="field-label">CNPJ:</label>
              <input
                type="text"
                className="nino-input"
                placeholder="__.___.___/____-__"
                value={formData.cnpj || ''}
                onChange={e => setFormData((prev: any) => ({ ...prev, cnpj: formatCnpj(e.target.value) }))}
              />
            </div>
            <div className="field-item flex-1">
              <label className="field-label">RG/IE:</label>
              <input
                type="text"
                className="nino-input"
                value={formData.stateRegistration || ''}
                onChange={e => setFormData((prev: any) => ({ ...prev, stateRegistration: e.target.value }))}
              />
            </div>
          </div>

          {/* Data de fundação */}
          <div className="documentos-row" style={{ marginTop: '0.5rem' }}>
            <div className="field-item flex-1">
              <span className="birthday-title">Data de fundação</span>
              <div className="birthday-container">
                <div style={{ width: '80px' }}>
                  <label className="field-label" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Dia:</label>
                  <input
                    type="number"
                    min="0"
                    max="31"
                    className="nino-input"
                    value={formData.birthDay || 0}
                    onChange={e => setFormData((prev: any) => ({ ...prev, birthDay: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="flex-1">
                  <label className="field-label" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Mês:</label>
                  <select
                    className="nino-input"
                    value={formData.birthMonth || 'Não informado'}
                    onChange={e => setFormData((prev: any) => ({ ...prev, birthMonth: e.target.value }))}
                  >
                    {MESES.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex-1"></div>
          </div>
        </>
      )}
    </div>
  );
}
