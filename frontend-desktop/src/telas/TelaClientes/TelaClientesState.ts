import { useState, useCallback, useEffect } from 'react';

// ─── Interface do Cliente ───────────────────────────────────────────────────
export interface Cliente {
  id: string;
  type: 'Física' | 'Jurídica';
  
  // Pessoa Física
  name?: string;
  gender?: 'Masculino' | 'Feminino' | 'Outro' | '';
  
  // Pessoa Jurídica
  tradingName?: string;
  companyName?: string;
  
  // Comum Básico
  phone: string;
  logoUrl: string; // Imagem / Avatar
  
  // Documentos
  cpf?: string;
  cnpj?: string;
  rg?: string;
  stateRegistration?: string; // RG/IE para Jurídica
  birthDay?: number;
  birthMonth?: string; // "Não informado" ou meses
  
  // Contato
  email: string;
  cellphone: string;
  
  // Social
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  
  // Outros
  purchaseLimit: number;
  
  // Endereço Principal (exibido na tela)
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  locationType: string;
  street: string;
  number: string;
  complement: string;
  referencePoint: string;
  building?: string;
  apartmentNumber?: string;
  block?: string;
  floor?: string;
  
  createdAt: string; // Data de cadastro formatada
}

// ─── Cliente Vazio (Novo Cadastro) ───────────────────────────────────────────
export const clienteVazio: Omit<Cliente, 'id' | 'createdAt'> = {
  type: 'Física',
  name: '',
  gender: '',
  tradingName: '',
  companyName: '',
  phone: '',
  logoUrl: '',
  cpf: '',
  cnpj: '',
  rg: '',
  stateRegistration: '',
  birthDay: 0,
  birthMonth: 'Não informado',
  email: '',
  cellphone: '',
  facebook: '',
  twitter: '',
  linkedin: '',
  purchaseLimit: 0,
  cep: '',
  state: '',
  city: '',
  neighborhood: '',
  locationType: 'Casa',
  street: '',
  number: '',
  complement: '',
  referencePoint: '',
  building: '',
  apartmentNumber: '',
  block: '',
  floor: '',
};

// ─── Mock Inicial de Clientes ────────────────────────────────────────────────
const mockClientes: Cliente[] = [
  {
    id: '1',
    type: 'Física',
    name: 'Administrador do Sistema',
    gender: 'Masculino',
    phone: '(00) 0000-0001',
    logoUrl: '',
    cpf: '',
    rg: '',
    birthDay: 0,
    birthMonth: 'Não informado',
    email: '',
    cellphone: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    purchaseLimit: 0,
    cep: '',
    state: '',
    city: '',
    neighborhood: '',
    locationType: 'Casa',
    street: '',
    number: '',
    complement: '',
    referencePoint: '',
    createdAt: '23/05/2026 15:23:05'
  },
  {
    id: '2',
    type: 'Jurídica',
    tradingName: 'teste',
    companyName: 'teste',
    phone: '(21) 3211-23332',
    logoUrl: '',
    cnpj: '',
    stateRegistration: '',
    birthDay: 0,
    birthMonth: 'Não informado',
    email: '',
    cellphone: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    purchaseLimit: 0,
    cep: '',
    state: '',
    city: '',
    neighborhood: '',
    locationType: 'Empresa',
    street: '',
    number: '',
    complement: '',
    referencePoint: '',
    createdAt: '13/06/2026 14:17:24'
  },
  {
    id: '3',
    type: 'Jurídica',
    tradingName: 'teste 2',
    companyName: 'teste 2',
    phone: '(21) 3211-23321',
    logoUrl: '',
    cnpj: '',
    stateRegistration: '',
    birthDay: 0,
    birthMonth: 'Não informado',
    email: '',
    cellphone: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    purchaseLimit: 0,
    cep: '',
    state: '',
    city: '',
    neighborhood: '',
    locationType: 'Empresa',
    street: '',
    number: '',
    complement: '',
    referencePoint: '',
    createdAt: '13/06/2026 14:18:52'
  }
];

