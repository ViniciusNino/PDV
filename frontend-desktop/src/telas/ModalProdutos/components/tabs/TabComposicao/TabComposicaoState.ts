import { useState } from 'react';
import { formatCurrency, formatQuantityDecimal } from '../../../../../utils/formatters';
import type { ProductFormData } from '../../../../../types/product.types';

interface UseTabComposicaoProps {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  productsList: any[];
  setError: (msg: string) => void;
}

export function useTabComposicao({
  formData,
  setFormData,
  productsList,
  setError
}: UseTabComposicaoProps) {
  // Estados auxiliares locais para formulário de adição rápida
  const [selectedIngredientId, setSelectedIngredientId] = useState('');
  const [ingredientQty, setIngredientQty] = useState('1');
  const [ingredientType, setIngredientType] = useState<number>(0);
  const [ingredientPrice, setIngredientPrice] = useState('');
  const [ingredientActive, setIngredientActive] = useState(true);

  const handleAddIngredient = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (selectedIngredientId) {
      const matched = productsList.find((p: any) => p.id === selectedIngredientId);
      if (matched) {
        const exists = formData.ingredients.some((i: any) => i.ingredientProductId === selectedIngredientId);
        if (exists) {
          setError("Este ingrediente já foi adicionado.");
          return;
        }

        setFormData({
          ...formData,
          ingredients: [...formData.ingredients, {
            ingredientProductId: selectedIngredientId,
            quantity: ingredientQty,
            type: ingredientType,
            additionalPrice: ingredientType === 2 ? ingredientPrice : '',
            isActive: ingredientType > 0 ? ingredientActive : true,
            name: matched.name
          }]
        });
        setSelectedIngredientId('');
        setIngredientQty('1');
        setIngredientType(0);
        setIngredientPrice('');
        setIngredientActive(true);
      }
    } else {
      setError("Por favor, selecione um ingrediente.");
    }
  };

  const handleRemoveIngredient = (ingredientProductId: string) => {
    const newIngs = formData.ingredients.filter((item: any) => item.ingredientProductId !== ingredientProductId);
    setFormData({ ...formData, ingredients: newIngs });
  };

  const handleIngredientQuantityChange = (originalIdx: number, val: string, unit: string) => {
    let formattedVal = val;
    if (unit === 'KG' || unit === 'LT') {
      formattedVal = formatQuantityDecimal(val);
    } else {
      formattedVal = val.replace(/\D/g, '');
    }
    const newIngs = [...formData.ingredients];
    newIngs[originalIdx].quantity = formattedVal;
    setFormData({ ...formData, ingredients: newIngs });
  };

  const handleIngredientTypeChange = (originalIdx: number, newType: number) => {
    const newIngs = [...formData.ingredients];
    newIngs[originalIdx].type = newType;
    if (newType !== 2) {
      newIngs[originalIdx].additionalPrice = '';
    }
    setFormData({ ...formData, ingredients: newIngs });
  };

  const handleIngredientPriceChange = (originalIdx: number, val: string) => {
    const newIngs = [...formData.ingredients];
    newIngs[originalIdx].additionalPrice = formatCurrency(val);
    setFormData({ ...formData, ingredients: newIngs });
  };

  const handleIngredientActiveChange = (originalIdx: number, checked: boolean) => {
    const newIngs = [...formData.ingredients];
    newIngs[originalIdx].isActive = checked;
    setFormData({ ...formData, ingredients: newIngs });
  };

  return {
    state: {
      selectedIngredientId, setSelectedIngredientId,
      ingredientQty, setIngredientQty,
      ingredientType, setIngredientType,
      ingredientPrice, setIngredientPrice,
      ingredientActive, setIngredientActive
    },
    actions: {
      handleAddIngredient,
      handleRemoveIngredient,
      handleIngredientQuantityChange,
      handleIngredientTypeChange,
      handleIngredientPriceChange,
      handleIngredientActiveChange
    }
  };
}
