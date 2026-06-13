import { Image as ImageIcon, FolderOpen, Eraser } from 'lucide-react';
import type { CompanyConfig } from '../../../TelaConfiguracaoState';
import { formatPhone } from '../../../TelaConfiguracaoState';
import { useSubBasico } from './SubBasicoState';
import './SubBasico.css';

interface SubBasicoProps {
  company: CompanyConfig;
  setCompany: React.Dispatch<React.SetStateAction<CompanyConfig>>;
  logoUrl: string | null;
  setLogoUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

export function SubBasico({ company, setCompany, logoUrl, setLogoUrl }: SubBasicoProps) {
  const { fileInputRef, triggerLogoUpload, handleLogoUpload, clearLogo } = useSubBasico({
    setCompany,
    setLogoUrl
  });

  return (
    <div className="basico-grid" style={{ marginBottom: '1.5rem' }}>
      {/* Upload de Logo */}
      <div className="image-upload-area" onClick={triggerLogoUpload}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleLogoUpload}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <div className="image-placeholder">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo da empresa" className="logo-preview" />
          ) : (
            <ImageIcon size={48} />
          )}
        </div>
        <div className="image-actions">
          <button type="button" className="img-action-btn" title="Upload da imagem" onClick={e => { e.stopPropagation(); triggerLogoUpload(); }}>
            <FolderOpen size={16} />
          </button>
          <button type="button" className="img-action-btn" title="Limpar imagem" onClick={e => { e.stopPropagation(); clearLogo(); }}>
            <Eraser size={16} />
          </button>
        </div>
      </div>

      {/* Campos principais */}
      <div className="basico-fields">
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="field-group" style={{ flex: 1 }}>
            <label>Fantasia <span style={{ color: '#ff4a4a' }}>*</span>:</label>
            <input
              type="text"
              value={company.tradingName}
              onChange={e => setCompany({ ...company, tradingName: e.target.value })}
            />
          </div>
          <div className="field-group" style={{ flex: 1 }}>
            <label>Razão social <span style={{ color: '#ff4a4a' }}>*</span>:</label>
            <input
              type="text"
              value={company.companyName}
              onChange={e => setCompany({ ...company, companyName: e.target.value })}
            />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div className="field-group" style={{ width: '200px' }}>
            <label>Telefone <span style={{ color: '#ff4a4a' }}>*</span>:</label>
            <input
              type="tel"
              placeholder="(__) ____-____"
              value={company.phone || ''}
              onChange={e => setCompany({ ...company, phone: formatPhone(e.target.value) })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
