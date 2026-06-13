import { useRef } from 'react';
import type { CompanyConfig } from '../../TelaConfiguracaoState';

interface TabEmpresaStateProps {
  company: CompanyConfig;
  setCompany: React.Dispatch<React.SetStateAction<CompanyConfig>>;
  setLogoUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

export function useTabEmpresa({ setCompany, setLogoUrl }: TabEmpresaStateProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return {
    fileInputRef,
    triggerLogoUpload,
    handleLogoUpload,
    clearLogo,
    handleCepSearch
  };
}
