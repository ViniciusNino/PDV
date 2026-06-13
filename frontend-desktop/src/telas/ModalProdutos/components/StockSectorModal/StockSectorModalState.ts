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
        if (data && Array.isArray(data)) {
          setSectorsList(data);
          // Atualiza o localStorage local com os dados reais
          localStorage.setItem('mock_stocksectors', JSON.stringify(data));
          return data;
        }
        throw new Error("Formato inválido");
      })
      .catch((err: any) => {
        console.warn("Erro ao carregar setores via API (usando mock/offline):", err);
        const local = localStorage.getItem('mock_stocksectors');
        const list = local ? JSON.parse(local) : [
          { id: '1', name: 'Vendas', description: 'Setor de vendas' },
          { id: '2', name: 'Cozinha', description: 'Cozinha' },
          { id: '3', name: 'Churrasqueira', description: 'Churrasqueira' },
          { id: '4', name: 'Bar', description: 'Setor de bebidas' }
        ];
        setSectorsList(list);
        return list;
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

    const payload = {
      name: sectorName.trim(),
      description: sectorDescription.trim()
    };

    try {
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
      console.warn("Erro ao salvar setor na API, salvando localmente (mock):", err.message);
      
      // Fallback local
      const local = localStorage.getItem('mock_stocksectors');
      let list = local ? JSON.parse(local) : [];
      
      if (editingSectorId) {
        list = list.map((s: any) => 
          String(s.id) === String(editingSectorId) 
            ? { ...s, name: payload.name, description: payload.description } 
            : s
        );
      } else {
        list.push({
          id: Date.now().toString(),
          name: payload.name,
          description: payload.description
        });
      }
      
      localStorage.setItem('mock_stocksectors', JSON.stringify(list));
      setSuccessMessage(editingSectorId ? "Setor atualizado localmente!" : "Setor cadastrado localmente!");
      setSectorName('');
      setSectorDescription('');
      setEditingSectorId(null);
      fetchSectors();
    }
  };

  const handleEditSector = (sector: any) => {
    clearMessages();
    setEditingSectorId(String(sector.id));
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
      console.warn("Erro ao excluir setor na API, excluindo localmente (mock):", err.message);
      
      // Fallback local
      const local = localStorage.getItem('mock_stocksectors');
      if (local) {
        let list = JSON.parse(local);
        list = list.filter((s: any) => String(s.id) !== String(sectorId));
        localStorage.setItem('mock_stocksectors', JSON.stringify(list));
      }
      
      setSuccessMessage("Setor excluído localmente!");
      if (editingSectorId === sectorId) {
        setEditingSectorId(null);
        setSectorName('');
        setSectorDescription('');
      }
      fetchSectors();
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
