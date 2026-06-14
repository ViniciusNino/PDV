import { useRef, useCallback } from 'react';

interface UseSubBasicoClienteProps {
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  setLogoUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

export function useSubBasicoCliente({ setFormData, setLogoUrl }: UseSubBasicoClienteProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerLogoUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoUrl(result);
        setFormData((prev: any) => ({ ...prev, logoUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  }, [setFormData, setLogoUrl]);

  const clearLogo = useCallback(() => {
    setLogoUrl(null);
    setFormData((prev: any) => ({ ...prev, logoUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [setFormData, setLogoUrl]);

  return {
    fileInputRef,
    triggerLogoUpload,
    handleLogoUpload,
    clearLogo
  };
}
