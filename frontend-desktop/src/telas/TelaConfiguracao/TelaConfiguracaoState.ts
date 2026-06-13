import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface CompanyConfig {
  tradingName: string;
  companyName: string;
  phone: string;
  cellphone: string;
  email: string;
  slogan: string;
  cnpj: string;
  stateRegistration: string;
  municipalRegistration: string;
  foundationDate: string;
  logoUrl: string;
  purchaseLimit: number;
  shareholder: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  locationType: string;
  street: string;
  number: string;
  complement: string;
  referencePoint: string;
  facebook: string;
  twitter: string;
  linkedin: string;
}

export interface SystemConfig {
  autoLogout: boolean;
  autoLogoutTime: number;
  comandaPrePaga: boolean;
  mostrarProdutosCanceladosNasVendas: boolean;
  lembrarUltimoAtendenteNasVendas: boolean;
  permitirEstoqueNegativo: boolean;
  exibirTelaVendaRapidaEmTelaCheia: boolean;
  realizarBackupAutomaticamente: boolean;
  comissaoNaVendaBalcao: boolean;
  fazerLogoutNoTabletAposLancadoPedido: boolean;
  abrirComandaSemSolicitarCliente: boolean;
  reservarMesasAoJuntar: boolean;
  redirecionarParaAMesaPrincipal: boolean;
  observacaoComoNomeDeComanda: boolean;
  confirmarAoLancandoQuantidadesElevadas: boolean;
  mostrarCamposFiscaisETributarios: boolean;
  pesarProdutoAoSelecionarComanda: boolean;
  obrigarInformarMotivoDeCancelamentos: boolean;
  fazerLogoutAposLancadoPedidoDoDesktop: boolean;
  filaDePesagemNasComandas: boolean;
  aceitarPedidosDeliveryAutomaticamente: boolean;
  desativarAvisosDeEstoqueAbaixoDoMinimo: boolean;
  controlarLoteDoEstoque: boolean;
  dropboxToken: string;
  habilitarUsoDeBalanca: boolean;
  habilitarIdentificadorDeChamadas: boolean;
  tipoDispositivoIdentificador: string;
  habilitarEventosParaCatraca: boolean;
  tefType: string;
  country: string;
}

export interface EmailConfig {
  recipient: string;
  username: string;
  password: string;
  server: string;
  port: number;
  encryption: string;
}

export function formatPhone(value: string) {
  if (!value) return '';
  const cleanValue = value.replace(/\D/g, '');
  if (cleanValue.length <= 10) {
    return cleanValue
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substring(0, 14);
  } else {
    return cleanValue
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 15);
  }
}

interface UseTelaConfiguracaoProps {
  isModal: boolean;
  onClose?: () => void;
}

export function useTelaConfiguracao({ isModal, onClose }: UseTelaConfiguracaoProps) {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Empresa');
  const [activeSubTab, setActiveSubTab] = useState('Basico');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('nino-theme-mode') || 'dark');
  const [themePalette, setThemePalette] = useState(() => localStorage.getItem('nino-theme-palette') || 'amber');

  const [company, setCompany] = useState<CompanyConfig>({
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
    referencePoint: '',
    facebook: '',
    twitter: '',
    linkedin: ''
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

  const [system, setSystem] = useState<SystemConfig>({
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

  const [email, setEmail] = useState<EmailConfig>({
    recipient: '',
    username: '',
    password: '',
    server: 'smtp.gmail.com',
    port: 587,
    encryption: 'TLS'
  });

  useEffect(() => {
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

        const cleanCompany = { ...data.company };
        Object.keys(cleanCompany).forEach(key => {
          if (cleanCompany[key] === null) {
            cleanCompany[key] = '';
          }
        });

        const cleanSystem = { ...data.system };
        Object.keys(cleanSystem).forEach(key => {
          if (cleanSystem[key] === null) {
            if (key === 'tipoDispositivoIdentificador') cleanSystem[key] = 'Identificador';
            else if (key === 'tefType') cleanSystem[key] = 'Nenhuma';
            else if (key === 'country') cleanSystem[key] = 'Brasil';
            else cleanSystem[key] = '';
          }
        });

        const cleanEmail = { ...data.email };
        Object.keys(cleanEmail).forEach(key => {
          if (cleanEmail[key] === null) {
            if (key === 'encryption') cleanEmail[key] = 'TLS';
            else if (key === 'server') cleanEmail[key] = 'smtp.gmail.com';
            else if (key === 'port') cleanEmail[key] = 587;
            else cleanEmail[key] = '';
          }
        });

        const cleanPrint = { ...data.print };
        Object.keys(cleanPrint).forEach(key => {
          if (cleanPrint[key] === null || cleanPrint[key] === undefined) {
            cleanPrint[key] = false;
          }
        });

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

    const cleanPhone = company.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      alert("Por favor, insira um Telefone principal válido com DDD. Formato: (XX) XXXX-XXXX ou (XX) XXXXX-XXXX.");
      return;
    }

    if (company.cellphone) {
      const cleanCell = company.cellphone.replace(/\D/g, '');
      if (cleanCell.length > 0 && (cleanCell.length < 10 || cleanCell.length > 11)) {
        alert("Por favor, insira um Celular válido com DDD. Formato: (XX) XXXX-XXXX ou (XX) XXXXX-XXXX.");
        return;
      }
    }

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

  useEffect(() => {
    if (isModal) return;
    const anyWindow = window as any;
    if (anyWindow.require) {
      const { ipcRenderer } = anyWindow.require('electron');
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

  return {
    activeTab,
    setActiveTab,
    activeSubTab,
    setActiveSubTab,
    logoUrl,
    setLogoUrl,
    isSearchModalOpen,
    setIsSearchModalOpen,
    isLoading,
    error,
    themeMode,
    setThemeMode,
    themePalette,
    setThemePalette,
    company,
    setCompany,
    print,
    setPrint,
    system,
    setSystem,
    email,
    setEmail,
    handleCancel,
    handleSave,
    navigate
  };
}
