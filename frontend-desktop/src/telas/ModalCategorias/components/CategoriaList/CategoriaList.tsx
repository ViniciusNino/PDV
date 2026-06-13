import React from 'react';
import { 
  Folder, Pencil, Trash2, GripVertical, Loader2, ChevronRight, ChevronDown 
} from 'lucide-react';
import { useCategoriaList } from './CategoriaListState';
import type { Category } from '../../ModalCategoriasState';
import './CategoriaList.css';

interface CategoriaListProps {
  categories: Category[];
  isLoading: boolean;
  editingId: string | null;
  draggedId: string | null;
  dragOverId: string | null;
  expandedParents: Set<string>;
  handleEditStart: (category: Category) => void;
  handleDeleteTrigger: (id: string, name: string) => void;
  toggleExpand: (id: string) => void;
  handleDragStart: (e: React.DragEvent<HTMLTableRowElement>, id: string) => void;
  handleDragOver: (e: React.DragEvent<HTMLTableRowElement>, id: string) => void;
  handleDrop: (e: React.DragEvent<HTMLTableRowElement>, id: string) => void;
  handleDragEnd: (e: React.DragEvent<HTMLTableRowElement>) => void;
}

export function CategoriaList({
  categories,
  isLoading,
  editingId,
  draggedId,
  dragOverId,
  expandedParents,
  handleEditStart,
  handleDeleteTrigger,
  toggleExpand,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd
}: CategoriaListProps) {

  useCategoriaList();

  const renderRow = (category: Category, isSub: boolean, subIndex?: number, parentSeq?: number) => {
    let rowClasses = editingId === category.id ? 'row-editing ' : '';
    if (draggedId === category.id) rowClasses += 'dragging-row ';
    if (dragOverId === category.id && draggedId !== null) {
      const dIdx = categories.findIndex(c => c.id === draggedId);
      const oIdx = categories.findIndex(c => c.id === category.id);
      rowClasses += dIdx < oIdx ? 'drop-target-bottom ' : 'drop-target-top ';
    }

    return (
      <tr 
        key={category.id} 
        className={rowClasses.trim() || undefined}
        draggable
        onDragStart={(e) => handleDragStart(e, category.id)}
        onDragOver={(e) => handleDragOver(e, category.id)}
        onDragEnd={handleDragEnd}
        onDrop={(e) => handleDrop(e, category.id)}
      >
        <td className="cat-name-cell" style={isSub ? { paddingLeft: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' } : { display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {!isSub && categories.some(c => c.parentCategoryId === category.id) && (
            <button 
              type="button"
              className="order-btn" 
              style={{ padding: '2px', border: 'none', background: 'transparent', width: '18px', display: 'flex', justifyContent: 'center' }} 
              onClick={() => toggleExpand(category.id)}
            >
              {expandedParents.has(category.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}
          {!isSub && !categories.some(c => c.parentCategoryId === category.id) && <span style={{ width: '18px', display: 'inline-block' }}></span>}
          {isSub && <span style={{ color: 'var(--primary)', marginRight: '4px', fontSize: '12px' }}>└</span>}
          <GripVertical size={14} className="cat-drag-handle" style={{ cursor: 'grab', marginRight: '6px', flexShrink: 0 }} />
          <div className="cat-item-thumb">
            {category.imageBase64 ? (
              <img src={category.imageBase64} alt={category.name} />
            ) : (
              <Folder size={14} style={{ color: 'var(--text-muted)' }} />
            )}
          </div>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{category.name}</span>
        </td>
        <td className="cat-desc-cell" title={category.description || undefined}>{category.description || '-'}</td>
        <td className="cat-order-cell">
          {isSub && subIndex !== undefined && parentSeq !== undefined
            ? `${parentSeq}.${subIndex}`
            : category.sequence}
        </td>
        <td className="cat-actions-cell">
          <div className="action-buttons">
            <button 
              type="button"
              className="action-btn edit-btn" 
              onClick={() => handleEditStart(category)}
              title="Editar"
            >
              <Pencil size={14} />
            </button>
            <button 
              type="button"
              className="action-btn delete-btn" 
              onClick={() => handleDeleteTrigger(category.id, category.name)}
              title="Excluir"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="cat-list-column">
      <div className="cat-section-header">
        <span className="cat-section-title">Categorias Cadastradas</span>
        <span className="cat-counter">Total: {categories.length}</span>
      </div>

      {isLoading ? (
        <div className="cat-loading-state">
          <Loader2 size={32} className="cat-spinner" />
          <span>Carregando categorias...</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="cat-empty-state">
          <Folder size={48} className="cat-empty-icon" />
          <p>Nenhuma categoria cadastrada.</p>
          <span>Utilize o formulário ao lado para adicionar a primeira categoria do cardápio!</span>
        </div>
      ) : (
        <div className="cat-table-wrapper">
          <table className="cat-table">
            <thead>
              <tr>
                <th style={{ width: '40%' }}>Nome</th>
                <th style={{ width: '35%' }}>Descrição</th>
                <th style={{ width: '12%', textAlign: 'center' }}>Posição</th>
                <th style={{ width: '13%', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {categories
                .filter(c => !c.parentCategoryId)
                .sort((a, b) => a.sequence - b.sequence)
                .map((parentCategory) => {
                  const isExpanded = expandedParents.has(parentCategory.id);
                  
                  return (
                    <React.Fragment key={parentCategory.id}>
                      {renderRow(parentCategory, false)}
                      {isExpanded && categories
                        .filter(c => c.parentCategoryId === parentCategory.id)
                        .sort((a, b) => a.sequence - b.sequence)
                        .map((sub, index) => renderRow(sub, true, index + 1, parentCategory.sequence))
                      }
                    </React.Fragment>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
