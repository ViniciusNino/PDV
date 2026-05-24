import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Building2, FileText, Phone, Share2, MoreHorizontal, Image as ImageIcon, FolderOpen, Eraser, Search, X, Wrench, Key, AlertTriangle, Send } from 'lucide-react';
import './TelaConfiguracao.css';

interface TelaConfiguracaoProps {
  isModal?: boolean;
  onClose?: () => void;
  isWindowMode?: boolean;
}

export function TelaConfiguracao({ isModal = false, onClose, isWindowMode = false }: TelaConfiguracaoProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatPhone = (value: string) => {
    if (!value) return '';
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 10) {
      // Fixo: (XX) XXXX-XXXX
      return cleanValue
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .substring(0, 14);
    } else {
      // Celular: (XX) XXXXX-XXXX
      return cleanValue
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .substring(0, 15);
    }
  };
  const [activeTab, setActiveTab] = useState('Empresa');
  const [activeSubTab, setActiveSubTab] = useState('Basico');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('nino-theme-mode') || 'dark');
  const [themePalette, setThemePalette] = useState(() => localStorage.getItem('nino-theme-palette') || 'amber');

  // Estados consolidados das configurações
  const [company, setCompany] = useState({
    tradingName: '',
    companyName: '',
    phone: '',
    cellphone: '',
    email: '',
    slogan: '',
    cnpj: '',
    stateRegistration: '',
    municipalRegistration: '',
    foundationDate: '',
    logoUrl: '',
    purchaseLimit: 0.00,
    shareholder: '',
    cep: '',
    state: '',
    city: '',
    neighborhood: '',
    locationType: 'Casa',
    street: '',
    number: '',
    complement: '',
    referencePoint: ''
  });

  const [print, setPrint] = useState<Record<string, boolean>>({
    printCnpj: true,
    printAddress: true,
    printPhone1: true,
    printPhone2: true,
    printAllWaiters: false,
    printWaitersInReport: true,
    printCashierAttendant: true,
    printSlogan: true,
    printPermanence: true,
    printCompanyLogo: false,
    printAccountDivision: true,
    printCodeInServices: false,
    printProductDetails: false,
    printSeparateLocalAndAttendant: false,
    print3DGraphs: true,
    printProductsOnClosure: false,
    printServicesInLargeFont: false,
    printDetailedServices: true,
    printHighlightedAddress: true,
    printHighlightedLocal: true,
    printLocalInServices: true,
    printClientInServices: true,
    printCanceledOrdersOnClosure: false,
    printOrderObservationInServices: true,
    printObservationsOnOrder: true,
    printGroupedPackages: true,
    printServiceSeparatorLine: false,
    printComandaRemainingBalanceInServices: false,
    printCashierClosure: true,
    printAccountReceipt: true,
    printPrepCancellation: true,
    printFinancialOperations: true,
    printPaymentGuide: true,
    printPanelPassword: false,
    printComandaPassword: false,
    printDeliveryAddressInAdvance: false,
    printAccountOnCloseOrders: true,
    printDeliveryCouponSecondCopy: false,
    printCancellationSummary: false,
    printProductionConference: false,
    showPrintQuestion: false,
    printServicesWithoutAsking: true
  });

  const [system, setSystem] = useState({
    autoLogout: false,
    autoLogoutTime: 3,
    comandaPrePaga: false,
    mostrarProdutosCanceladosNasVendas: false,
    lembrarUltimoAtendenteNasVendas: false,
    permitirEstoqueNegativo: false,
    exibirTelaVendaRapidaEmTelaCheia: true,
    realizarBackupAutomaticamente: true,
    comissaoNaVendaBalcao: false,
    fazerLogoutNoTabletAposLancadoPedido: false,
    abrirComandaSemSolicitarCliente: false,
    reservarMesasAoJuntar: true,
    redirecionarParaAMesaPrincipal: false,
    observacaoComoNomeDeComanda: true,
    confirmarAoLancandoQuantidadesElevadas: true,
    mostrarCamposFiscaisETributarios: false,
    pesarProdutoAoSelecionarComanda: true,
    obrigarInformarMotivoDeCancelamentos: false,
    fazerLogoutAposLancadoPedidoDoDesktop: false,
    filaDePesagemNasComandas: false,
    aceitarPedidosDeliveryAutomaticamente: false,
    desativarAvisosDeEstoqueAbaixoDoMinimo: false,
    controlarLoteDoEstoque: false,
    dropboxToken: '',
    habilitarUsoDeBalanca: false,
    habilitarIdentificadorDeChamadas: false,
    tipoDispositivoIdentificador: 'Identificador',
    habilitarEventosParaCatraca: false,
    tefType: 'Nenhuma',
    country: 'Brasil'
  });

  const [email, setEmail] = useState({
    recipient: '',
    username: '',
    password: '',
    server: 'smtp.gmail.com',
    port: 587,
    encryption: 'TLS'
  });

  // Busca as configurações atuais ao carregar a página
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    fetch('http://localhost:5121/api/settings', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao carregar configurações da empresa.");
        return res.json();
      })
      .then(data => {
        let foundationDateStr = '';
        if (data.company.foundationDate) {
          foundationDateStr = data.company.foundationDate.split('T')[0];
        }

        // Garante que nenhum valor de texto do objeto company seja null, prevenindo inputs travados
        const cleanCompany = { ...data.company };
        Object.keys(cleanCompany).forEach(key => {
          if (cleanCompany[key] === null) {
            cleanCompany[key] = '';
          }
        });

        // Higieniza o objeto system (garante tipos não nulos requeridos pela API)
        const cleanSystem = { ...data.system };
        Object.keys(cleanSystem).forEach(key => {
          if (cleanSystem[key] === null) {
            if (key === 'tipoDispositivoIdentificador') cleanSystem[key] = 'Identificador';
            else if (key === 'tefType') cleanSystem[key] = 'Nenhuma';
            else if (key === 'country') cleanSystem[key] = 'Brasil';
            else cleanSystem[key] = '';
          }
        });

        // Higieniza o objeto email (garante tipos não nulos requeridos pela API)
        const cleanEmail = { ...data.email };
        Object.keys(cleanEmail).forEach(key => {
          if (cleanEmail[key] === null) {
            if (key === 'encryption') cleanEmail[key] = 'TLS';
            else if (key === 'server') cleanEmail[key] = 'smtp.gmail.com';
            else if (key === 'port') cleanEmail[key] = 587;
            else cleanEmail[key] = '';
          }
        });

        // Higieniza o objeto print (garante booleanos)
        const cleanPrint = { ...data.print };
        Object.keys(cleanPrint).forEach(key => {
          if (cleanPrint[key] === null || cleanPrint[key] === undefined) {
            cleanPrint[key] = false;
          }
        });

        // Formata os telefones com máscara
        if (cleanCompany.phone) {
          cleanCompany.phone = formatPhone(cleanCompany.phone);
        }
        if (cleanCompany.cellphone) {
          cleanCompany.cellphone = formatPhone(cleanCompany.cellphone);
        }

        setCompany({
          ...cleanCompany,
          foundationDate: foundationDateStr
        });
        if (data.company.logoUrl) {
          setLogoUrl(data.company.logoUrl);
        }
        setPrint(cleanPrint);
        setSystem(cleanSystem);
        setEmail(cleanEmail);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message || "Não foi possível carregar as configurações.");
        setIsLoading(false);
      });
  }, [navigate]);

  const triggerLogoUpload = () => {
    fileInputRef.current?.click();
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
      setCompany(prev => ({ ...prev, logoUrl: url }));
    }
  };

  const clearLogo = () => {
    setLogoUrl(null);
    setCompany(prev => ({ ...prev, logoUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCepSearch = (cepStr: string) => {
    setCompany(prev => ({ ...prev, cep: cepStr }));
    const cleanCep = cepStr.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
        .then(res => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then(data => {
          if (!data.erro) {
            setCompany(prev => ({
              ...prev,
              cep: data.cep,
              state: data.uf === 'RJ' ? 'Rio de Janeiro' : data.uf === 'SP' ? 'São Paulo' : data.uf === 'MG' ? 'Minas Gerais' : data.uf,
              city: data.localidade,
              neighborhood: data.bairro,
              street: data.logradouro
            }));
          }
        })
        .catch(err => console.error("Erro ao buscar CEP:", err));
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/account/login');
    }
  };

  const handleSave = (shouldNavigate: boolean) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Validação de campos obrigatórios
    const requiredFields = [
      { key: 'tradingName', label: 'Fantasia' },
      { key: 'companyName', label: 'Razão social' },
      { key: 'phone', label: 'Telefone' },
      { key: 'cep', label: 'CEP' },
      { key: 'state', label: 'Estado' },
      { key: 'city', label: 'Cidade' },
      { key: 'neighborhood', label: 'Bairro' },
      { key: 'street', label: 'Logradouro' },
      { key: 'number', label: 'Número' }
    ];

    const missingFields = requiredFields.filter(f => !company[f.key as keyof typeof company]?.toString().trim());

    if (missingFields.length > 0) {
      alert(`Por favor, preencha os seguintes campos obrigatórios:\n\n${missingFields.map(f => `- ${f.label}`).join('\n')}`);
      return;
    }

    // Validação do formato do Telefone Principal
    const cleanPhone = company.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      alert("Por favor, insira um Telefone principal válido com DDD. Formato: (XX) XXXX-XXXX ou (XX) XXXXX-XXXX.");
      return;
    }

    // Validação do formato do Celular (se preenchido)
    if (company.cellphone) {
      const cleanCell = company.cellphone.replace(/\D/g, '');
      if (cleanCell.length > 0 && (cleanCell.length < 10 || cleanCell.length > 11)) {
        alert("Por favor, insira um Celular válido com DDD. Formato: (XX) XXXX-XXXX ou (XX) XXXXX-XXXX.");
        return;
      }
    }

    // Prepara o payload de empresa com tipos tratados para o C# do backend
    const companyToSave = {
      ...company,
      phone: cleanPhone,
      cellphone: company.cellphone ? company.cellphone.replace(/\D/g, '') : '',
      foundationDate: company.foundationDate === '' ? null : company.foundationDate
    };

    fetch('http://localhost:5121/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        company: companyToSave,
        print,
        system,
        email
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao salvar as configurações.");
        return res.json();
      })
      .then(() => {
        // Salva e aplica o tema localmente
        localStorage.setItem('nino-theme-mode', themeMode);
        localStorage.setItem('nino-theme-palette', themePalette);
        document.documentElement.setAttribute('data-theme', `${themePalette}-${themeMode}`);

        if (shouldNavigate) {
          if (onClose) {
            onClose();
          } else {
            navigate('/account/login');
          }
        } else {
          alert("Configurações aplicadas com sucesso!");
        }
      })
      .catch(err => {
        alert(err.message || "Não foi possível salvar as configurações.");
      });
  };

  React.useEffect(() => {
    if (isModal) return;
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('set-window-size', {
        width: 850,
        height: 700,
        resizable: false,
        maximizable: false,
        minimizable: false,
        centered: true
      });
    }
  }, [isModal]);

  if (isLoading) {
    return (
      <div className="settings-card glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '600px', gap: '1rem' }}>
        <div className="spinner"></div>
        <span style={{ color: '#fff', fontSize: '1.2rem', fontFamily: 'Inter, sans-serif' }}>Carregando configurações...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="settings-card glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '600px', gap: '1.5rem', padding: '2rem', textAlign: 'center' }}>
        <AlertTriangle size={48} color="#ff4a4a" />
        <span style={{ color: '#ff4a4a', fontSize: '1.2rem', fontFamily: 'Inter, sans-serif', fontWeight: 'bold' }}>{error}</span>
        <button className="btn-default" onClick={() => window.location.reload()}>Tentar Novamente</button>
      </div>
    );
  }

  const cardBody = (
    <div className={`settings-card glass-panel ${isModal ? 'settings-modal-card' : 'animate-fade-in'}`}>

      {!isWindowMode && (
        <div className="settings-header">
          <div className="header-info">
            <Settings size={24} />
            <h1>Configurações da Empresa e Sistema</h1>
          </div>
          <button className="btn-close-settings" onClick={handleCancel}>
            <X size={24} />
          </button>
        </div>
      )}

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
                ].map((item, i) => {
                  const key = [
                    'printCnpj', 'printAddress', 'printPhone1', 'printPhone2',
                    'printAllWaiters', 'printWaitersInReport', 'printCashierAttendant',
                    'printSlogan', 'printPermanence', 'printCompanyLogo', 'printAccountDivision',
                    'printCodeInServices', 'printProductDetails', 'printSeparateLocalAndAttendant',
                    'print3DGraphs', 'printProductsOnClosure', 'printServicesInLargeFont',
                    'printDetailedServices', 'printHighlightedAddress', 'printHighlightedLocal',
                    'printLocalInServices', 'printClientInServices', 'printCanceledOrdersOnClosure'
                  ][i];
                  return (
                    <label key={i} className="custom-checkbox-label">
                      <input
                        type="checkbox"
                        checked={!!print[key]}
                        onChange={(e) => setPrint({ ...print, [key]: e.target.checked })}
                      />
                      <span className="checkbox-text">{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="column-divider"></div>

            <div className="print-column">
              <div className="checkbox-list" style={{ marginTop: '1.5rem' }}>
                {[
                  'Imprimir observação do pedido nos serviços', 'Imprimir observações no pedido', 'Imprimir pacotes agrupados',
                  'Imprimir linha separadora de serviços', 'Imprimir saldo restante da comanda nos serviços'
                ].map((item, i) => {
                  const key = [
                    'printOrderObservationInServices', 'printObservationsOnOrder', 'printGroupedPackages',
                    'printServiceSeparatorLine', 'printComandaRemainingBalanceInServices'
                  ][i];
                  return (
                    <label key={i} className="custom-checkbox-label">
                      <input
                        type="checkbox"
                        checked={!!print[key]}
                        onChange={(e) => setPrint({ ...print, [key]: e.target.checked })}
                      />
                      <span className="checkbox-text">{item}</span>
                    </label>
                  );
                })}
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
                ].map((item, i) => {
                  const key = [
                    'printCashierClosure', 'printAccountReceipt', 'printPrepCancellation',
                    'printFinancialOperations', 'printPaymentGuide', 'printPanelPassword',
                    'printComandaPassword', 'printDeliveryAddressInAdvance', 'printAccountOnCloseOrders',
                    'printDeliveryCouponSecondCopy', 'printCancellationSummary', 'printProductionConference'
                  ][i];
                  return (
                    <label key={i} className="custom-checkbox-label">
                      <input
                        type="checkbox"
                        checked={!!print[key]}
                        onChange={(e) => setPrint({ ...print, [key]: e.target.checked })}
                      />
                      <span className="checkbox-text">{item}</span>
                    </label>
                  );
                })}
              </div>

              <div className="section-title-line" style={{ marginTop: '1rem' }}>
                <span className="section-label">Comportamento</span>
                <div className="title-line"></div>
              </div>
              <div className="checkbox-list">
                <label className="custom-checkbox-label">
                  <input
                    type="checkbox"
                    checked={!!print.showPrintQuestion}
                    onChange={(e) => setPrint({ ...print, showPrintQuestion: e.target.checked })}
                  />
                  <span className="checkbox-text">Exibir pergunta de impressão</span>
                </label>
                <label className="custom-checkbox-label">
                  <input
                    type="checkbox"
                    checked={!!print.printServicesWithoutAsking}
                    onChange={(e) => setPrint({ ...print, printServicesWithoutAsking: e.target.checked })}
                  />
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
                    <input
                      type="checkbox"
                      checked={!!system.autoLogout}
                      onChange={(e) => setSystem({ ...system, autoLogout: e.target.checked })}
                    />
                    <span className="checkbox-text">Fazer logout automaticamente após inatividade</span>
                  </label>
                  <div className={`inline-input ${!system.autoLogout ? 'disabled' : ''}`}>
                    <input
                      type="number"
                      value={system.autoLogoutTime || 3}
                      min={1}
                      max={60}
                      onChange={(e) => setSystem({ ...system, autoLogoutTime: Math.min(60, Math.max(1, parseInt(e.target.value) || 1)) })}
                      disabled={!system.autoLogout}
                    />
                    <span>min</span>
                  </div>
                </div>
                {[
                  'Comanda pré-paga', 'Mostrar produtos cancelados nas vendas', 'Lembrar o último atendente nas vendas',
                  'Permitir estoque negativo', 'Exibir a tela de venda rápida em tela cheia', 'Realizar backup automaticamente',
                  'Comissão na venda balcão', 'Fazer logout no tablet após lançar pedido', 'Abrir comanda sem solicitar cliente',
                  'Reservar mesas ao juntar'
                ].map((item, i) => {
                  const key = [
                    'comandaPrePaga', 'mostrarProdutosCanceladosNasVendas', 'lembrarUltimoAtendenteNasVendas',
                    'permitirEstoqueNegativo', 'exibirTelaVendaRapidaEmTelaCheia', 'realizarBackupAutomaticamente',
                    'comissaoNaVendaBalcao', 'fazerLogoutNoTabletAposLancadoPedido', 'abrirComandaSemSolicitarCliente',
                    'reservarMesasAoJuntar'
                  ][i] as keyof typeof system;
                  return (
                    <label key={i} className="custom-checkbox-label">
                      <input
                        type="checkbox"
                        checked={!!system[key]}
                        onChange={(e) => setSystem({ ...system, [key]: e.target.checked })}
                      />
                      <span className="checkbox-text">{item}</span>
                    </label>
                  );
                })}
              </div>
              <div className="system-column">
                {[
                  'Redirecionar para a mesa principal', 'Observação como nome de comanda', 'Confirmar ao lançar quantidades elevadas',
                  'Mostrar campos fiscais e tributários', 'Pesar produto ao selecionar comanda', 'Obrigar informar motivo de cancelamentos',
                  'Fazer logout após lançar pedido do desktop', 'Fila de pesagem nas comandas', 'Aceitar pedidos delivery automaticamente',
                  'Desativar avisos de estoque abaixo do mínimo', 'Controlar lote do estoque'
                ].map((item, i) => {
                  const key = [
                    'redirecionarParaAMesaPrincipal', 'observacaoComoNomeDeComanda', 'confirmarAoLancandoQuantidadesElevadas',
                    'mostrarCamposFiscaisETributarios', 'pesarProdutoAoSelecionarComanda', 'obrigarInformarMotivoDeCancelamentos',
                    'fazerLogoutAposLancadoPedidoDoDesktop', 'filaDePesagemNasComandas', 'aceitarPedidosDeliveryAutomaticamente',
                    'desativarAvisosDeEstoqueAbaixoDoMinimo', 'controlarLoteDoEstoque'
                  ][i] as keyof typeof system;
                  return (
                    <label key={i} className="custom-checkbox-label">
                      <input
                        type="checkbox"
                        checked={!!system[key]}
                        onChange={(e) => setSystem({ ...system, [key]: e.target.checked })}
                      />
                      <span className="checkbox-text">{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="field-group" style={{ marginTop: '1rem' }}>
              <label>Dropbox (Token de acesso):</label>
              <div className="icon-input-wrapper">
                <Key size={18} className="input-icon" />
                <input
                  type="text"
                  value={system.dropboxToken || ''}
                  onChange={e => setSystem({ ...system, dropboxToken: e.target.value })}
                />
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
                  <input
                    type="checkbox"
                    checked={!!system.habilitarUsoDeBalanca}
                    onChange={e => setSystem({ ...system, habilitarUsoDeBalanca: e.target.checked })}
                  />
                  <span className="checkbox-text">Habilitar o uso de balança</span>
                </label>
                <Wrench size={18} className="action-icon-static" />
              </div>
              <div className="device-item tef-item">
                <div className="tef-box">
                  <span className="tef-label">TEF</span>
                  <div className="radio-group-horizontal">
                    <label className="custom-radio-label">
                      <input
                        type="radio"
                        name="tef"
                        checked={system.tefType === 'Nenhuma'}
                        onChange={() => setSystem({ ...system, tefType: 'Nenhuma' })}
                      /> Nenhuma
                    </label>
                    <label className="custom-radio-label">
                      <input
                        type="radio"
                        name="tef"
                        checked={system.tefType === 'Scope'}
                        onChange={() => setSystem({ ...system, tefType: 'Scope' })}
                      /> Scope
                    </label>
                    <label className="custom-radio-label">
                      <input
                        type="radio"
                        name="tef"
                        checked={system.tefType === 'SiTef'}
                        onChange={() => setSystem({ ...system, tefType: 'SiTef' })}
                      /> SiTef
                    </label>
                  </div>
                  <Wrench size={18} className="action-icon-static" />
                </div>
                <FolderOpen size={18} className="action-icon-static" />
              </div>
              <div className="device-item full-row">
                <label className="custom-checkbox-label">
                  <input
                    type="checkbox"
                    checked={!!system.habilitarIdentificadorDeChamadas}
                    onChange={(e) => setSystem({ ...system, habilitarIdentificadorDeChamadas: e.target.checked })}
                  />
                  <span className="checkbox-text">Habilitar identificador de chamadas</span>
                </label>
                <label className="custom-checkbox-label" style={{ marginLeft: '2rem' }}>
                  <input
                    type="checkbox"
                    checked={!!system.habilitarEventosParaCatraca}
                    onChange={(e) => setSystem({ ...system, habilitarEventosParaCatraca: e.target.checked })}
                  />
                  <span className="checkbox-text">Habilitar eventos para catraca</span>
                </label>
              </div>
              <div className="field-group" style={{ width: '200px', marginLeft: '2rem' }}>
                <label>Tipo de dispositivo:</label>
                <select
                  disabled={!system.habilitarIdentificadorDeChamadas}
                  value={system.tipoDispositivoIdentificador || 'Identificador'}
                  onChange={e => setSystem({ ...system, tipoDispositivoIdentificador: e.target.value })}
                >
                  <option>Identificador</option>
                  <option>Modem</option>
                  <option>Icebox</option>
                </select>
              </div>
            </div>

            <div className="section-title-line" style={{ marginTop: '1.5rem' }}>
              <span className="section-label">Aparência do Sistema</span>
              <div className="title-line"></div>
            </div>
            <div className="form-row-2col" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div className="field-group" style={{ flex: 1 }}>
                <label>Tema de Fundo:</label>
                <select
                  value={themeMode}
                  onChange={e => setThemeMode(e.target.value)}
                >
                  <option value="light">Claro</option>
                  <option value="dark">Escuro</option>
                </select>
              </div>
              <div className="field-group" style={{ flex: 1 }}>
                <label>Estilo Visual (Paleta):</label>
                <select
                  value={themePalette}
                  onChange={e => setThemePalette(e.target.value)}
                >
                  <option value="amber">Amber Bistro</option>
                  <option value="emerald">Modern Emerald</option>
                  <option value="indigo">Indigo Minimalist</option>
                  <option value="nordic">Nordic Glacial</option>
                </select>
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
              <input
                type="text"
                value={email.recipient || ''}
                onChange={e => setEmail({ ...email, recipient: e.target.value })}
              />
            </div>

            <div className="section-title-line" style={{ marginTop: '1.5rem' }}>
              <span className="section-label">Conta</span>
              <div className="title-line"></div>
            </div>
            <div className="form-row-2col">
              <div className="field-group">
                <label>Usuário:</label>
                <input
                  type="text"
                  value={email.username || ''}
                  onChange={e => setEmail({ ...email, username: e.target.value })}
                />
              </div>
              <div className="field-group">
                <label>Senha:</label>
                <input
                  type="password"
                  value={email.password || ''}
                  onChange={e => setEmail({ ...email, password: e.target.value })}
                />
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
                <input
                  type="text"
                  value={email.server || 'smtp.gmail.com'}
                  onChange={e => setEmail({ ...email, server: e.target.value })}
                />
              </div>
              <div className="field-group" style={{ width: '100px' }}>
                <label>Porta:</label>
                <input
                  type="number"
                  value={email.port || 587}
                  onChange={e => setEmail({ ...email, port: parseInt(e.target.value) || 587 })}
                />
              </div>
            </div>
            <div className="encryption-row">
              <div className="encryption-box">
                <span className="encryption-label">Encriptação</span>
                <div className="radio-group-vertical">
                  <label className="custom-radio-label">
                    <input
                      type="radio"
                      name="enc"
                      checked={email.encryption === 'Nenhum'}
                      onChange={() => setEmail({ ...email, encryption: 'Nenhum' })}
                    /> Nenhum
                  </label>
                  <label className="custom-radio-label">
                    <input
                      type="radio"
                      name="enc"
                      checked={email.encryption === 'SSL'}
                      onChange={() => setEmail({ ...email, encryption: 'SSL' })}
                    /> SSL
                  </label>
                  <label className="custom-radio-label">
                    <input
                      type="radio"
                      name="enc"
                      checked={email.encryption === 'TLS'}
                      onChange={() => setEmail({ ...email, encryption: 'TLS' })}
                    /> TLS
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button type="button" className="btn-test" onClick={() => alert('Teste de conexão SMTP enviado com sucesso para: ' + email.recipient)}>
                  <Send size={16} />
                  Testar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="settings-footer">
        <button className="btn-default" onClick={() => handleSave(true)}>Ok</button>
        <button className="btn-default" onClick={() => handleSave(false)}>Aplicar</button>
        <button className="btn-default" onClick={handleCancel}>Cancelar</button>
      </div>

    </div>
  );

  return (
    <>
      {isModal ? (
        <div className="settings-modal-overlay animate-fade-in" onClick={handleCancel}>
          <div className="settings-modal-wrapper animate-slide-up" onClick={e => e.stopPropagation()}>
            {cardBody}
          </div>
        </div>
      ) : (
        cardBody
      )}

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
    </>
  );
}


