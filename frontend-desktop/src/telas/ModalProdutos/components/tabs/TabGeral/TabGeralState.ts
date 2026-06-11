import React from 'react';


interface UseTabGeralProps {
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  setError: (msg: string) => void;
}

export function useTabGeral({ setFormData, setError }: UseTabGeralProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação de tipo de arquivo
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError("Tipo de arquivo inválido. Apenas imagens nos formatos PNG, JPG, JPEG e WEBP são permitidas.");
      return;
    }

    // Validação de tamanho (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('A imagem é muito grande. O limite máximo permitido é de 2MB. Otimize a imagem ou envie um arquivo de menor resolução.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Validação de dimensões limites (máximo 2500x2500px)
        const MAX_WIDTH = 2500;
        const MAX_HEIGHT = 2500;
        if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {
          setError(`As dimensões da imagem são muito grandes (${img.width}x${img.height}px). O limite sugerido para o sistema é de até ${MAX_WIDTH}x${MAX_HEIGHT}px. Por favor, envie uma imagem com dimensões menores.`);
          return;
        }
        setFormData((prev: any) => ({ ...prev, imageBase64: event.target?.result as string }));
      };
      img.onerror = () => {
        setError("Erro ao decodificar a imagem. O arquivo pode estar corrompido.");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return {
    handleImageUpload
  };
}
