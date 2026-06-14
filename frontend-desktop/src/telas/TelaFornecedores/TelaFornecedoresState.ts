import { useState, useCallback, useEffect } from 'react';
import type { CompanyConfig } from '../TelaConfiguracao/TelaConfiguracaoState';
import { apiClient } from '../../services/apiClient';

// ─── Interface do Fornecedor ────────────────────────────────────────────────
export interface Fornecedor {
  id: string;
  // Dados Básicos (SubBasico)
  tradingName: string;
  companyName: string;
  phone: string;
  logoUrl: string;
  // Documentos (SubDocumentos)
  cnpj: string;
  stateRegistration: string;
  municipalRegistration: string;
  foundationDate: string;
  // Contato (SubContato)
  email: string;
  cellphone: string;
  slogan: string;
  // Social (SubSocial)
  facebook: string;
  twitter: string;
  linkedin: string;
  // Outros (SubOutros)
  purchaseLimit: number;
  shareholder: string;
  // Endereço (SubEndereco)
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  locationType: string;
  street: string;
  number: string;
  complement: string;
  referencePoint: string;
  building: string;
  apartmentNumber: string;
  block: string;
  floor: string;
  login?: string;
  password?: string;
}

// ─── Fornecedor vazio (modelo em branco para formulário novo) ────────────────
export const fornecedorVazio: Omit<Fornecedor, 'id'> = {
  tradingName: '',
  companyName: '',
  phone: '',
  logoUrl: '',
  cnpj: '',
  stateRegistration: '',
  municipalRegistration: '',
  foundationDate: '',
  email: '',
  cellphone: '',
  slogan: '',
  facebook: '',
  twitter: '',
  linkedin: '',
  purchaseLimit: 0,
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
  building: '',
  apartmentNumber: '',
  block: '',
  floor: '',
  login: '',
  password: '',
};

// ─── Conversores Fornecedor ↔ CompanyConfig ──────────────────────────────────
export function fornecedorToCompany(f: Omit<Fornecedor, 'id'>): CompanyConfig {
  return {
    tradingName: f.tradingName,
    companyName: f.companyName,
    phone: f.phone,
    logoUrl: f.logoUrl,
    cnpj: f.cnpj,
    stateRegistration: f.stateRegistration,
    municipalRegistration: f.municipalRegistration,
    foundationDate: f.foundationDate,
    email: f.email,
    cellphone: f.cellphone,
    slogan: f.slogan,
    facebook: f.facebook,
    twitter: f.twitter,
    linkedin: f.linkedin,
    purchaseLimit: f.purchaseLimit,
    shareholder: f.shareholder,
    cep: f.cep,
    state: f.state,
    city: f.city,
    neighborhood: f.neighborhood,
    locationType: f.locationType,
    street: f.street,
    number: f.number,
    complement: f.complement,
    referencePoint: f.referencePoint,
    building: f.building,
    apartmentNumber: f.apartmentNumber,
    block: f.block,
    floor: f.floor,
    login: f.login || '',
    password: f.password || '',
  };
}

export function companyToFornecedor(c: CompanyConfig): Omit<Fornecedor, 'id'> {
  return {
    tradingName: c.tradingName,
    companyName: c.companyName,
    phone: c.phone,
    logoUrl: c.logoUrl,
    cnpj: c.cnpj,
    stateRegistration: c.stateRegistration,
    municipalRegistration: c.municipalRegistration,
    foundationDate: c.foundationDate,
    email: c.email,
    cellphone: c.cellphone,
    slogan: c.slogan,
    facebook: c.facebook,
    twitter: c.twitter,
    linkedin: c.linkedin,
    purchaseLimit: c.purchaseLimit,
    shareholder: c.shareholder,
    cep: c.cep,
    state: c.state,
    city: c.city,
    neighborhood: c.neighborhood,
    locationType: c.locationType,
    street: c.street,
    number: c.number,
    complement: c.complement,
    referencePoint: c.referencePoint,
    building: c.building || '',
    apartmentNumber: c.apartmentNumber || '',
    block: c.block || '',
    floor: c.floor || '',
    login: c.login || '',
    password: c.password || '',
  };
}

