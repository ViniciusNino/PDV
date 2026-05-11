import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Building2, FileText, Phone, Share2, MoreHorizontal, Image as ImageIcon, FolderOpen, Eraser, Search, X, Wrench, Globe, Key, AlertTriangle, Send } from 'lucide-react';
import './TelaConfiguracao.css';

export function TelaConfiguracao() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('Empresa');
  const [activeSubTab, setActiveSubTab] = useState('Basico');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const triggerLogoUpload = () => {
    fileInputRef.current?.click();
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
    }
  };

  const clearLogo = () => {
    setLogoUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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

        <div className="settings-body" style={{ overflowY: 'auto', maxHeight: '70vh' }}>
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
                    <input type="date" className="date-input" />
                  </div>
                </div>
              )}

              {activeSubTab === 'Contato' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="field-group" style={{ flex: 1 }}>
                      <label>Login:</label>
                      <input type="text" />
                    </div>
                    <div className="field-group" style={{ flex: 1 }}>
                      <label>Senha:</label>
                      <input type="password" />
                    </div>
                    <div className="field-group" style={{ flex: 2 }}>
                      <label>E-mail:</label>
                      <input type="email" />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="field-group" style={{ width: '200px' }}>
                      <label>Celular:</label>
                      <input type="tel" placeholder="(__) _____-____" />
                    </div>
                    <div className="field-group" style={{ flex: 1 }}>
                      <label>Slogan:</label>
                      <input type="text" />
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
                      <input type="number" defaultValue="0.00" step="0.01" style={{ textAlign: 'right' }} />
                    </div>
                  </div>
                  <div className="field-group" style={{ flex: 1 }}>
                    <label>Acionista:</label>
                    <div className="search-input-wrapper">
                      <input type="text" />
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
            <div className="print-tab-content">
              <div className="print-column">
                <div className="section-title-line">
                  <span className="section-label">Aparência</span>
                  <div className="title-line"></div>
                </div>
                <div className="checkbox-list">
                  {[
                    'Imprimir o CNPJ', 'Imprimir o endereço', 'Imprimir o telefone 1', 'Imprimir o telefone 2',
                    'Imprimir todos os garçons', 'Imprimir garçons no relatório', 'Imprimir o(a) atendente de caixa',
                    'Imprimir slogan', 'Imprimir permanência', 'Imprimir logo da empresa', 'Imprimir divisão da conta',
                    'Imprimir o código nos serviços', 'Imprimir os detalhes do produto', 'Imprimir local e atendente separados',
                    'Imprimir gráficos em 3D', 'Imprimir produtos no fechamento', 'Imprimir serviços em letra grande',
                    'Imprimir serviços detalhadamente', 'Imprimir endereço destacado', 'Imprimir local destacado',
                    'Imprimir local nos serviços', 'Imprimir cliente nos serviços', 'Imprimir pedidos cancelados no fechamento'
                  ].map((item, i) => (
                    <label key={i} className="custom-checkbox-label">
                      <input type="checkbox" defaultChecked={![4, 9, 11, 12, 13, 15, 16, 22].includes(i)} />
                      <span className="checkbox-text">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="column-divider"></div>

              <div className="print-column">
                <div className="checkbox-list" style={{ marginTop: '1.5rem' }}>
                  {[
                    'Imprimir observação do pedido nos serviços', 'Imprimir observações no pedido', 'Imprimir pacotes agrupados',
                    'Imprimir linha separadora de serviços', 'Imprimir saldo restante da comanda nos serviços'
                  ].map((item, i) => (
                    <label key={i} className="custom-checkbox-label">
                      <input type="checkbox" defaultChecked={i < 3} />
                      <span className="checkbox-text">{item}</span>
                    </label>
                  ))}
                </div>

                <div className="section-title-line" style={{ marginTop: '1rem' }}>
                  <span className="section-label">Guias</span>
                  <div className="title-line"></div>
                </div>
                <div className="checkbox-list">
                  {[
                    'Imprimir fechamento de caixa', 'Imprimir comprovante de contas', 'Imprimir cancelamento de preparo',
                    'Imprimir operações financeiras', 'Imprimir guia de pagamento', 'Imprimir senha para painéis',
                    'Imprimir senha nas comandas', 'Imprimir endereço de entrega antecipadamente', 'Imprimir conta ao fechar pedidos',
                    'Imprimir 2ª via do cupom de entrega', 'Imprimir resumo de cancelamento', 'Imprimir conferência de produção'
                  ].map((item, i) => (
                    <label key={i} className="custom-checkbox-label">
                      <input type="checkbox" defaultChecked={[0, 1, 2, 3, 4, 8].includes(i)} />
                      <span className="checkbox-text">{item}</span>
                    </label>
                  ))}
                </div>

                <div className="section-title-line" style={{ marginTop: '1rem' }}>
                  <span className="section-label">Comportamento</span>
                  <div className="title-line"></div>
                </div>
                <div className="checkbox-list">
                  <label className="custom-checkbox-label">
                    <input type="checkbox" />
                    <span className="checkbox-text">Exibir pergunta de impressão</span>
                  </label>
                  <label className="custom-checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span className="checkbox-text">Imprimir serviços sem perguntar</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Sistema' && (
            <div className="system-tab-content">
              <div className="section-title-line">
                <span className="section-label">Comportamento</span>
                <div className="title-line"></div>
              </div>
              <div className="system-grid">
                <div className="system-column">
                  <div className="checkbox-with-input">
                    <label className="custom-checkbox-label">
                      <input type="checkbox" />
                      <span className="checkbox-text">Fazer logout automaticamente após inatividade</span>
                    </label>
                    <div className="inline-input">
                      <input type="number" defaultValue={3} />
                      <span>min</span>
                    </div>
                  </div>
                  {[
                    'Comanda pré-paga', 'Mostrar produtos cancelados nas vendas', 'Lembrar o último atendente nas vendas',
                    'Permitir estoque negativo', 'Exibir a tela de venda rápida em tela cheia', 'Realizar backup automaticamente',
                    'Comissão na venda balcão', 'Fazer logout no tablet após lançar pedido', 'Abrir comanda sem solicitar cliente',
                    'Reservar mesas ao juntar'
                  ].map((item, i) => (
                    <label key={i} className="custom-checkbox-label">
                      <input type="checkbox" defaultChecked={[4, 5, 9].includes(i)} />
                      <span className="checkbox-text">{item}</span>
                    </label>
                  ))}
                </div>
                <div className="system-column">
                  {[
                    'Redirecionar para a mesa principal', 'Observação como nome de comanda', 'Confirmar ao lançar quantidades elevadas',
                    'Mostrar campos fiscais e tributários', 'Pesar produto ao selecionar comanda', 'Obrigar informar motivo de cancelamentos',
                    'Fazer logout após lançar pedido do desktop', 'Fila de pesagem nas comandas', 'Aceitar pedidos delivery automaticamente',
                    'Desativar avisos de estoque abaixo do mínimo', 'Controlar lote do estoque'
                  ].map((item, i) => (
                    <label key={i} className="custom-checkbox-label">
                      <input type="checkbox" defaultChecked={[1, 2, 4].includes(i)} />
                      <span className="checkbox-text">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="field-group" style={{ marginTop: '1rem' }}>
                <label>Dropbox (Token de acesso):</label>
                <div className="icon-input-wrapper">
                  <Key size={18} className="input-icon" />
                  <input type="text" />
                  <Wrench size={18} className="action-icon" />
                </div>
              </div>

              <div className="section-title-line" style={{ marginTop: '1.5rem' }}>
                <span className="section-label">Dispositivos</span>
                <div className="title-line"></div>
              </div>
              <div className="devices-grid">
                <div className="device-item">
                  <label className="custom-checkbox-label">
                    <input type="checkbox" />
                    <span className="checkbox-text">Habilitar o uso de balança</span>
                  </label>
                  <Wrench size={18} className="action-icon-static" />
                </div>
                <div className="device-item tef-item">
                   <div className="tef-box">
                      <span className="tef-label">TEF</span>
                      <div className="radio-group-horizontal">
                        <label className="custom-radio-label"><input type="radio" name="tef" defaultChecked /> Nenhuma</label>
                        <label className="custom-radio-label"><input type="radio" name="tef" /> Scope</label>
                        <label className="custom-radio-label"><input type="radio" name="tef" /> SiTef</label>
                      </div>
                      <Wrench size={18} className="action-icon-static" />
                   </div>
                   <FolderOpen size={18} className="action-icon-static" />
                </div>
                <div className="device-item full-row">
                   <label className="custom-checkbox-label">
                    <input type="checkbox" />
                    <span className="checkbox-text">Habilitar identificador de chamadas</span>
                  </label>
                  <label className="custom-checkbox-label" style={{ marginLeft: '2rem' }}>
                    <input type="checkbox" />
                    <span className="checkbox-text">Habilitar eventos para catraca</span>
                  </label>
                </div>
                <div className="field-group" style={{ width: '200px', marginLeft: '2rem' }}>
                  <label>Tipo de dispositivo:</label>
                  <select disabled><option>Identificador</option></select>
                </div>
              </div>

              <div className="section-title-line" style={{ marginTop: '1.5rem' }}>
                <span className="section-label">Região</span>
                <div className="title-line"></div>
              </div>
              <div className="field-group" style={{ width: '300px' }}>
                <label>País:</label>
                <div className="icon-input-wrapper">
                  <Globe size={18} className="input-icon" />
                  <select><option>Brasil</option></select>
                  <Globe size={18} className="action-icon" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'E-mail' && (
            <div className="email-tab-content">
              <div className="section-title-line">
                <span className="section-label">E-mail</span>
                <div className="title-line"></div>
              </div>
              <div className="field-group">
                <label>Destinatário:</label>
                <input type="text" />
              </div>

              <div className="section-title-line" style={{ marginTop: '1.5rem' }}>
                <span className="section-label">Conta</span>
                <div className="title-line"></div>
              </div>
              <div className="form-row-2col">
                <div className="field-group">
                  <label>Usuário:</label>
                  <input type="text" />
                </div>
                <div className="field-group">
                  <label>Senha:</label>
                  <input type="password" defaultValue="******" />
                </div>
              </div>
              <div className="warning-box">
                <AlertTriangle size={18} />
                <span>Os dados da conta são salvos no banco de dados sem criptografia, proteja o acesso da rede do servidor para evitar exposição desses dados!</span>
              </div>

              <div className="section-title-line" style={{ marginTop: '1.5rem' }}>
                <span className="section-label">Avançado</span>
                <div className="title-line"></div>
              </div>
              <div className="form-row-advanced">
                <div className="field-group" style={{ flex: 1 }}>
                  <label>Servidor:</label>
                  <select><option>smtp.gmail.com</option></select>
                </div>
                <div className="field-group" style={{ width: '100px' }}>
                  <label>Porta:</label>
                  <input type="number" defaultValue={587} />
                </div>
              </div>
              <div className="encryption-row">
                <div className="encryption-box">
                  <span className="tef-label">Encriptação</span>
                  <div className="radio-group-vertical">
                    <label className="custom-radio-label"><input type="radio" name="enc" /> Nenhum</label>
                    <label className="custom-radio-label"><input type="radio" name="enc" /> SSL</label>
                    <label className="custom-radio-label"><input type="radio" name="enc" defaultChecked /> TLS</label>
                  </div>
                </div>
                <button className="btn-test">
                  <Send size={16} />
                  Testar
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="settings-footer">
          <button className="btn-default" onClick={() => navigate('/register')}>Ok</button>
          <button className="btn-default" onClick={() => navigate('/register')}>Aplicar</button>
          <button className="btn-default" onClick={() => navigate('/register')}>Cancelar</button>
        </div>

      </div>

      {/* Modal de Busca de Clientes (Referência Imagem) */}
      {isSearchModalOpen && (
        <div className="search-modal-overlay">
          <div className="search-modal glass-panel">
            <div className="search-modal-header">
              <div className="header-title">
                <ImageIcon size={20} />
                <span>Busca de clientes</span>
              </div>
              <div className="header-actions">
                <button className="modal-icon-btn">?</button>
                <button className="modal-icon-btn" onClick={() => setIsSearchModalOpen(false)}><X size={18} /></button>
              </div>
            </div>
            
            <div className="search-modal-body">
              <div className="search-field-wrapper">
                <div className="field-group" style={{ flex: 1 }}>
                  <label>Nome, Telefone, E-mail ou CPF:</label>
                  <input type="text" autoFocus />
                </div>
                <button className="btn-select">Selecionar</button>
              </div>

              <div className="search-results-table">
                <div className="table-header">
                  <div className="th-col">Nome/Fantasia</div>
                  <div className="th-col">Telefone</div>
                  <div className="th-col">E-mail</div>
                  <div className="th-col">CPF/CNPJ</div>
                </div>
                <div className="table-empty">
                  {/* Lista vazia inicialmente */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


