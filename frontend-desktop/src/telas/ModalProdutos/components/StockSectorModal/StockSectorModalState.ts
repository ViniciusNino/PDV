import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '../../../../services/apiClient';

export function useStockSectorModal() {
  const [sectorsList, setSectorsList] = useState<any[]>([]);
  const [sectorName, setSectorName] = useState('');
  const [sectorDescription, setSectorDescription] = useState('');
  const [editingSectorId, setEditingSectorId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const clearMessages = () => {
    setError('');
    setSuccessMessage('');
  };

  const fetchSectors = useCallback(() => {
    return apiClient.get('/stocksectors')
      .then((data: any) => {
        setSectorsList(data);
        return data;
      })
      .catch((err: any) => {
        console.error("Erro ao carregar setores:", err);
      });
  }, []);

  useEffect(() => {
    fetchSectors();
  }, [fetchSectors]);

  const handleSaveSector = async () => {
    clearMessages();
    if (!sectorName.trim()) {
      setError("O nome do setor é obrigatório.");
      return;
    }
    try {
      const payload = {
        name: sectorName.trim(),
        description: sectorDescription.trim()
      };
      
      if (editingSectorId) {
        await apiClient.put(`/stocksectors/${editingSectorId}`, payload);
      } else {
        await apiClient.post('/stocksectors', payload);
      }

      setSuccessMessage(editingSectorId ? "Setor atualizado com sucesso!" : "Setor cadastrado com sucesso!");
      setSectorName('');
      setSectorDescription('');
      setEditingSectorId(null);
      fetchSectors();
    } catch (err: any) {
      setError("Erro ao salvar setor: " + err.message);
    }
  };

  const handleEditSector = (sector: any) => {
    clearMessages();
    setEditingSectorId(sector.id);
    setSectorName(sector.name);
    setSectorDescription(sector.description || '');
  };

  const handleCancelSectorEdit = () => {
    clearMessages();
    setEditingSectorId(null);
    setSectorName('');
    setSectorDescription('');
  };

  const handleDeleteSector = async (sectorId: string, name: string) => {
    clearMessages();
    if (!window.confirm(`Tem certeza que deseja excluir o setor "${name}"?`)) return;
    try {
      await apiClient.delete(`/stocksectors/${sectorId}`);

      setSuccessMessage("Setor excluído com sucesso!");
      if (editingSectorId === sectorId) {
        setEditingSectorId(null);
        setSectorName('');
        setSectorDescription('');
      }
      fetchSectors();
    } catch (err: any) {
      setError("Erro ao excluir setor: " + err.message);
    }
  };

  return {
    sectorsList,
    sectorName,
    setSectorName,
    sectorDescription,
    setSectorDescription,
    editingSectorId,
    error,
    successMessage,
    handleSaveSector,
    handleEditSector,
    handleCancelSectorEdit,
    handleDeleteSector,
    fetchSectors
  };
}