// ─── Mock inicial de fornecedores ────────────────────────────────────────────
const mockFornecedores: Fornecedor[] = [
  {
    id: '1',
    tradingName: 'Distribuidora BevMax',
    companyName: 'BevMax Comércio e Distribuição Ltda',
    phone: '(11) 3344-5566',
    logoUrl: '',
    cnpj: '12.345.678/0001-90',
    stateRegistration: '123456789',
    municipalRegistration: '',
    foundationDate: '2005-03-15',
    email: 'contato@bevmax.com.br',
    cellphone: '(11) 99887-6655',
    slogan: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    purchaseLimit: 50000,
    shareholder: '',
    cep: '01310-100',
    state: 'SP',
    city: 'São Paulo',
    neighborhood: 'Bela Vista',
    locationType: 'Loja',
    street: 'Av. Paulista',
    number: '1500',
    complement: 'Sala 12',
    referencePoint: 'Próx. ao MASP',
    building: '',
    apartmentNumber: '',
    block: '',
    floor: '',
  },
  {
    id: '2',
    tradingName: 'Carnes do Sul',
    companyName: 'Frigorífico Sul Brasileiro S.A.',
    phone: '(51) 3210-4567',
    logoUrl: '',
    cnpj: '98.765.432/0001-10',
    stateRegistration: '987654321',
    municipalRegistration: '',
    foundationDate: '1998-07-20',
    email: 'vendas@carnesdosul.com.br',
    cellphone: '(51) 99765-4321',
    slogan: 'Qualidade do campo à mesa',
    facebook: 'https://facebook.com/carnesdosul',
    twitter: '',
    linkedin: '',
    purchaseLimit: 100000,
    shareholder: 'João da Silva',
    cep: '90010-270',
    state: 'RS',
    city: 'Porto Alegre',
    neighborhood: 'Centro Histórico',
    locationType: 'Casa',
    street: 'Rua dos Andradas',
    number: '1234',
    complement: '',
    referencePoint: '',
    building: '',
    apartmentNumber: '',
    block: '',
    floor: '',
  },
];

