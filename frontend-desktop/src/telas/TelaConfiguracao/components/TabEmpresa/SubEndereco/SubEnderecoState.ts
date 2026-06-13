import type { CompanyConfig } from '../../../TelaConfiguracaoState';

interface SubEnderecoStateProps {
  setCompany: React.Dispatch<React.SetStateAction<CompanyConfig>>;
}

export function useSubEndereco({ setCompany }: SubEnderecoStateProps) {
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
              state: data.uf === 'RJ' ? 'Rio de Janeiro'
                   : data.uf === 'SP' ? 'São Paulo'
                   : data.uf === 'MG' ? 'Minas Gerais'
                   : data.uf,
              city: data.localidade,
              neighborhood: data.bairro,
              street: data.logradouro
            }));
          }
        })
        .catch(err => console.error('Erro ao buscar CEP:', err));
    }
  };

  return { handleCepSearch };
}
