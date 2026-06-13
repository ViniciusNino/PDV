import React, { useState, useEffect, useCallback } from 'react';

export interface Category {
  id: string;
  name: string;
  description?: string;
  sequence: number;
  parentCategoryId?: string | null;
  imageBase64?: string | null;
}

export function useModalCategorias() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentCategoryId, setParentCategoryId] = useState<string>('');
  const [imageBase64, setImageBase64] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Estados de confirmação de exclusão
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState<string | null>(null);

  // Estados de Drag and Drop
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  
  // Estado de Expansão (Acordeão)
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set());

  // Estados de Status e Notificações
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const token = localStorage.getItem('token');

  // Carrega as categorias do servidor
  const fetchCategories = useCallback(async () => {
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
  }, [token]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Limpa notificações
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

  // Envio do formulário (Inserir ou Editar)
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

  // Abre diálogo de confirmação de exclusão
  const handleDeleteTrigger = (id: string, catName: string) => {
    setDeleteConfirmId(id);
    setDeleteConfirmName(catName);
    setError('');
  };

  // Executa a exclusão de fato
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

  // Alterna expansão de acordeão
  const toggleExpand = (parentId: string) => {
    setExpandedParents(prev => {
      const next = new Set(prev);
      if (next.has(parentId)) next.delete(parentId);
      else next.add(parentId);
      return next;
    });
  };

  // Handlers para reordenação via Drag & Drop
  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
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

    const sameLevelCats = categories
      .filter(c => c.parentCategoryId === draggedCat.parentCategoryId)
      .sort((a, b) => a.sequence - b.sequence);
    
    const draggedIndex = sameLevelCats.findIndex(c => c.id === draggedId);
    const dropIndex = sameLevelCats.findIndex(c => c.id === dropId);
    
    if (draggedIndex === -1 || dropIndex === -1) return;
    
    const [draggedItem] = sameLevelCats.splice(draggedIndex, 1);
    sameLevelCats.splice(dropIndex, 0, draggedItem);
    
    sameLevelCats.forEach((c, idx) => {
      c.sequence = idx;
    });

    const updatedCategories = categories.map(c => {
      const matched = sameLevelCats.find(slc => slc.id === c.id);
      return matched ? matched : c;
    });

    setCategories(updatedCategories);
    setDraggedId(null);
    setDragOverId(null);

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
      fetchCategories();
    }
  };

  const handleDragEnd = (e: React.DragEvent<HTMLTableRowElement>) => {
    setDraggedId(null);
    setDragOverId(null);
    if (e.target instanceof HTMLElement) {
      e.target.classList.remove('dragging-row');
    }
  };

  return {
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
    
    deleteConfirmId,
    setDeleteConfirmId,
    deleteConfirmName,
    setDeleteConfirmName,
    
    draggedId,
    dragOverId,
    expandedParents,
    
    isLoading,
    isSaving,
    error,
    setError,
    successMessage,
    setSuccessMessage,
    
    // Ações
    fetchCategories,
    handleSubmit,
    handleDeleteTrigger,
    executeDelete,
    handleEditStart,
    handleEditCancel,
    toggleExpand,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd
  };
}
