import { User, Building2, FolderOpen, Eraser } from 'lucide-react';
import { useSubBasicoCliente } from './SubBasicoClienteState';
import './SubBasicoCliente.css';

interface SubBasicoClienteProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  logoUrl: string | null;
  setLogoUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

export function formatPhone(val: string): string {
  const digits = val.replace(/\D/g, '');
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

export function SubBasicoCliente({
  formData,
  setFormData,
  logoUrl,
  setLogoUrl
}: SubBasicoClienteProps) {
  const { fileInputRef, triggerLogoUpload, handleLogoUpload, clearLogo } = useSubBasicoCliente({
    setFormData,
    setLogoUrl
  });

  const isFisica = formData.type === 'Física';

  return (
    <div className="cliente-basico-grid">
      {/* Upload de Imagem do Cliente */}
      <div className="cliente-avatar-upload" onClick={triggerLogoUpload}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleLogoUpload}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <div className="avatar-placeholder">
          {logoUrl ? (
            <img src={logoUrl} alt="Foto do cliente" className="avatar-preview" />
          ) : isFisica ? (
            <User size={64} />
          ) : (
            <Building2 size={64} />
          )}
        </div>
        <div className="avatar-actions">
          <button
            type="button"
            className="avatar-action-btn"
            title="Upload da foto"
            onClick={e => {
              e.stopPropagation();
              triggerLogoUpload();
            }}
          >
            <FolderOpen size={14} />
          </button>
          <button
            type="button"
            className="avatar-action-btn"
            title="Remover foto"
            onClick={e => {
              e.stopPropagation();
              clearLogo();
            }}
          >
            <Eraser size={14} />
          </button>
        </div>
      </div>

      {/* Campos de Dados Básicos */}
      <div className="cliente-basico-fields">
        {isFisica ? (
          <>
            {/* Nome Completo */}
            <div className="field-row">
              <div className="field-item flex-1">
                <label className="field-label">Nome completo <span style={{ color: 'var(--danger)' }}>*</span>:</label>
                <input
                  type="text"
                  className="nino-input"
                  value={formData.name || ''}
                  onChange={e => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
                />
              </div>
            </div>

            {/* Tipo de Pessoa, Gênero e Telefone */}
            <div className="field-row">
              <div className="field-item flex-1">
                <label className="field-label">Tipo de pessoa:</label>
                <select
                  className="nino-input"
                  value={formData.type}
                  onChange={e => setFormData((prev: any) => ({ ...prev, type: e.target.value }))}
                >
                  <option value="Física">Física</option>
                  <option value="Jurídica">Jurídica</option>
                </select>
              </div>

              <div className="field-item flex-1">
                <label className="field-label">Gênero:</label>
                <select
                  className="nino-input"
                  value={formData.gender || ''}
                  onChange={e => setFormData((prev: any) => ({ ...prev, gender: e.target.value }))}
                >
                  <option value="">Selecione...</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div className="field-item w-200">
                <label className="field-label">Telefone:</label>
                <input
                  type="text"
                  className="nino-input"
                  placeholder="(__) ____-____"
                  value={formData.phone || ''}
                  onChange={e => setFormData((prev: any) => ({ ...prev, phone: formatPhone(e.target.value) }))}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Fantasia e Razão Social */}
            <div className="field-row">
              <div className="field-item flex-1">
                <label className="field-label">Fantasia <span style={{ color: 'var(--danger)' }}>*</span>:</label>
                <input
                  type="text"
                  className="nino-input"
                  value={formData.tradingName || ''}
                  onChange={e => setFormData((prev: any) => ({ ...prev, tradingName: e.target.value }))}
                />
              </div>
              <div className="field-item flex-1">
                <label className="field-label">Razão social <span style={{ color: 'var(--danger)' }}>*</span>:</label>
                <input
                  type="text"
                  className="nino-input"
                  value={formData.companyName || ''}
                  onChange={e => setFormData((prev: any) => ({ ...prev, companyName: e.target.value }))}
                />
              </div>
            </div>

            {/* Tipo de Pessoa e Telefone */}
            <div className="field-row">
              <div className="field-item flex-1">
                <label className="field-label">Tipo de pessoa:</label>
                <select
                  className="nino-input"
                  value={formData.type}
                  onChange={e => setFormData((prev: any) => ({ ...prev, type: e.target.value }))}
                >
                  <option value="Física">Física</option>
                  <option value="Jurídica">Jurídica</option>
                </select>
              </div>

              <div className="field-item w-200">
                <label className="field-label">Telefone:</label>
                <input
                  type="text"
                  className="nino-input"
                  placeholder="(__) ____-____"
                  value={formData.phone || ''}
                  onChange={e => setFormData((prev: any) => ({ ...prev, phone: formatPhone(e.target.value) }))}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
