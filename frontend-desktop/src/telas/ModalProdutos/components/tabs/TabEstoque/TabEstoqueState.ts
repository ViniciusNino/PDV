import { useState, useEffect } from 'react';
import { apiClient } from '../../../../../services/apiClient';

export function useTabEstoque() {
  const [sectorsList, setSectorsList] = useState<any[]>([]);

  useEffect(() => {
    apiClient.get('/stocksectors')
      .then((data: any) => setSectorsList(data))
      .catch(console.error);
  }, []);

  return {
    sectorsList
  };
}