// ─── Hook principal ──────────────────────────────────────────────────────────
export function useTelaFornecedores() {
  // Lista de fornecedores (inicialmente vazia, carregada da API)
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);

  // Fornecedor selecionado na lista
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Estado do formulário como CompanyConfig (para Sub* components)
  const [formData, setFormData] = useState<CompanyConfig>(
    fornecedorToCompany(fornecedorVazio)
  );

  // Logo URL (gerenciado separadamente como no SubBasico)
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Sub-aba ativa do formulário
  const [activeSubTab, setActiveSubTab] = useState('Basico');

  // Alertas
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Modal de busca (para SubOutros)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Filtro da lista
  const [filterQuery, setFilterQuery] = useState('');

  // Carrega os fornecedores a partir da API
  const carregarFornecedores = useCallback(async () => {
    try {
      const response = await apiClient.get<Fornecedor[]>('/suppliers');
      setFornecedores(response);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Erro ao carregar fornecedores da API.');
    }
  }, []);

  // Busca inicial dos dados
  useEffect(() => {
    carregarFornecedores();
  }, [carregarFornecedores]);

  // Sincroniza o formulário com o fornecedor selecionado
  useEffect(() => {
    if (selectedId) {
      const found = fornecedores.find(f => f.id === selectedId);
      if (found) {
        setFormData(fornecedorToCompany(found));
        setLogoUrl(found.logoUrl || null);
      }
    } else {
      setFormData(fornecedorToCompany(fornecedorVazio));
      setLogoUrl(null);
    }
  }, [selectedId, fornecedores]);

  // Temporizadores para limpar erros e mensagens de sucesso automaticamente (efeito toast)
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // ─── Ações CRUD ──────────────────────────────────────────────────────────
  const handleNovo = useCallback(() => {
    setFormData(fornecedorToCompany(fornecedorVazio));
    setLogoUrl(null);
    setActiveSubTab('Basico');
    setSelectedId(null);
    setError('');
    setSuccessMessage('');
  }, []);

  const handleEditar = useCallback((id?: string) => {
    const targetId = id || selectedId;
    if (!targetId) {
      setError('Selecione um fornecedor para editar.');
      return;
    }
    const found = fornecedores.find(f => f.id === targetId);
    if (!found) return;
    setSelectedId(targetId);
    setFormData(fornecedorToCompany(found));
    setLogoUrl(found.logoUrl || null);
    setActiveSubTab('Basico');
    setError('');
    setSuccessMessage('');
  }, [selectedId, fornecedores]);

  const handleSalvar = useCallback(async () => {
    setError('');
    if (!formData.tradingName.trim()) {
      setError('O campo Fantasia é obrigatório.');
      setActiveSubTab('Basico');
      return;
    }
    if (!formData.companyName.trim()) {
      setError('O campo Razão Social é obrigatório.');
      setActiveSubTab('Basico');
      return;
    }

    const dadosSalvar = companyToFornecedor(formData);
    
    // Tratamento para limpar strings vazias (que falham na validação do C#) para null
    const body: any = {};
    Object.entries(dadosSalvar).forEach(([key, value]) => {
      body[key] = (typeof value === 'string' && value.trim() === '') ? null : value;
    });

    body.foundationDate = dadosSalvar.foundationDate ? dadosSalvar.foundationDate : null;
    body.logoUrl = logoUrl || null;

    try {
      if (!selectedId) {
        const response = await apiClient.post<Fornecedor>('/suppliers', body);
        setFornecedores(prev => [...prev, response]);
        setFormData(fornecedorToCompany(fornecedorVazio));
        setLogoUrl(null);
        setSuccessMessage(`Fornecedor "${dadosSalvar.tradingName}" cadastrado com sucesso!`);
      } else {
        const response = await apiClient.put<Fornecedor>(`/suppliers/${selectedId}`, body);
        setFornecedores(prev => prev.map(f => f.id === selectedId ? response : f));
        setSelectedId(null);
        setFormData(fornecedorToCompany(fornecedorVazio));
        setLogoUrl(null);
        setSuccessMessage(`Fornecedor "${dadosSalvar.tradingName}" atualizado com sucesso!`);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Erro ao salvar fornecedor.');
    }
  }, [formData, selectedId, logoUrl]);

  const handleExcluir = useCallback(async (id?: string) => {
    const targetId = id || selectedId;
    if (!targetId) {
      setError('Selecione um fornecedor para excluir.');
      return;
    }
    const found = fornecedores.find(f => f.id === targetId);
    if (!found) return;
    if (!window.confirm(`Deseja excluir o fornecedor "${found.tradingName}"?`)) return;

    try {
      await apiClient.delete(`/suppliers/${targetId}`);
      setFornecedores(prev => prev.filter(f => f.id !== targetId));
      if (selectedId === targetId) {
        setSelectedId(null);
        setFormData(fornecedorToCompany(fornecedorVazio));
        setLogoUrl(null);
      }
      setSuccessMessage(`Fornecedor "${found.tradingName}" excluído.`);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Erro ao excluir fornecedor.');
    }
  }, [selectedId, fornecedores]);

  const handleCancelar = useCallback(() => {
    setSelectedId(null);
    setFormData(fornecedorToCompany(fornecedorVazio));
    setLogoUrl(null);
    setError('');
    setSuccessMessage('');
  }, []);

  // ─── Lista filtrada ──────────────────────────────────────────────────────
  const fornecedoresFiltrados = filterQuery.trim()
    ? fornecedores.filter(f => {
        const q = filterQuery.toLowerCase();
        return (
          f.tradingName.toLowerCase().includes(q) ||
          f.companyName.toLowerCase().includes(q) ||
          f.cnpj.includes(q) ||
          f.phone.includes(q) ||
          f.city.toLowerCase().includes(q)
        );
      })
    : fornecedores;

  return {
    // Lista
    fornecedores,
    fornecedoresFiltrados,
    filterQuery,
    setFilterQuery,

    // Seleção
    selectedId,
    setSelectedId,

    // Formulário
    formData,
    setFormData,
    logoUrl,
    setLogoUrl,
    activeSubTab,
    setActiveSubTab,

    // Modal de busca (para SubOutros)
    isSearchModalOpen,
    setIsSearchModalOpen,

    // Alertas
    error,
    setError,
    successMessage,
    setSuccessMessage,

    // Ações
    handleNovo,
    handleEditar,
    handleSalvar,
    handleExcluir,
    handleCancelar,
  };
}
