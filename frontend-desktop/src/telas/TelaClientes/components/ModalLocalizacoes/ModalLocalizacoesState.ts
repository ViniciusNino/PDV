import { useState, useCallback, useEffect } from 'react';

export interface LocalizacaoCliente {
  id: string;
  apelido: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  locationType: string;
  street: string;
  number: string;
  complement: string;
  referencePoint: string;
  enabled: boolean;
}

export const localizacaoVazia: Omit<LocalizacaoCliente, 'id'> = {
  apelido: '',
  cep: '',
  state: '',
  city: '',
  neighborhood: '',
  locationType: 'Casa',
  street: '',
  number: '',
  complement: '',
  referencePoint: '',
  enabled: true
};

interface UseModalLocalizacoesProps {
  clienteId: string;
}

export function useModalLocalizacoes({ clienteId }: UseModalLocalizacoesProps) {
  const [localizacoes, setLocalizacoes] = useState<LocalizacaoCliente[]>([]);
  const [selectedLocId, setSelectedLocId] = useState<string | null>(null);
  
  const [locData, setLocData] = useState<Omit<LocalizacaoCliente, 'id'>>({
    ...localizacaoVazia
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Carrega do localStorage
  useEffect(() => {
    if (clienteId) {
      try {
        const key = `mock_localizacoes_cliente_${clienteId}`;
        const saved = localStorage.getItem(key);
        setLocalizacoes(saved ? JSON.parse(saved) : []);
      } catch {
        setLocalizacoes([]);
      }
      // Reseta formulário
      setLocData({ ...localizacaoVazia });
      setSelectedLocId(null);
    }
  }, [clienteId]);

  // Toast
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Sincroniza formulário ao selecionar item na lista
  useEffect(() => {
    if (selectedLocId) {
      const found = localizacoes.find(l => l.id === selectedLocId);
      if (found) {
        setLocData({
          apelido: found.apelido,
          cep: found.cep,
          state: found.state,
          city: found.city,
          neighborhood: found.neighborhood,
          locationType: found.locationType,
          street: found.street,
          number: found.number,
          complement: found.complement,
          referencePoint: found.referencePoint,
          enabled: found.enabled
        });
      }
    } else {
      setLocData({ ...localizacaoVazia });
    }
  }, [selectedLocId, localizacoes]);

  const persistir = useCallback((lista: LocalizacaoCliente[]) => {
    setLocalizacoes(lista);
    const key = `mock_localizacoes_cliente_${clienteId}`;
    localStorage.setItem(key, JSON.stringify(lista));
  }, [clienteId]);

  const handleSalvarLoc = useCallback(() => {
    setError('');
    if (!locData.apelido.trim()) {
      setError('O campo Apelido é obrigatório.');
      return;
    }
    if (!locData.street.trim()) {
      setError('O campo Logradouro é obrigatório.');
      return;
    }

    if (!selectedLocId) {
      // Cadastrar
      const nova: LocalizacaoCliente = {
        id: String(Date.now()),
        ...locData
      };
      const novaLista = [...localizacoes, nova];
      persistir(novaLista);
      setSuccess(`Localização "${locData.apelido}" cadastrada com sucesso!`);
      setLocData({ ...localizacaoVazia });
    } else {
      // Editar
      const novaLista = localizacoes.map(l =>
        l.id === selectedLocId ? { ...l, ...locData } : l
      );
      persistir(novaLista);
      setSuccess(`Localização "${locData.apelido}" atualizada!`);
      setSelectedLocId(null);
      setLocData({ ...localizacaoVazia });
    }
  }, [locData, selectedLocId, localizacoes, persistir]);

  const handleExcluirLoc = useCallback((id?: string) => {
    const targetId = id || selectedLocId;
    if (!targetId) {
      setError('Selecione uma localização para excluir.');
      return;
    }
    const found = localizacoes.find(l => l.id === targetId);
    if (!found) return;

    if (window.confirm(`Tem certeza que deseja excluir o endereço "${found.apelido}"?`)) {
      const novaLista = localizacoes.filter(l => l.id !== targetId);
      persistir(novaLista);
      if (selectedLocId === targetId) {
        setSelectedLocId(null);
        setLocData({ ...localizacaoVazia });
      }
      setSuccess(`Localização "${found.apelido}" excluída.`);
    }
  }, [selectedLocId, localizacoes, persistir]);

  const handleLimparLoc = useCallback(() => {
    setSelectedLocId(null);
    setLocData({ ...localizacaoVazia });
    setError('');
    setSuccess('');
  }, []);

  const formatCep = useCallback((val: string): string => {
    const digits = val.replace(/\D/g, '');
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
  }, []);

  const handleCepLocSearch = useCallback((cepStr: string) => {
    const formatted = formatCep(cepStr);
    setLocData(prev => ({ ...prev, cep: formatted }));
    
    const cleanCep = cepStr.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
        .then(res => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then(data => {
          if (!data.erro) {
            setLocData(prev => ({
              ...prev,
              cep: data.cep,
              state: data.uf,
              city: data.localidade,
              neighborhood: data.bairro,
              street: data.logradouro
            }));
          }
        })
        .catch(err => console.error('Erro ao buscar CEP:', err));
    }
  }, [formatCep]);

  return {
    localizacoes,
    selectedLocId,
    setSelectedLocId,
    locData,
    setLocData,
    error,
    success,
    handleSalvarLoc,
    handleExcluirLoc,
    handleLimparLoc,
    handleCepLocSearch
  };
}
