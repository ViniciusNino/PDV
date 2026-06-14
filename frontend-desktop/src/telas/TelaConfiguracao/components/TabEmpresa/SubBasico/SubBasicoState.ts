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
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoUrl(result);
        setCompany(prev => ({ ...prev, logoUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearLogo = () => {
    setLogoUrl(null);
    setCompany(prev => ({ ...prev, logoUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return { fileInputRef, triggerLogoUpload, handleLogoUpload, clearLogo };
}
