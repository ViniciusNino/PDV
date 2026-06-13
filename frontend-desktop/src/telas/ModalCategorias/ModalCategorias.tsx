import { Folder, X } from 'lucide-react';
import { useModalCategorias } from './ModalCategoriasState';
import { CategoriaList } from './components/CategoriaList/CategoriaList';
import { CategoriaForm } from './components/CategoriaForm/CategoriaForm';
import { DelecaoConfirmModal } from './components/DelecaoConfirmModal/DelecaoConfirmModal';
import './ModalCategorias.css';

interface ModalCategoriasProps {
  onClose: () => void;
  isWindowMode?: boolean;
}

export function ModalCategorias({ onClose, isWindowMode = false }: ModalCategoriasProps) {
  const state = useModalCategorias();

  const cardBody = (
    <div className="cat-modal-card glass-panel" onClick={(e) => e.stopPropagation()} style={isWindowMode ? { width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%', borderRadius: 0, border: 'none' } : {}}>
      
      {/* Header do Modal */}
      {!isWindowMode && (
        <header className="cat-modal-header">
          <div className="cat-header-title">
            <Folder size={20} className="cat-folder-icon" />
            <span>Gerenciamento de Categorias</span>
          </div>
          <button className="cat-btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
      )}

      {/* Mensagens de Notificação */}
      {state.error && (
        <div className="cat-alert cat-alert-danger animate-slide-in">
          <span>{state.error}</span>
        </div>
      )}
      {state.successMessage && (
        <div className="cat-alert cat-alert-success animate-slide-in">
          <span>{state.successMessage}</span>
        </div>
      )}

      {/* Corpo do Modal (Layout em 2 Colunas) */}
      <div className="cat-modal-body">
        
        {/* Coluna Esquerda: Listagem */}
        <CategoriaList 
          categories={state.categories}
          isLoading={state.isLoading}
          editingId={state.editingId}
          draggedId={state.draggedId}
          dragOverId={state.dragOverId}
          expandedParents={state.expandedParents}
          handleEditStart={state.handleEditStart}
          handleDeleteTrigger={state.handleDeleteTrigger}
          toggleExpand={state.toggleExpand}
          handleDragStart={state.handleDragStart}
          handleDragOver={state.handleDragOver}
          handleDrop={state.handleDrop}
          handleDragEnd={state.handleDragEnd}
        />

        {/* Coluna Direita: Formulário */}
        <CategoriaForm 
          categories={state.categories}
          name={state.name}
          setName={state.setName}
          description={state.description}
          setDescription={state.setDescription}
          parentCategoryId={state.parentCategoryId}
          setParentCategoryId={state.setParentCategoryId}
          imageBase64={state.imageBase64}
          setImageBase64={state.setImageBase64}
          editingId={state.editingId}
          isSaving={state.isSaving}
          handleSubmit={state.handleSubmit}
          handleEditCancel={state.handleEditCancel}
          setError={state.setError}
        />

      </div>

      {/* Modal Customizado de Confirmação de Deleção */}
      {state.deleteConfirmId && state.deleteConfirmName && (
        <DelecaoConfirmModal 
          categoryName={state.deleteConfirmName}
          onCancel={() => {
            state.setDeleteConfirmId(null);
            state.setDeleteConfirmName(null);
          }}
          onConfirm={() => {
            const id = state.deleteConfirmId!;
            state.setDeleteConfirmId(null);
            state.setDeleteConfirmName(null);
            state.executeDelete(id);
          }}
        />
      )}
    </div>
  );

  return (
    isWindowMode ? (
      cardBody
    ) : (
      <div className="cat-modal-overlay animate-fade-in" onClick={onClose}>
        {cardBody}
      </div>
    )
  );
}
