import { useRef } from 'react';
import type { CompanyConfig } from '../../../TelaConfiguracaoState';

interface SubBasicoStateProps {
  setCompany: React.Dispatch<React.SetStateAction<CompanyConfig>>;
  setLogoUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

export function useSubBasico({ setCompany, setLogoUrl }: SubBasicoStateProps) {
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

  return { fileInputRef, triggerLogoUpload, handleLogoUpload, clearLogo };
}
