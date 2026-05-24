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
}

export function ModalCategorias({ onClose }: ModalCategoriasProps) {
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
    setDragOverId(id);
  };

  const handleDrop = async (e: React.DragEvent<HTMLTableRowElement>, dropId: string) => {
    e.preventDefault();
    if (draggedId === null || draggedId === dropId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const updatedCategories = [...categories];
    const draggedIndex = updatedCategories.findIndex(c => c.id === draggedId);
    const dropIndex = updatedCategories.findIndex(c => c.id === dropId);
    
    if (draggedIndex === -1 || dropIndex === -1) return;

    const draggedItem = updatedCategories[draggedIndex];
    updatedCategories.splice(draggedIndex, 1);
    updatedCategories.splice(dropIndex, 0, draggedItem);
    
    setCategories(updatedCategories);
    setDraggedId(null);
    setDragOverId(null);

    // Salva ordem no banco
    try {
      const orderedIds = updatedCategories.map(c => c.id);
      const response = await fetch('http://localhost:5121/api/categories/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderedIds })
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

  return (
    <div className="cat-modal-overlay animate-fade-in" onClick={onClose}>
      <div className="cat-modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
        
        {/* Header do Modal */}
        <header className="cat-modal-header">
          <div className="cat-header-title">
            <Folder size={20} className="cat-folder-icon" />
            <span>Gerenciamento de Categorias</span>
          </div>
          <button className="cat-btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </header>

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
                      .map((parentCategory) => {
                        const hasSubs = categories.some(c => c.parentCategoryId === parentCategory.id);
                        const isExpanded = expandedParents.has(parentCategory.id);
                        
                        const renderRow = (category: Category, isSub: boolean) => {
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
                              className={rowClasses.trim()}
                              draggable
                              onDragStart={(e) => handleDragStart(e, category.id)}
                              onDragOver={(e) => handleDragOver(e, category.id)}
                              onDrop={(e) => handleDrop(e, category.id)}
                              onDragEnd={handleDragEnd}
                              onDragEnter={(e) => { e.preventDefault(); setDragOverId(category.id); }}
                            >
                              <td className="cat-name-cell">
                                <div className="cat-name-flex" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: isSub ? '1.5rem' : '0' }}>
                                  {!isSub && (
                                    <div style={{ width: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      {hasSubs && (
                                        <button 
                                          type="button"
                                          onClick={(e) => { e.stopPropagation(); toggleExpand(category.id); }}
                                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex', transition: 'color 0.2s' }}
                                          title={isExpanded ? "Recolher subcategorias" : "Expandir subcategorias"}
                                        >
                                          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                        </button>
                                      )}
                                    </div>
                                  )}
                                  {isSub && (
                                    <span style={{ color: 'var(--text-muted)' }}>↳</span>
                                  )}
                                  <div className="cat-thumb-wrapper" style={{ width: '32px', height: '32px', borderRadius: '4px', overflow: 'hidden', background: 'var(--bg-tertiary)', flexShrink: 0 }}>
                                    {category.imageBase64 ? (
                                      <img src={category.imageBase64} alt="Categoria" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ImageIcon size={16} className="text-muted" />
                                      </div>
                                    )}
                                  </div>
                                  <span className="cat-name-text">{category.name}</span>
                                </div>
                              </td>
                              <td className="cat-desc-cell">{category.description || '-'}</td>
                              <td className="cat-order-cell">
                                <div className="order-actions" style={{ cursor: 'grab' }} title="Arraste para reordenar">
                                  <GripVertical size={20} className="cat-drag-handle" />
                                </div>
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
                            {isExpanded && categories.filter(c => c.parentCategoryId === parentCategory.id).map(sub => renderRow(sub, true))}
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
                <label>Imagem da Categoria (Opcional)</label>
                <div className="cat-image-upload-area" onClick={() => document.getElementById('cat-image-input')?.click()}>
                  <input 
                    type="file" 
                    id="cat-image-input" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    style={{ display: 'none' }}
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
              </div>

              <div className="cat-form-group">
                <label htmlFor="cat-parent">Categoria Principal (Opcional)</label>
                <select 
                  id="cat-parent"
                  value={parentCategoryId}
                  onChange={(e) => setParentCategoryId(e.target.value)}
                  disabled={isSaving}
                  className="cat-select"
                >
                  <option value="">Nenhuma (Categoria Principal)</option>
                  {categories.filter(c => c.id !== editingId && !c.parentCategoryId).map(parent => (
                    <option key={parent.id} value={parent.id}>
                      {parent.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="cat-form-group">
                <label htmlFor="cat-name">Nome da Categoria *</label>
                <input 
                  type="text" 
                  id="cat-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Bebidas, Pizzas, Sobremesas"
                  maxLength={50}
                  required
                  disabled={isSaving}
                  autoComplete="off"
                />
              </div>

              <div className="cat-form-group">
                <label htmlFor="cat-desc">Descrição (Opcional)</label>
                <textarea 
                  id="cat-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Breve descrição dos itens pertencentes a esta categoria"
                  maxLength={200}
                  rows={4}
                  disabled={isSaving}
                />
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
}
