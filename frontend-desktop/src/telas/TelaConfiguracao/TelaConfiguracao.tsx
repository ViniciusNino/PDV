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

        <div className="settings-body" style={{ overflowY: 'auto', maxHeight: '60vh' }}>
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

              {/* Conteúdo Variante por SubAba */}
              {activeSubTab === 'Basico' && (
                <div className="form-grid" style={{ marginBottom: '1.5rem' }}>
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
                </div>
              )}

              {activeSubTab === 'Documentos' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="field-group" style={{ flex: 1 }}>
                      <label>CNPJ:</label>
                      <input type="text" placeholder="__.___.___/____-__" />
                    </div>
                    <div className="field-group" style={{ flex: 1 }}>
                      <label>IE:</label>
                      <input type="text" />
                    </div>
                    <div className="field-group" style={{ flex: 1 }}>
                      <label>IM:</label>
                      <input type="text" />
                    </div>
                  </div>
                  <div className="field-group" style={{ width: '300px' }}>
                    <label>Data de fundação:</label>
                    <input type="date" />
                  </div>
                </div>
              )}

              {/* Endereço - Fixo na aba Empresa */}
              <div className="address-grid">
                <span style={{ gridColumn: 'span 3', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Endereço</span>
                <div style={{ gridColumn: 'span 3', display: 'grid', gridTemplateColumns: '150px 1fr 1fr 1fr', gap: '1rem' }}>
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
                    <select><option>Casa</option><option>Loja</option></select>
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
            </>
          )}

          {activeTab === 'Impressão' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
              <div>
                <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>Aparência</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {['Imprimir o CNPJ', 'Imprimir o endereço', 'Imprimir o telefone 1', 'Imprimir o telefone 2', 'Imprimir todos os garçons', 'Imprimir garçons no relatório', 'Imprimir o(a) atendente de caixa', 'Imprimir slogan', 'Imprimir gráficos em 3D'].map((item, i) => (
                    <label key={i} style={{ display: 'flex', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input type="checkbox" defaultChecked={i % 2 === 0} />
                      {item}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>Guias</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {['Imprimir fechamento de caixa', 'Imprimir comprovante de contas', 'Imprimir operações financeiras', 'Imprimir conta ao fechar pedidos'].map((item, i) => (
                    <label key={i} style={{ display: 'flex', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input type="checkbox" defaultChecked={true} />
                      {item}
                    </label>
                  ))}
                </div>
                
                <h3 style={{ color: 'var(--primary)', margin: '1.5rem 0 1rem 0', fontSize: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>Comportamento</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{ display: 'flex', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input type="checkbox" /> Exibir pergunta de impressão
                  </label>
                  <label style={{ display: 'flex', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input type="checkbox" defaultChecked /> Imprimir serviços sem perguntar
                  </label>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'Sistema' || activeTab === 'E-mail') && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '5rem' }}>
              Configurações de {activeTab} em desenvolvimento...
            </div>
          )}
        </div>

        <div className="settings-footer">
          <button className="btn-default" onClick={() => navigate('/register')}>Ok</button>
          <button className="btn-default" onClick={() => navigate('/register')}>Aplicar</button>
          <button className="btn-default" onClick={() => navigate('/register')}>Cancelar</button>
        </div>

      </div>
    </div>
  );
}
