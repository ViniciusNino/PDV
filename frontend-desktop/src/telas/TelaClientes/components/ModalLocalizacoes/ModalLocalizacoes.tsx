import { X, User, Building2, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Cliente } from '../../TelaClientesState';
import { useModalLocalizacoes } from './ModalLocalizacoesState';
import './ModalLocalizacoes.css';

interface ModalLocalizacoesProps {
  cliente: Cliente;
  onClose: () => void;
}

const ESTADOS_BRASIL = [
  { sigla: '', nome: 'Selecione...' },
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' }
];

export function ModalLocalizacoes({ cliente, onClose }: ModalLocalizacoesProps) {
  const {
    localizacoes,
    selectedLocId,
    setSelectedLocId,
    locData,
    setLocData,
    error,
    success,
    handleSalvarLoc,
    handleExcluirLoc,
    handleLimparLoc,
    handleCepLocSearch
  } = useModalLocalizacoes({ clienteId: cliente.id });

  const isFisica = cliente.type === 'Física';
  const nomeCliente = isFisica ? cliente.name : cliente.tradingName;

  return (
    <div className="loc-modal-overlay" onClick={onClose}>
      <div className="loc-modal-container" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="loc-modal-header">
          <h3>Cadastro de Localizações</h3>
          <button onClick={onClose} className="loc-modal-close-btn" title="Fechar">
            <X size={16} />
          </button>
        </div>

        {/* Info do Cliente */}
        <div className="loc-modal-client-info">
          <div className="loc-client-avatar">
            {cliente.logoUrl ? (
              <img src={cliente.logoUrl} alt="Foto do cliente" />
            ) : isFisica ? (
              <User size={24} />
            ) : (
              <Building2 size={24} />
            )}
          </div>
          <div className="loc-client-details">
            <span className="loc-client-name">{nomeCliente}</span>
            <div className="loc-client-meta">
              {cliente.email && (
                <span>
                  <strong>E-mail:</strong> {cliente.email}
                </span>
              )}
              {cliente.phone && (
                <span>
                  <strong>Fone:</strong> {cliente.phone}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Corpo do Modal */}
        <div className="loc-modal-body">
          {/* Alertas */}
          {error && (
            <div className="loc-modal-alert error">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="loc-modal-alert success">
              <CheckCircle2 size={14} />
              <span>{success}</span>
            </div>
          )}

          {/* Form de Endereço */}
          <div className="loc-form-area">
            {/* Linha 1: CEP, Estado, Cidade, Bairro */}
            <div className="field-row">
              <div className="field-item w-150">
                <label className="field-label">CEP:</label>
                <input
                  type="text"
                  className="nino-input"
                  placeholder="_____-___"
                  value={locData.cep}
                  onChange={e => handleCepLocSearch(e.target.value)}
                />
              </div>

              <div className="field-item flex-1">
                <label className="field-label">Estado:</label>
                <select
                  className="nino-input"
                  value={locData.state}
                  onChange={e => setLocData(prev => ({ ...prev, state: e.target.value }))}
                >
                  {ESTADOS_BRASIL.map(est => (
                    <option key={est.sigla} value={est.sigla}>
                      {est.sigla ? `${est.sigla} - ${est.nome}` : est.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field-item flex-1">
                <label className="field-label">Cidade:</label>
                <input
                  type="text"
                  className="nino-input"
                  value={locData.city}
                  onChange={e => setLocData(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>

              <div className="field-item flex-1">
                <label className="field-label">Bairro:</label>
                <input
                  type="text"
                  className="nino-input"
                  value={locData.neighborhood}
                  onChange={e => setLocData(prev => ({ ...prev, neighborhood: e.target.value }))}
                />
              </div>
            </div>

            {/* Linha 2: Tipo de localização, Logradouro, Número */}
            <div className="field-row">
              <div className="field-item w-150">
                <label className="field-label">Tipo de localização:</label>
                <select
                  className="nino-input"
                  value={locData.locationType}
                  onChange={e => setLocData(prev => ({ ...prev, locationType: e.target.value }))}
                >
                  <option value="Casa">Casa</option>
                  <option value="Apartamento">Apartamento</option>
                  <option value="Comercial">Comercial</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div className="field-item flex-3">
                <label className="field-label">Logradouro <span style={{ color: 'var(--danger)' }}>*</span>:</label>
                <input
                  type="text"
                  className="nino-input"
                  placeholder="Rua, Avenida, etc."
                  value={locData.street}
                  onChange={e => setLocData(prev => ({ ...prev, street: e.target.value }))}
                />
              </div>

              <div className="field-item w-150">
                <label className="field-label">Número:</label>
                <input
                  type="text"
                  className="nino-input"
                  value={locData.number}
                  onChange={e => setLocData(prev => ({ ...prev, number: e.target.value }))}
                />
              </div>
            </div>

            {/* Linha 3: Complemento, Ponto de Referência */}
            <div className="field-row">
              <div className="field-item flex-1">
                <label className="field-label">Complemento:</label>
                <input
                  type="text"
                  className="nino-input"
                  value={locData.complement}
                  onChange={e => setLocData(prev => ({ ...prev, complement: e.target.value }))}
                />
              </div>

              <div className="field-item flex-1">
                <label className="field-label">Ponto de referência:</label>
                <input
                  type="text"
                  className="nino-input"
                  value={locData.referencePoint}
                  onChange={e => setLocData(prev => ({ ...prev, referencePoint: e.target.value }))}
                />
              </div>
            </div>

            {/* Linha 4: Apelido e Habilitar Endereço */}
            <div className="field-row" style={{ alignItems: 'flex-end', marginTop: '4px' }}>
              <div className="field-item flex-1">
                <label className="field-label">Apelido <span style={{ color: 'var(--danger)' }}>*</span>:</label>
                <input
                  type="text"
                  className="nino-input"
                  placeholder="Ex: Trabalho, Casa, Praia"
                  value={locData.apelido}
                  onChange={e => setLocData(prev => ({ ...prev, apelido: e.target.value }))}
                />
              </div>

              <div className="field-item" style={{ paddingBottom: '8px' }}>
                <label className="filtros-checkbox-row">
                  <input
                    type="checkbox"
                    checked={locData.enabled}
                    onChange={e => setLocData(prev => ({ ...prev, enabled: e.target.checked }))}
                  />
                  <span className="filtros-checkbox-label">Habilitar endereço</span>
                </label>
              </div>
            </div>
          </div>

          {/* Barra de Ações do Modal */}
          <div className="loc-actions-bar">
            <button
              type="button"
              className="loc-btn primary"
              onClick={handleSalvarLoc}
            >
              {selectedLocId ? 'Salvar' : 'Cadastrar'}
            </button>
            <button
              type="button"
              className="loc-btn"
              onClick={handleLimparLoc}
            >
              {selectedLocId ? 'Cancelar' : 'Limpar'}
            </button>
            <button
              type="button"
              className="loc-btn danger"
              disabled={!selectedLocId}
              onClick={() => handleExcluirLoc()}
            >
              Excluir
            </button>
          </div>

          {/* Tabela de Localizações */}
          <div className="loc-table-wrapper">
            {localizacoes.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                Nenhum endereço secundário cadastrado.
              </div>
            ) : (
              <table className="loc-table">
                <thead>
                  <tr>
                    <th>Apelido</th>
                    <th>CEP</th>
                    <th>Bairro</th>
                    <th>Logradouro</th>
                    <th>Número</th>
                    <th>Tipo</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {localizacoes.map(loc => (
                    <tr
                      key={loc.id}
                      className={selectedLocId === loc.id ? 'selected' : ''}
                      onClick={() => setSelectedLocId(selectedLocId === loc.id ? null : loc.id)}
                    >
                      <td>{loc.apelido}</td>
                      <td>{loc.cep || '-'}</td>
                      <td>{loc.neighborhood || '-'}</td>
                      <td>{loc.street || '-'}</td>
                      <td>{loc.number || '-'}</td>
                      <td>{loc.locationType}</td>
                      <td style={{ color: loc.enabled ? 'var(--accent)' : 'var(--danger)' }}>
                        {loc.enabled ? 'Ativo' : 'Inativo'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
