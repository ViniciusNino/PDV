import { useState } from 'react';

interface UseImportarXmlProps {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export function useImportarXml({ onSuccess, onError }: UseImportarXmlProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const processXmlFile = (file: File) => {
    if (!file.name.endsWith('.xml')) {
      onError("Formato de arquivo inválido. Apenas arquivos XML são permitidos.");
      return;
    }

    setIsLoading(true);
    setFileName(file.name);
    
    // Simula a leitura e importação da nota fiscal
    setTimeout(() => {
      setIsLoading(false);
      onSuccess(`Nota Fiscal do XML "${file.name}" importada com sucesso para conciliação!`);
    }, 1500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processXmlFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processXmlFile(file);
    }
  };

  return {
    isDragOver,
    isLoading,
    fileName,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInputChange
  };
}
