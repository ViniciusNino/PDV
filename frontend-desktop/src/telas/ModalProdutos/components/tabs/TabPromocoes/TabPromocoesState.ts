import { useState } from 'react';
import type { Promotion } from '../../../../../types/product.types';

interface UsePromotionsProps {
  promotions: Promotion[];
  setPromotions: (promos: Promotion[]) => void;
  setError: (msg: string) => void;
}

export function usePromotions({ promotions, setPromotions, setError }: UsePromotionsProps) {
  const [promoDiaInicio, setPromoDiaInicio] = useState('Segunda-feira');
  const [promoHoraInicio, setPromoHoraInicio] = useState<number>(0);
  const [promoDiaFim, setPromoDiaFim] = useState('Segunda-feira');
  const [promoHoraFim, setPromoHoraFim] = useState<number>(0);
  const [promoPreco, setPromoPreco] = useState('');
  const [promoProibirVenda, setPromoProibirVenda] = useState(false);
  const [editingPromoId, setEditingPromoId] = useState<string | null>(null);
  const [editingPromoUiId, setEditingPromoUiId] = useState<string | null>(null);

  const handleAddPromotion = () => {
    if (!promoPreco.trim()) {
      setError("O preço promocional é obrigatório.");
      return;
    }
    const newPromo: Promotion = {
      id: editingPromoId || undefined,
      uiId: editingPromoUiId || Math.random().toString(36).substr(2, 9),
      dayStart: promoDiaInicio,
      hourStart: promoHoraInicio,
      dayEnd: promoDiaFim,
      hourEnd: promoHoraFim,
      price: promoPreco,
      isSaleForbidden: promoProibirVenda
    };

    let updatedPromos = [...promotions];
    if (editingPromoUiId || editingPromoId) {
      updatedPromos = updatedPromos.map(p => {
        const isMatch = editingPromoId ? p.id === editingPromoId : p.uiId === editingPromoUiId;
        return isMatch ? newPromo : p;
      });
    } else {
      updatedPromos.push(newPromo);
    }
    setPromotions(updatedPromos);

    setPromoDiaInicio('Segunda-feira');
    setPromoHoraInicio(0);
    setPromoDiaFim('Segunda-feira');
    setPromoHoraFim(0);
    setPromoPreco('');
    setPromoProibirVenda(false);
    setEditingPromoId(null);
    setEditingPromoUiId(null);
  };

  const handleEditPromotion = (promo: Promotion) => {
    setEditingPromoId(promo.id || null);
    setEditingPromoUiId(promo.uiId || null);
    setPromoDiaInicio(promo.dayStart);
    setPromoHoraInicio(promo.hourStart);
    setPromoDiaFim(promo.dayEnd);
    setPromoHoraFim(promo.hourEnd);
    setPromoPreco(promo.price);
    setPromoProibirVenda(promo.isSaleForbidden);
  };

  const handleDeletePromotion = (promo: Promotion) => {
    if (!window.confirm("Tem certeza que deseja excluir esta promoção?")) return;
    const filtered = promotions.filter(p => {
      if (promo.id) return p.id !== promo.id;
      return p.uiId !== promo.uiId;
    });
    setPromotions(filtered);

    if (editingPromoId === promo.id || editingPromoUiId === promo.uiId) {
      handleCancelEditPromotion();
    }
  };

  const handleCancelEditPromotion = () => {
    setPromoDiaInicio('Segunda-feira');
    setPromoHoraInicio(0);
    setPromoDiaFim('Segunda-feira');
    setPromoHoraFim(0);
    setPromoPreco('');
    setPromoProibirVenda(false);
    setEditingPromoId(null);
    setEditingPromoUiId(null);
  };

  return {
    state: {
      promoDiaInicio, setPromoDiaInicio,
      promoHoraInicio, setPromoHoraInicio,
      promoDiaFim, setPromoDiaFim,
      promoHoraFim, setPromoHoraFim,
      promoPreco, setPromoPreco,
      promoProibirVenda, setPromoProibirVenda,
      editingPromoId, editingPromoUiId
    },
    actions: {
      handleAddPromotion,
      handleEditPromotion,
      handleDeletePromotion,
      handleCancelEditPromotion
    }
  };
}
