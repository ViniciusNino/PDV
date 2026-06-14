import { useSubEnderecoCliente } from './SubEnderecoClienteState';
import './SubEnderecoCliente.css';

interface SubEnderecoClienteProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  showEndereco: boolean;
  setShowEndereco: (show: boolean) => void;
  selectedId: string | null;
  onNovo?: () => void;
  onSalvar?: () => void;
  onCancelar?: () => void;
  onExcluir?: () => void;
  setIsLocalizacoesOpen?: (open: boolean) => void;
  entityType?: 'cliente' | 'fornecedor';
  showActions?: boolean;
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

export function SubEnderecoCliente({
  formData,
  setFormData,
  showEndereco,
  setShowEndereco,
  selectedId,
  onNovo,
  onSalvar,
  onCancelar,
  onExcluir,
  setIsLocalizacoesOpen,
  entityType = 'cliente',
  showActions = true
}: SubEnderecoClienteProps) {
  const { handleCepSearch } = useSubEnderecoCliente({ setFormData });

  const isEditMode = !!selectedId;

  return (
    <div className="cliente-endereco-secao">
      {/* Barra de Ferramentas / Cabeçalho de Endereço */}
      <div className="endereco-toolbar">
        <div className="endereco-toolbar-left">
          <span className="endereco-label">Endereço</span>
          <button
            type="button"
            className="endereco-toggle-btn"
            onClick={() => setShowEndereco(!showEndereco)}
          >
            {showEndereco ? 'Esconder endereço' : 'Exibir endereço'}
          </button>
        </div>

        {/* Ações do Cadastro (Cadastrar/Salvar, Editar/Cancelar, Excluir) */}
        {showActions && (
          <div className="endereco-actions-right">
            {entityType === 'cliente' && (
              <button
                type="button"
                className="endereco-btn"
                onClick={() => setIsLocalizacoesOpen?.(true)}
                disabled={!selectedId}
                title={selectedId ? 'Ver múltiplos endereços' : 'Salve o cliente primeiro para gerenciar localizações'}
              >
                Outros endereços
              </button>
            )}
            
            <button
              type="button"
              className="endereco-btn primary"
              onClick={onSalvar}
            >
              {isEditMode ? 'Salvar' : 'Cadastrar'}
            </button>

            {isEditMode ? (
              <button
                type="button"
                className="endereco-btn"
                onClick={onCancelar}
              >
                Cancelar
              </button>
            ) : (
              <button
                type="button"
                className="endereco-btn"
                onClick={onNovo}
              >
                Limpar
              </button>
            )}
          </div>
        )}
      </div>

      {/* Grid de Campos Expansível */}
      {showEndereco && (
        <div className="endereco-fields-grid">
          {/* Linha 1: CEP, Estado, Cidade, Bairro */}
          <div className="field-row">
            <div className="field-item w-150">
              <label className="field-label">CEP:</label>
              <input
                type="text"
                className="nino-input"
                placeholder="_____-___"
                value={formData.cep || ''}
                onChange={e => handleCepSearch(e.target.value)}
              />
            </div>

            <div className="field-item flex-1">
              <label className="field-label">Estado:</label>
              <div className="state-select-container">
                <select
                  className="nino-input"
                  value={formData.state || ''}
                  onChange={e => setFormData((prev: any) => ({ ...prev, state: e.target.value }))}
                  style={{ flex: 1 }}
                >
                  {ESTADOS_BRASIL.map(est => (
                    <option key={est.sigla} value={est.sigla}>
                      {est.sigla ? `${est.sigla} - ${est.nome}` : est.nome}
                    </option>
                  ))}
                </select>
                <button type="button" className="add-state-btn" title="Adicionar Estado">+</button>
              </div>
            </div>

            <div className="field-item flex-1">
              <label className="field-label">Cidade:</label>
              <input
                type="text"
                className="nino-input"
                value={formData.city || ''}
                onChange={e => setFormData((prev: any) => ({ ...prev, city: e.target.value }))}
              />
            </div>

            <div className="field-item flex-1">
              <label className="field-label">Bairro:</label>
              <input
                type="text"
                className="nino-input"
                value={formData.neighborhood || ''}
                onChange={e => setFormData((prev: any) => ({ ...prev, neighborhood: e.target.value }))}
              />
            </div>
          </div>

          {/* Linha 2: Tipo de localização, Logradouro, Número */}
          <div className="field-row">
            <div className="field-item w-150">
              <label className="field-label">Tipo de localização:</label>
              <select
                className="nino-input"
                value={formData.locationType || 'Casa'}
                onChange={e => setFormData((prev: any) => ({ ...prev, locationType: e.target.value }))}
              >
                <option value="Casa">Casa</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Comercial">Comercial</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            <div className="field-item flex-3">
              <label className="field-label">Logradouro:</label>
              <input
                type="text"
                className="nino-input"
                placeholder="Rua, Avenida, etc."
                value={formData.street || ''}
                onChange={e => setFormData((prev: any) => ({ ...prev, street: e.target.value }))}
              />
            </div>

            <div className="field-item w-150">
              <label className="field-label">Número:</label>
              <input
                type="text"
                className="nino-input"
                value={formData.number || ''}
                onChange={e => setFormData((prev: any) => ({ ...prev, number: e.target.value }))}
              />
            </div>
          </div>

          {/* Linha 3: Condomínio, Bloco, Apartamento (apenas para Apartamento e Comercial) */}
          {(formData.locationType === 'Apartamento' || formData.locationType === 'Comercial') && (
            <div className="field-row address-apt-field">
              <div className="field-item flex-2">
                <label className="field-label">Condomínio:</label>
                <input
                  type="text"
                  className="nino-input"
                  value={formData.building || ''}
                  onChange={e => setFormData((prev: any) => ({ ...prev, building: e.target.value }))}
                />
              </div>
              <div className="field-item w-150">
                <label className="field-label">Bloco:</label>
                <input
                  type="text"
                  className="nino-input"
                  value={formData.block || ''}
                  onChange={e => setFormData((prev: any) => ({ ...prev, block: e.target.value }))}
                />
              </div>
              <div className="field-item w-150">
                <label className="field-label">Apartamento:</label>
                <input
                  type="text"
                  className="nino-input"
                  value={formData.apartmentNumber || ''}
                  onChange={e => setFormData((prev: any) => ({ ...prev, apartmentNumber: e.target.value }))}
                />
              </div>
            </div>
          )}

          {/* Linha 4: Complemento, Ponto de referência */}
          <div className="field-row">
            <div className="field-item flex-1">
              <label className="field-label">Complemento:</label>
              <input
                type="text"
                className="nino-input"
                value={formData.complement || ''}
                onChange={e => setFormData((prev: any) => ({ ...prev, complement: e.target.value }))}
              />
            </div>
            <div className="field-item flex-1">
              <label className="field-label">Ponto de referência:</label>
              <input
                type="text"
                className="nino-input"
                value={formData.referencePoint || ''}
                onChange={e => setFormData((prev: any) => ({ ...prev, referencePoint: e.target.value }))}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
