import React from 'react';
import { Plus, HelpCircle } from 'lucide-react';
import type { ProductFormData } from '../../../../../types/product.types';
import { useTabEstoque } from './TabEstoqueState';
import './TabEstoque.css';

interface TabEstoqueProps {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  setIsSectorModalOpen: (open: boolean) => void;
}

export function TabEstoque({
  formData,
  setFormData,
  setIsSectorModalOpen
}: TabEstoqueProps) {
  const { sectorsList } = useTabEstoque();

  return (
    <div className="prod-tab-section animate-fade-in">
      <div className="prod-form-grid">
        <div className="prod-form-group tab-estoque-span-2">
          <label className="tab-estoque-checkbox-label">
            <input
              type="checkbox"
              checked={formData.controlStock}
              onChange={e => setFormData({ ...formData, controlStock: e.target.checked })}
              className="tab-estoque-checkbox-field"
            />
            Controlar estoque
          </label>
        </div>

        <div className="prod-form-group tab-estoque-span-2">
          <label>Setor de Estoque</label>
          <div className="tab-estoque-select-row">
            <select
              value={formData.stockSectorId || ''}
              onChange={e => setFormData({ ...formData, stockSectorId: e.target.value || '' })}
              className="prod-select tab-estoque-select-field"
            >
              <option value="">Selecione um sector...</option>
              {sectorsList.map((s: any) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            
            <div className="prod-tooltip-container">
              <button
                type="button"
                onClick={() => setIsSectorModalOpen(true)}
                className="tab-estoque-add-btn"
              >
                <Plus size={16} />
              </button>
              <span className="prod-tooltip tab-estoque-add-tooltip">
                Gerenciar Setores de Estoque
              </span>
            </div>
          </div>
        </div>

        <div className="prod-form-group">
          <label>Estoque Mínimo</label>
          <input
            type="number"
            value={formData.minStock || 0}
            onChange={e => setFormData({ ...formData, minStock: parseFloat(e.target.value) || 0 })}
            className="prod-input"
            min="0"
          />
        </div>

        <div className="prod-form-group">
          <label>Estoque Máximo</label>
          <input
            type="number"
            value={formData.maxStock || 0}
            onChange={e => setFormData({ ...formData, maxStock: parseFloat(e.target.value) || 0 })}
            className="prod-input"
            min="0"
          />
        </div>

        <div className="prod-form-group">
          <div className="tab-estoque-fator-label-row">
            <label className="tab-estoque-fator-label">Fator de Conversão</label>
            <div className="prod-tooltip-container">
              <HelpCircle size={14} className="prod-help-icon tab-estoque-fator-help-icon" />
              <div className="prod-tooltip tab-estoque-fator-tooltip">
                Quantidade contida em uma unidade de estoque. Ex: Se você compra em fardo com 12 unidades, o fator é 12. Se compra avulso, o fator é 1.
              </div>
            </div>
          </div>
          <input
            type="number"
            value={formData.stockContent || 0}
            onChange={e => setFormData({ ...formData, stockContent: parseFloat(e.target.value) || 0 })}
            className="prod-input"
            min="0"
          />
        </div>

        {/* Checkboxes de opções de estoque empilhadas lado a lado em grid */}
        <div className="prod-form-group tab-estoque-options-container">
          <label className="tab-estoque-checkbox-label">
            <input
              type="checkbox"
              checked={formData.isDivisible}
              onChange={e => setFormData({ ...formData, isDivisible: e.target.checked })}
              className="tab-estoque-checkbox-field"
            />
            Permitir quantidade fracionada no estoque
          </label>

          <label className="tab-estoque-checkbox-label">
            <input
              type="checkbox"
              checked={formData.isPerishable}
              onChange={e => setFormData({ ...formData, isPerishable: e.target.checked })}
              className="tab-estoque-checkbox-field"
            />
            Produto perecível (Controlar validade)
          </label>

          <label className="tab-estoque-checkbox-label">
            <input
              type="checkbox"
              checked={formData.isAutoWeight}
              onChange={e => setFormData({ ...formData, isAutoWeight: e.target.checked })}
              className="tab-estoque-checkbox-field"
            />
            Pesagem automática na balança (Item Pesado)
          </label>
        </div>

        {/* Histórico/Movimentação - Placeholder */}
        <div className="tab-estoque-history-row">
          <div className="tab-estoque-history-text">
            <span className="tab-estoque-history-title">Movimentações do Estoque</span>
            <span className="tab-estoque-history-subtitle">Veja o histórico de entradas e saídas deste produto.</span>
          </div>
          <button
            type="button"
            className="prod-btn tab-estoque-history-btn"
            disabled
          >
            Estoque (Entrada)
          </button>
        </div>
      </div>
    </div>
  );
}
