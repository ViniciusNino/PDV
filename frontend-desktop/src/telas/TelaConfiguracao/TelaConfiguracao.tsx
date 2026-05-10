import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Building2, FileText, Phone, Share2, MoreHorizontal, Image as ImageIcon } from 'lucide-react';
import './TelaConfiguracao.css';

export function TelaConfiguracao() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Empresa');
  const [activeSubTab, setActiveSubTab] = useState('Basico');

  return (
    <div className="settings-container animate-fade-in">
      <div className="settings-card glass-panel">
        
        <div className="settings-header">
          <Settings size={24} />
          <h1>Configurações da Empresa e Sistema</h1>
        </div>

        <div className="tabs-main">
          {['Empresa', 'Impressão', 'Sistema', 'E-mail'].map(tab => (
            <button 
              key={tab} 
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="settings-body">
          {activeTab === 'Empresa' && (
            <>
              <div className="subtabs">
                <button className={`subtab-btn ${activeSubTab === 'Basico' ? 'active' : ''}`} onClick={() => setActiveSubTab('Basico')}>
                  <Building2 size={16} /> Basico
                </button>
                <button className={`subtab-btn ${activeSubTab === 'Documentos' ? 'active' : ''}`} onClick={() => setActiveSubTab('Documentos')}>
                  <FileText size={16} /> Documentos
                </button>
                <button className={`subtab-btn ${activeSubTab === 'Contato' ? 'active' : ''}`} onClick={() => setActiveSubTab('Contato')}>
                  <Phone size={16} /> Contato
                </button>
                <button className={`subtab-btn ${activeSubTab === 'Social' ? 'active' : ''}`} onClick={() => setActiveSubTab('Social')}>
                  <Share2 size={16} /> Social
                </button>
                <button className={`subtab-btn ${activeSubTab === 'Outros' ? 'active' : ''}`} onClick={() => setActiveSubTab('Outros')}>
                  <MoreHorizontal size={16} /> Outros
                </button>
              </div>

              {activeSubTab === 'Basico' && (
                <div className="form-grid">
                  <div className="image-upload-area">
                    <ImageIcon size={48} />
                  </div>
                  
                  <div className="form-fields">
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div className="field-group" style={{ flex: 1 }}>
                        <label>Fantasia:</label>
                        <input type="text" />
                      </div>
                      <div className="field-group" style={{ flex: 1 }}>
                        <label>Razão social:</label>
                        <input type="text" />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <div className="field-group" style={{ width: '200px' }}>
                        <label>Telefone:</label>
                        <input type="tel" placeholder="(__) ____-____" />
                      </div>
                    </div>
                  </div>

                  <div className="address-grid">
                    <div className="field-group">
                      <label>CEP:</label>
                      <input type="text" defaultValue="21520-680" />
                    </div>
                    <div className="field-group">
                      <label>Estado:</label>
                      <select><option>Rio de Janeiro</option></select>
                    </div>
                    <div className="field-group">
                      <label>Cidade:</label>
                      <input type="text" defaultValue="Rio de Janeiro" />
                    </div>
                    <div className="field-group">
                      <label>Bairro:</label>
                      <input type="text" defaultValue="Pavuna" />
                    </div>

                    <div className="field-group">
                      <label>Tipo de localização:</label>
                      <select><option>Casa</option><option>Apartamento</option><option>Loja</option></select>
                    </div>
                    <div className="field-group" style={{ gridColumn: 'span 2' }}>
                      <label>Logradouro:</label>
                      <input type="text" defaultValue="Alameda Guarani" />
                    </div>
                    <div className="field-group">
                      <label>Número:</label>
                      <input type="text" />
                    </div>

                    <div className="field-group" style={{ gridColumn: 'span 2' }}>
                      <label>Complemento:</label>
                      <input type="text" />
                    </div>
                    <div className="field-group" style={{ gridColumn: 'span 2' }}>
                      <label>Ponto de referência:</label>
                      <input type="text" />
                    </div>
                  </div>
                </div>
              )}
              
              {activeSubTab !== 'Basico' && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                  Aba "{activeSubTab}" em desenvolvimento...
                </div>
              )}
            </>
          )}

          {activeTab !== 'Empresa' && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '5rem' }}>
              Configurações de {activeTab} em desenvolvimento...
            </div>
          )}
        </div>

        <div className="settings-footer">
          <button className="btn-default" onClick={() => navigate('/checkout')}>Ok</button>
          <button className="btn-default">Aplicar</button>
          <button className="btn-default" onClick={() => navigate('/checkout')}>Cancelar</button>
        </div>

      </div>
    </div>
  );
}
