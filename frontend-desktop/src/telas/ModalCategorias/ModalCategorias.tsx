import React, { useState, useEffect } from 'react';
import { 
  X, Folder, Pencil, Trash2, GripVertical, 
  AlertCircle, HelpCircle, Save, Loader2, Image as ImageIcon, UploadCloud, ChevronRight, ChevronDown 
} from 'lucide-react';
import './ModalCategorias.css';

interface Category {
  id: string;
  name: string;
  description?: string;
  sequence: number;
  parentCategoryId?: string | null;
  imageBase64?: string | null;
}

interface ModalCategoriasProps {
  onClose: () => void;
  isWindowMode?: boolean;
}

export function ModalCategorias({ onClose, isWindowMode = false }: ModalCategoriasProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentCategoryId, setParentCategoryId] = useState<string>('');
  const [imageBase64, setImageBase64] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

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
  
  // Custom delete confirmation states
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState<string | null>(null);

  // Drag and Drop states
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  
  // Accordion Expand states
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set());

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const token = localStorage.getItem('token');

  // Carrega as categorias ao montar o componente
  const fetchCategories = async () => {
    if (!token) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5121/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error("Erro ao carregar categorias.");
      }
      const data = await response.json();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || "Erro de conexão com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Limpa mensagens após alguns segundos
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Envio do formulário (Criar ou Editar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("O nome da categoria é obrigatório.");
      return;
    }

    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 50) {
      setError("O nome da categoria deve ter entre 2 e 50 caracteres.");
      return;
    }

    if (description.trim().length > 200) {
      setError("A descrição não pode ultrapassar 200 caracteres.");
      return;
    }

    setIsSaving(true);
    setError('');
    
    try {
      const url = editingId 
        ? `http://localhost:5121/api/categories/${editingId}`
        : 'http://localhost:5121/api/categories';
      
      const method = editingId ? 'PUT' : 'POST';

      const payload = { 
        name: trimmedName, 
        description: description.trim(),
        parentCategoryId: parentCategoryId ? parentCategoryId : null,
        imageBase64: imageBase64 ? imageBase64 : null
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(errMsg || "Erro ao salvar categoria.");
      }

      setSuccessMessage(editingId ? "Categoria atualizada!" : "Categoria criada!");
      setName('');
      setDescription('');
      setParentCategoryId('');
      setImageBase64('');
      setEditingId(null);
      fetchCategories();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Abre confirmação de exclusão
  const handleDeleteTrigger = (id: string, catName: string) => {
    setDeleteConfirmId(id);
    setDeleteConfirmName(catName);
    setError('');
  };

  // Executa exclusão após confirmação
  const executeDelete = async (id: string) => {
    setError('');
    try {
      const response = await fetch(`http://localhost:5121/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(errMsg || "Não foi possível excluir a categoria.");
      }

      setSuccessMessage("Categoria excluída com sucesso!");
      if (editingId === id) {
        setEditingId(null);
        setName('');
        setDescription('');
        setParentCategoryId('');
        setImageBase64('');
      }
      fetchCategories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Entrar em modo de edição
  const handleEditStart = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
    setDescription(category.description || '');
    setParentCategoryId(category.parentCategoryId || '');
    setImageBase64(category.imageBase64 || '');
    setError('');
  };

  // Cancelar edição
  const handleEditCancel = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setParentCategoryId('');
    setImageBase64('');
    setError('');
  };

  const toggleExpand = (parentId: string) => {
    setExpandedParents(prev => {
      const next = new Set(prev);
      if (next.has(parentId)) next.delete(parentId);
      else next.add(parentId);
      return next;
    });
  };

  // HTML5 Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    // Pequeno atraso para não sumir a ghost image nativa
    setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        e.target.classList.add('dragging-row');
      }
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedId === null || draggedId === id) return;
    
    // Só permite o drop se pertencerem ao mesmo nível (ambos principais ou subcategorias do mesmo pai)
    const draggedCat = categories.find(c => c.id === draggedId);
    const targetCat = categories.find(c => c.id === id);
    if (draggedCat && targetCat && draggedCat.parentCategoryId === targetCat.parentCategoryId) {
      setDragOverId(id);
    } else {
      setDragOverId(null);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLTableRowElement>, dropId: string) => {
    e.preventDefault();
    if (draggedId === null || draggedId === dropId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const draggedCat = categories.find(c => c.id === draggedId);
    const dropCat = categories.find(c => c.id === dropId);
    
    if (!draggedCat || !dropCat || draggedCat.parentCategoryId !== dropCat.parentCategoryId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    // 1. Filtrar as categorias do mesmo nível e ordená-las pela sequência atual
    const sameLevelCats = categories
      .filter(c => c.parentCategoryId === draggedCat.parentCategoryId)
      .sort((a, b) => a.sequence - b.sequence);
    
    // 2. Reordenar na lista do mesmo nível
    const draggedIndex = sameLevelCats.findIndex(c => c.id === draggedId);
    const dropIndex = sameLevelCats.findIndex(c => c.id === dropId);
    
    if (draggedIndex === -1 || dropIndex === -1) return;
    
    const [draggedItem] = sameLevelCats.splice(draggedIndex, 1);
    sameLevelCats.splice(dropIndex, 0, draggedItem);
    
    // 3. Atualizar as sequências consecutivas (0, 1, 2...) para o mesmo nível
    sameLevelCats.forEach((c, idx) => {
      c.sequence = idx;
    });

    // 4. Mesclar de volta na lista global de categorias
    const updatedCategories = categories.map(c => {
      const matched = sameLevelCats.find(slc => slc.id === c.id);
      return matched ? matched : c;
    });

    setCategories(updatedCategories);
    setDraggedId(null);
    setDragOverId(null);

    // 5. Salvar a nova ordenação no banco de dados com o formato { id, sequence }
    try {
      const items = updatedCategories.map(c => ({ id: c.id, sequence: c.sequence }));
      const response = await fetch('http://localhost:5121/api/categories/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items })
      });

      if (!response.ok) {
        throw new Error("Não foi possível salvar a nova ordenação.");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao salvar ordenação no servidor.");
      fetchCategories(); // Recarrega se falhou
    }
  };
  const handleDragEnd = (e: React.DragEvent<HTMLTableRowElement>) => {
    setDraggedId(null);
    setDragOverId(null);
    if (e.target instanceof HTMLElement) {
      e.target.classList.remove('dragging-row');
    }
  };

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
      {error && (
        <div className="cat-alert cat-alert-danger animate-slide-in">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
      {successMessage && (
        <div className="cat-alert cat-alert-success animate-slide-in">
          <AlertCircle size={16} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Corpo do Modal (Layout em 2 Colunas) */}
      <div className="cat-modal-body">
        
        {/* Coluna Esquerda: Listagem */}
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
                      const hasSubs = categories.some(c => c.parentCategoryId === parentCategory.id);
                      const isExpanded = expandedParents.has(parentCategory.id);
                      
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
                            className={rowClasses || undefined}
                            draggable
                            onDragStart={(e) => handleDragStart(e, category.id)}
                            onDragOver={(e) => handleDragOver(e, category.id)}
                            onDragEnd={handleDragEnd}
                            onDrop={(e) => handleDrop(e, category.id)}
                          >
                            <td className="cat-name-cell" style={isSub ? { paddingLeft: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' } : { display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              {!isSub && hasSubs && (
                                <button 
                                  className="order-btn" 
                                  style={{ padding: '2px', border: 'none', background: 'transparent', width: '18px', display: 'flex', justifyContent: 'center' }} 
                                  onClick={() => toggleExpand(parentCategory.id)}
                                >
                                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </button>
                              )}
                              {!isSub && !hasSubs && <span style={{ width: '18px', display: 'inline-block' }}></span>}
                              {isSub && <span style={{ color: 'var(--primary)', marginRight: '4px', fontSize: '12px' }}>└</span>}
                              <GripVertical size={14} className="cat-drag-handle" style={{ cursor: 'grab', marginRight: '6px', flexShrink: 0 }} />
                              <div className="cat-item-thumb">
                                {category.imageBase64 ? (
                                  <img src={category.imageBase64} alt={category.name} />
                                ) : (
                                  <Folder size={14} style={{ color: 'var(--text-muted)' }} />
                                ) }
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
                                  className="action-btn edit-btn" 
                                  onClick={() => handleEditStart(category)}
                                  title="Editar"
                                >
                                  <Pencil size={14} />
                                </button>
                                <button 
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

        {/* Coluna Direita: Formulário de Inclusão/Edição */}
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

      </div>

      {/* Modal Customizado de Confirmação de Deleção */}
      {deleteConfirmId && (
        <div className="cat-confirm-overlay animate-fade-in" onClick={() => { setDeleteConfirmId(null); setDeleteConfirmName(null); }}>
          <div className="cat-confirm-card glass-panel animate-slide-in" onClick={(e) => e.stopPropagation()}>
            <div className="cat-confirm-icon-wrapper">
              <AlertCircle size={32} className="cat-confirm-icon" />
            </div>
            <h3>Excluir Categoria?</h3>
            <p>Você tem certeza que deseja excluir permanentemente a categoria <strong>"{deleteConfirmName}"</strong>?</p>
            <span className="cat-confirm-warning">Esta ação não poderá ser desfeita e removerá a classificação dos produtos que a utilizam.</span>
            
            <div className="cat-confirm-actions">
              <button 
                className="cat-btn cat-btn-secondary" 
                onClick={() => { setDeleteConfirmId(null); setDeleteConfirmName(null); }}
              >
                Cancelar
              </button>
              <button 
                className="cat-btn cat-btn-danger" 
                onClick={() => {
                  const id = deleteConfirmId;
                  setDeleteConfirmId(null);
                  setDeleteConfirmName(null);
                  executeDelete(id);
                }}
              >
                Excluir Categoria
              </button>
            </div>
          </div>
        </div>
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
