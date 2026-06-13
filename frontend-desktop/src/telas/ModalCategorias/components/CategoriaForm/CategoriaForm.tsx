import React from 'react';
import { HelpCircle, Save, Loader2, UploadCloud, Pencil } from 'lucide-react';
import { useCategoriaForm } from './CategoriaFormState';
import type { Category } from '../../ModalCategoriasState';
import './CategoriaForm.css';

interface CategoriaFormProps {
  categories: Category[];
  name: string;
  setName: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  parentCategoryId: string;
  setParentCategoryId: (val: string) => void;
  imageBase64: string;
  setImageBase64: (val: string) => void;
  editingId: string | null;
  isSaving: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handleEditCancel: () => void;
  setError: (msg: string) => void;
}

export function CategoriaForm({
  categories,
  name,
  setName,
  description,
  setDescription,
  parentCategoryId,
  setParentCategoryId,
  imageBase64,
  setImageBase64,
  editingId,
  isSaving,
  handleSubmit,
  handleEditCancel,
  setError
}: CategoriaFormProps) {

  const { handleImageUpload } = useCategoriaForm({
    setImageBase64,
    setError
  });

  return (
    <div className="cat-form-column">
      <div className="cat-section-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span className="cat-section-title">
          {editingId ? 'Editar Categoria' : 'Nova Categoria'}
        </span>
        <div className="cat-tooltip-container">
          <HelpCircle size={16} className="cat-help-icon" />
          <div className="cat-tooltip">
            As categorias definem como os produtos são agrupados no cardápio de vendas do PDV. A posição das categorias reflete a ordem em que aparecem no painel rápido.
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="cat-form">
        <div className="cat-form-group">
          <label>Nome da Categoria <span style={{ color: '#ff4a4a' }}>*</span>:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Ex: Bebidas, Sobremesas"
            disabled={isSaving}
          />
        </div>

        <div className="cat-form-group">
          <label>Descrição:</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Uma breve descrição da categoria..."
            rows={3}
            disabled={isSaving}
          />
        </div>

        <div className="cat-form-group">
          <label>Categoria Pai (Opcional):</label>
          <select 
            value={parentCategoryId} 
            onChange={(e) => setParentCategoryId(e.target.value)}
            disabled={isSaving || editingId !== null}
            className="cat-select"
          >
            <option value="">Nenhuma (Categoria Principal)</option>
            {categories
              .filter(c => !c.parentCategoryId && c.id !== editingId)
              .map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))
            }
          </select>
        </div>

        <div className="cat-form-group">
          <label>Imagem da Categoria:</label>
          <div 
            className="cat-image-upload-area"
            onClick={() => document.getElementById('cat-image-input')?.click()}
            style={{ width: '150px', height: '150px', borderRadius: 'var(--radius-md)' }}
          >
            <input 
              type="file" 
              id="cat-image-input" 
              accept="image/*" 
              onChange={handleImageUpload} 
              style={{ display: 'none' }}
              disabled={isSaving}
            />
            
            {imageBase64 ? (
              <div className="cat-image-preview">
                <img src={imageBase64} alt="Preview" />
                <div className="cat-image-overlay">
                  <Pencil size={20} />
                </div>
              </div>
            ) : (
              <div className="cat-image-placeholder">
                <UploadCloud size={28} />
                <span>Clique para enviar foto</span>
              </div>
            )}
          </div>
          {imageBase64 && (
            <button 
              type="button" 
              className="cat-btn cat-btn-secondary" 
              style={{ marginTop: '0.5rem', width: '150px', padding: '4px', fontSize: '0.8rem' }}
              onClick={(e) => { e.stopPropagation(); setImageBase64(''); }}
              disabled={isSaving}
            >
              Excluir Imagem
            </button>
          )}
        </div>

        <div className="cat-form-actions">
          {editingId && (
            <button 
              type="button" 
              className="cat-btn cat-btn-secondary"
              onClick={handleEditCancel}
              disabled={isSaving}
            >
              Cancelar
            </button>
          )}
          <button 
            type="submit" 
            className="cat-btn cat-btn-primary"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="cat-spinner" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Salvar Categoria</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
