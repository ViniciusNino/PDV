import { useState, useMemo } from 'react';

export function useProductList(productsList: any[]) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return productsList;
    
    const lowerTerm = searchTerm.toLowerCase();
    return productsList.filter(p =>
      p.name.toLowerCase().includes(lowerTerm) ||
      (p.categoryName && p.categoryName.toLowerCase().includes(lowerTerm))
    );
  }, [productsList, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredProducts
  };
}
