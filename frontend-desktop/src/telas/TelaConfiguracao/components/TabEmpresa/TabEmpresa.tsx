import { 
  Building2, FileText, Phone, Share2, MoreHorizontal, 
  Image as ImageIcon, FolderOpen, Eraser, Search 
} from 'lucide-react';
import type { CompanyConfig } from '../../TelaConfiguracaoState';
import { formatPhone } from '../../TelaConfiguracaoState';
import { useTabEmpresa } from './TabEmpresaState';
import './TabEmpresa.css';

interface TabEmpresaProps {
  company: CompanyConfig;
  setCompany: React.Dispatch<React.SetStateAction<CompanyConfig>>;
  logoUrl: string | null;
  setLogoUrl: React.Dispatch<React.SetStateAction<string | null>>;
  activeSubTab: string;
  setActiveSubTab: (subTab: string) => void;
  setIsSearchModalOpen: (open: boolean) => void;
}

export function TabEmpresa({
  company,
  setCompany,
  logoUrl,
  setLogoUrl,
  activeSubTab,
  setActiveSubTab,
  setIsSearchModalOpen
}: TabEmpresaProps) {
  
  const {
    fileInputRef,
    triggerLogoUpload,
    handleLogoUpload,
    clearLogo,
    handleCepSearch
  } = useTabEmpresa({ company, setCompany, setLogoUrl });

  return (
    <>
      <div className="subtabs">
        <button 
          type="button"
          className={`subtab-btn ${activeSubTab === 'Basico' ? 'active' : ''}`} 
          onClick={() => setActiveSubTab('Basico')}
        >
          <Building2 size={16} /> Basico
        </button>
        <button 
          type="button"
          className={`subtab-btn ${activeSubTab === 'Documentos' ? 'active' : ''}`} 
          onClick={() => setActiveSubTab('Documentos')}
        >
          <FileText size={16} /> Documentos
        </button>
        <button 
          type="button"
          className={`subtab-btn ${activeSubTab === 'Contato' ? 'active' : ''}`} 
          onClick={() => setActiveSubTab('Contato')}
        >
          <Phone size={16} /> Contato
        </button>
        <button 
          type="button"
          className={`subtab-btn ${activeSubTab === 'Social' ? 'active' : ''}`} 
          onClick={() => setActiveSubTab('Social')}
        >
          <Share2 size={16} /> Social
        </button>
        <button 
          type="button"
          className={`subtab-btn ${activeSubTab === 'Outros' ? 'active' : ''}`} 
          onClick={() => setActiveSubTab('Outros')}
        >
          <MoreHorizontal size={16} /> Outros
        </button>
      </div>

      {/* Conteúdo Variante por SubAba */}
      {activeSubTab === 'Basico' && (
        <div className="form-grid" style={{ marginBottom: '1.5rem' }}>
          <div className="image-upload-area">
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
              <button type="button" className="img-action-btn" title="Upload da imagem" onClick={triggerLogoUpload}>
                <FolderOpen size={16} />
              </button>
              <button type="button" className="img-action-btn" title="Limpar imagem" onClick={clearLogo}>
                <Eraser size={16} />
              </button>
            </div>
          </div>
          <div className="form-fields">
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
      )}

      {activeSubTab === 'Documentos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="field-group" style={{ flex: 1 }}>
              <label>CNPJ:</label>
              <input
                type="text"
                placeholder="__.___.___/____-__"
                value={company.cnpj || ''}
                onChange={e => setCompany({ ...company, cnpj: e.target.value })}
              />
            </div>
            <div className="field-group" style={{ flex: 1 }}>
              <label>IE:</label>
              <input
                type="text"
                value={company.stateRegistration || ''}
                onChange={e => setCompany({ ...company, stateRegistration: e.target.value })}
              />
            </div>
            <div className="field-group" style={{ flex: 1 }}>
              <label>IM:</label>
              <input
                type="text"
                value={company.municipalRegistration || ''}
                onChange={e => setCompany({ ...company, municipalRegistration: e.target.value })}
              />
            </div>
          </div>
          <div className="field-group" style={{ width: '300px' }}>
            <label>Data de fundação:</label>
            <input
              type="date"
              className="date-input"
              value={company.foundationDate || ''}
              onChange={e => setCompany({ ...company, foundationDate: e.target.value })}
            />
          </div>
        </div>
      )}

      {activeSubTab === 'Contato' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="field-group" style={{ flex: 1 }}>
              <label>Login:</label>
              <input type="text" disabled placeholder="Admin" />
            </div>
            <div className="field-group" style={{ flex: 1 }}>
              <label>Senha:</label>
              <input type="password" disabled placeholder="******" />
            </div>
            <div className="field-group" style={{ flex: 2 }}>
              <label>E-mail:</label>
              <input
                type="email"
                value={company.email || ''}
                onChange={e => setCompany({ ...company, email: e.target.value })}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="field-group" style={{ width: '200px' }}>
              <label>Celular:</label>
              <input
                type="tel"
                placeholder="(__) _____-____"
                value={company.cellphone || ''}
                onChange={e => setCompany({ ...company, cellphone: formatPhone(e.target.value) })}
              />
            </div>
            <div className="field-group" style={{ flex: 1 }}>
              <label>Slogan:</label>
              <input
                type="text"
                value={company.slogan || ''}
                onChange={e => setCompany({ ...company, slogan: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'Social' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="field-group">
            <label>Facebook:</label>
            <input type="text" placeholder="https://facebook.com/..." />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="field-group" style={{ flex: 1 }}>
              <label>Twitter:</label>
              <input type="text" placeholder="@seuusuario" />
            </div>
            <div className="field-group" style={{ flex: 1 }}>
              <label>LinkedIn:</label>
              <input type="text" placeholder="https://linkedin.com/in/..." />
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'Outros' && (
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="field-group" style={{ width: '250px' }}>
            <label>Limite de compra:</label>
            <div className="money-input-wrapper">
              <input
                type="number"
                value={company.purchaseLimit}
                step="0.01"
                style={{ textAlign: 'right' }}
                onChange={e => setCompany({ ...company, purchaseLimit: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div className="field-group" style={{ flex: 1 }}>
            <label>Acionista:</label>
            <div className="search-input-wrapper">
              <input
                type="text"
                value={company.shareholder || ''}
                onChange={e => setCompany({ ...company, shareholder: e.target.value })}
              />
              <button type="button" className="search-icon-btn" onClick={() => setIsSearchModalOpen(true)}>
                <Search size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Endereço - Fixo na aba Empresa */}
      <div className="address-section">
        <div className="address-header">
          <span className="address-label">Endereço</span>
          <div className="address-line"></div>
        </div>
        <div className="address-grid-full">
          <div className="field-group">
            <label>CEP <span style={{ color: '#ff4a4a' }}>*</span>:</label>
            <input
              type="text"
              value={company.cep || ''}
              onChange={e => handleCepSearch(e.target.value)}
            />
          </div>
          <div className="field-group">
            <label>Estado <span style={{ color: '#ff4a4a' }}>*</span>:</label>
            <input
              type="text"
              value={company.state || ''}
              onChange={e => setCompany({ ...company, state: e.target.value })}
            />
          </div>
          <div className="field-group">
            <label>Cidade <span style={{ color: '#ff4a4a' }}>*</span>:</label>
            <input
              type="text"
              value={company.city || ''}
              onChange={e => setCompany({ ...company, city: e.target.value })}
            />
          </div>
          <div className="field-group">
            <label>Bairro <span style={{ color: '#ff4a4a' }}>*</span>:</label>
            <input
              type="text"
              value={company.neighborhood || ''}
              onChange={e => setCompany({ ...company, neighborhood: e.target.value })}
            />
          </div>

          <div className="field-group">
            <label>Tipo de localização:</label>
            <select
              value={company.locationType || 'Casa'}
              onChange={e => setCompany({ ...company, locationType: e.target.value })}
            >
              <option>Casa</option>
              <option>Loja</option>
            </select>
          </div>
          <div className="field-group" style={{ gridColumn: 'span 2' }}>
            <label>Logradouro <span style={{ color: '#ff4a4a' }}>*</span>:</label>
            <input
              type="text"
              value={company.street || ''}
              onChange={e => setCompany({ ...company, street: e.target.value })}
            />
          </div>
          <div className="field-group">
            <label>Número <span style={{ color: '#ff4a4a' }}>*</span>:</label>
            <input
              type="text"
              value={company.number || ''}
              onChange={e => setCompany({ ...company, number: e.target.value })}
            />
          </div>

          <div className="field-group" style={{ gridColumn: 'span 2' }}>
            <label>Complemento:</label>
            <input
              type="text"
              value={company.complement || ''}
              onChange={e => setCompany({ ...company, complement: e.target.value })}
            />
          </div>
          <div className="field-group" style={{ gridColumn: 'span 2' }}>
            <label>Ponto de referência:</label>
            <input
              type="text"
              value={company.referencePoint || ''}
              onChange={e => setCompany({ ...company, referencePoint: e.target.value })}
            />
          </div>
        </div>
      </div>
    </>
  );
}
