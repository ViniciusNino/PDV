

interface UseListaFornecedoresProps {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export function useListaFornecedores({
  selectedId,
  setSelectedId,
}: UseListaFornecedoresProps) {

  const handleRowClick = (id: string) => {
    setSelectedId(id === selectedId ? null : id);
  };

  const handleRowDoubleClick = (id: string, onEditar: (id?: string) => void) => {
    setSelectedId(id);
    onEditar(id);
  };

  return {
    handleRowClick,
    handleRowDoubleClick,
  };
}