// ─── Hook Principal ─────────────────────────────────────────────────────────
export function useTelaClientes() {
  const [clientes, setClientes] = useState<Cliente[]>(() => {
    try {
      const saved = localStorage.getItem('mock_clientes');
      return saved ? JSON.parse(saved) : mockClientes;
    } catch {
      return mockClientes;
    }
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Estado do formulário
  const [formData, setFormData] = useState<Omit<Cliente, 'id' | 'createdAt'>>({
    ...clienteVazio
  });
  
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState('Basico');
  
  // Alertas e Notificações
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Endereço expandido/escondido na tela principal
  const [showEndereco, setShowEndereco] = useState(false);
  
  // Modal de localizações secundárias
  const [isLocalizacoesOpen, setIsLocalizacoesOpen] = useState(false);

  // Estados de Filtros (Painel Lateral)
  const [filterNome, setFilterNome] = useState('');
  const [filterCpfCnpj, setFilterCpfCnpj] = useState('');
  const [filterTelefone, setFilterTelefone] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterGenero, setFilterGenero] = useState('Todos'); // 'Todos', 'Masculino', 'Feminino'
  const [filterSomenteAniversariantes, setFilterSomenteAniversariantes] = useState(false);

  // Efeito Toast
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Sincroniza formulário com cliente selecionado
  useEffect(() => {
    if (selectedId) {
      const found = clientes.find(c => c.id === selectedId);
      if (found) {
        // Copia os dados
        setFormData({
          type: found.type,
          name: found.name || '',
          gender: found.gender || '',
          tradingName: found.tradingName || '',
          companyName: found.companyName || '',
          phone: found.phone || '',
          logoUrl: found.logoUrl || '',
          cpf: found.cpf || '',
          cnpj: found.cnpj || '',
          rg: found.rg || '',
          stateRegistration: found.stateRegistration || '',
          birthDay: found.birthDay || 0,
          birthMonth: found.birthMonth || 'Não informado',
          email: found.email || '',
          cellphone: found.cellphone || '',
          facebook: found.facebook || '',
          twitter: found.twitter || '',
          linkedin: found.linkedin || '',
          purchaseLimit: found.purchaseLimit || 0,
          cep: found.cep || '',
          state: found.state || '',
          city: found.city || '',
          neighborhood: found.neighborhood || '',
          locationType: found.locationType || 'Casa',
          street: found.street || '',
          number: found.number || '',
          complement: found.complement || '',
          referencePoint: found.referencePoint || '',
          building: found.building || '',
          apartmentNumber: found.apartmentNumber || '',
          block: found.block || '',
          floor: found.floor || '',
        });
        setLogoUrl(found.logoUrl || null);
      }
    } else {
      setFormData({ ...clienteVazio });
      setLogoUrl(null);
    }
  }, [selectedId, clientes]);

  const persistir = useCallback((novaLista: Cliente[]) => {
    setClientes(novaLista);
    localStorage.setItem('mock_clientes', JSON.stringify(novaLista));
  }, []);

  const handleNovo = useCallback(() => {
    setFormData({ ...clienteVazio });
    setLogoUrl(null);
    setSelectedId(null);
    setActiveSubTab('Basico');
    setShowEndereco(false);
    setError('');
    setSuccessMessage('');
  }, []);

  const handleEditar = useCallback((id?: string) => {
    const targetId = id || selectedId;
    if (!targetId) {
      setError('Selecione um cliente para editar.');
      return;
    }
    setSelectedId(targetId);
    setActiveSubTab('Basico');
    setError('');
    setSuccessMessage('');
  }, [selectedId]);

  const handleSalvar = useCallback(() => {
    setError('');
    const nomeCompleto = formData.type === 'Física' ? formData.name : formData.tradingName;
    if (!nomeCompleto || !nomeCompleto.trim()) {
      setError(`O campo ${formData.type === 'Física' ? 'Nome Completo' : 'Fantasia'} é obrigatório.`);
      setActiveSubTab('Basico');
      return;
    }

    const dataCadastroFormatada = () => {
      const d = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    const finalData: Omit<Cliente, 'id' | 'createdAt'> = {
      ...formData,
      logoUrl: logoUrl || '',
    };

    if (!selectedId) {
      const novoId = String(Date.now());
      const novo: Cliente = {
        id: novoId,
        ...finalData,
        createdAt: dataCadastroFormatada()
      };
      const novaLista = [...clientes, novo];
      persistir(novaLista);
      setSelectedId(novoId);
      setSuccessMessage(`Cliente "${nomeCompleto}" cadastrado com sucesso!`);
    } else {
      const novaLista = clientes.map(c =>
        c.id === selectedId
          ? { ...c, ...finalData }
          : c
      );
      persistir(novaLista);
      setSuccessMessage(`Cliente "${nomeCompleto}" atualizado com sucesso!`);
    }
  }, [formData, logoUrl, selectedId, clientes, persistir]);

  const handleExcluir = useCallback((id?: string) => {
    const targetId = id || selectedId;
    if (!targetId) {
      setError('Selecione um cliente para excluir.');
      return;
    }
    const found = clientes.find(c => c.id === targetId);
    const nome = found ? (found.type === 'Física' ? found.name : found.tradingName) : '';

    if (window.confirm(`Tem certeza que deseja excluir o cliente "${nome}"?`)) {
      const novaLista = clientes.filter(c => c.id !== targetId);
      persistir(novaLista);
      if (selectedId === targetId) {
        setSelectedId(null);
        setFormData({ ...clienteVazio });
        setLogoUrl(null);
      }
      setSuccessMessage(`Cliente "${nome}" excluído com sucesso.`);
    }
  }, [selectedId, clientes, persistir]);

  const handleCancelar = useCallback(() => {
    setSelectedId(null);
    setFormData({ ...clienteVazio });
    setLogoUrl(null);
    setShowEndereco(false);
    setError('');
    setSuccessMessage('');
  }, []);

  // Filtros aplicados
  const clientesFiltrados = clientes.filter(c => {
    const nome = c.type === 'Física' ? (c.name || '') : (c.tradingName || '');
    if (filterNome && !nome.toLowerCase().includes(filterNome.toLowerCase())) {
      return false;
    }
    const doc = c.type === 'Física' ? (c.cpf || '') : (c.cnpj || '');
    if (filterCpfCnpj && !doc.replace(/\D/g, '').includes(filterCpfCnpj.replace(/\D/g, ''))) {
      return false;
    }
    const tel = c.phone || '';
    if (filterTelefone && !tel.replace(/\D/g, '').includes(filterTelefone.replace(/\D/g, ''))) {
      return false;
    }
    const email = c.email || '';
    if (filterEmail && !email.toLowerCase().includes(filterEmail.toLowerCase())) {
      return false;
    }
    if (filterGenero !== 'Todos') {
      if (c.type === 'Física' && c.gender !== filterGenero) {
        return false;
      }
      if (c.type === 'Jurídica') {
        // Jurídica não se encaixa em Masculino ou Feminino nos filtros comuns
        return false;
      }
    }
    if (filterSomenteAniversariantes) {
      // Verifica se faz aniversário hoje (ou se informou aniversário)
      const hoje = new Date();
      const diaHoje = hoje.getDate();
      const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
      const mesHoje = meses[hoje.getMonth()];
      
      if (c.birthDay !== diaHoje || c.birthMonth !== mesHoje) {
        return false;
      }
    }
    return true;
  });

  return {
    clientes,
    clientesFiltrados,
    selectedId,
    setSelectedId,
    formData,
    setFormData,
    logoUrl,
    setLogoUrl,
    activeSubTab,
    setActiveSubTab,
    error,
    setError,
    successMessage,
    setSuccessMessage,
    showEndereco,
    setShowEndereco,
    isLocalizacoesOpen,
    setIsLocalizacoesOpen,
    
    // Filtros
    filterNome,
    setFilterNome,
    filterCpfCnpj,
    setFilterCpfCnpj,
    filterTelefone,
    setFilterTelefone,
    filterEmail,
    setFilterEmail,
    filterGenero,
    setFilterGenero,
    filterSomenteAniversariantes,
    setFilterSomenteAniversariantes,

    // CRUD
    handleNovo,
    handleEditar,
    handleSalvar,
    handleExcluir,
    handleCancelar,
  };
}
