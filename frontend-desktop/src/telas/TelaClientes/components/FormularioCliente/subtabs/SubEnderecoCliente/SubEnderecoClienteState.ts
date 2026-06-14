import { useCallback } from 'react';

interface UseSubEnderecoClienteProps {
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export function useSubEnderecoCliente({ setFormData }: UseSubEnderecoClienteProps) {
  
  const formatCep = useCallback((val: string): string => {
    const digits = val.replace(/\D/g, '');
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
  }, []);

  const handleCepSearch = useCallback((cepStr: string) => {
    const formatted = formatCep(cepStr);
    setFormData((prev: any) => ({ ...prev, cep: formatted }));
    
    const cleanCep = cepStr.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
        .then(res => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then(data => {
          if (!data.erro) {
            setFormData((prev: any) => ({
              ...prev,
              cep: data.cep,
              state: data.uf, // Salvamos a sigla do estado para compatibilidade
              city: data.localidade,
              neighborhood: data.bairro,
              street: data.logradouro
            }));
          }
        })
        .catch(err => console.error('Erro ao buscar CEP:', err));
    }
  }, [formatCep, setFormData]);

  return {
    formatCep,
    handleCepSearch
  };
}
