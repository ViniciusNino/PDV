import type { CompanyConfig } from '../../../TelaConfiguracao/TelaConfiguracaoState';

interface UseFormularioFornecedorProps {
  formData: CompanyConfig;
  setError: (msg: string) => void;
  setActiveSubTab: (tab: string) => void;
}

export function useFormularioFornecedor({
  formData,
  setError,
  setActiveSubTab,
}: UseFormularioFornecedorProps) {

  /** Valida os campos obrigatórios e posiciona na aba correta em caso de erro */
  const validateForm = (): boolean => {
    if (!formData.tradingName.trim()) {
      setError('O campo Fantasia é obrigatório.');
      setActiveSubTab('Basico');
      return false;
    }
    if (!formData.companyName.trim()) {
      setError('O campo Razão Social é obrigatório.');
      setActiveSubTab('Basico');
      return false;
    }
    return true;
  };

  return { validateForm };
}
