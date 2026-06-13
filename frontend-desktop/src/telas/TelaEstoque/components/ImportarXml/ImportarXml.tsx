import React, { useRef } from 'react';
import { FileSpreadsheet, AlertCircle } from 'lucide-react';
import { useImportarXml } from './ImportarXmlState';
import './ImportarXml.css';

interface ImportarXmlProps {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export function ImportarXml({ onSuccess, onError }: ImportarXmlProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    isDragOver,
    isLoading,
    fileName,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInputChange
  } = useImportarXml({ onSuccess, onError });

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="xml-tab-container animate-fade-in">
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept=".xml"
        className="hidden-file-input"
      />

      <div 
        className={`xml-upload-panel ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileSelect}
      >
        <div className="xml-icon-large">
          {isLoading ? (
            <div className="loader-spinner"></div>
          ) : (
            <FileSpreadsheet size={48} />
          )}
        </div>
        
        {isLoading ? (
          <>
            <h3>Lendo arquivo XML...</h3>
            <p className="xml-instruction">Aguarde enquanto analisamos o arquivo "{fileName}".</p>
          </>
        ) : (
          <>
            <h3>Importar XML de Nota Fiscal (NFe)</h3>
            <p className="xml-instruction">
              Arraste e solte o arquivo XML da nota fiscal aqui ou clique no botão abaixo para selecionar de seu computador.
            </p>
            <div className="xml-btn-group" onClick={e => e.stopPropagation()}>
              <button 
                type="button" 
                onClick={triggerFileSelect} 
                className="xml-upload-btn"
              >
                Selecionar Arquivo XML
              </button>
            </div>
            <span className="xml-file-hint">Apenas arquivos .xml são aceitos (tamanho máximo 5MB)</span>
          </>
        )}
      </div>

      <div className="xml-info-alert">
        <AlertCircle size={18} />
        <div className="xml-alert-content">
          <h4>Como funciona a importação?</h4>
          <p>
            Ao selecionar o XML da Nota Fiscal, o sistema lerá automaticamente a lista de itens, quantidades, valores e o CNPJ do fornecedor. Você poderá associar os produtos da nota com os produtos cadastrados no seu estoque antes de concluir a entrada.
          </p>
        </div>
      </div>
    </div>
  );
}
