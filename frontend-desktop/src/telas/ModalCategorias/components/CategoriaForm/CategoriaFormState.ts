import React from 'react';

interface UseCategoriaFormProps {
  setImageBase64: (val: string) => void;
  setError: (val: string) => void;
}

export function useCategoriaForm({ setImageBase64, setError }: UseCategoriaFormProps) {
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("A imagem deve ter no máximo 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return {
    handleImageUpload
  };
}
