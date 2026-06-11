import React from 'react';
import { Plus, X } from 'lucide-react';
import { formatQuantityDecimal } from '../../../../../utils/formatters';
import type { ProductFormData } from '../../../../../types/product.types';
import { useTabComposicao } from './TabComposicaoState';
import { EmptyTableRow } from '../../shared/EmptyTableRow';
import './TabComposicao.css';

interface TabComposicaoProps {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  productsList: any[];
  setError: (msg: string) => void;
}

export function TabComposicao({
  formData,
  setFormData,
  productsList,
  setError
}: TabComposicaoProps) {
  const { state, actions } = useTabComposicao({
    formData,
    setFormData,
    productsList,
    setError
  });

  const {
    selectedIngredientId,
    ingredientQty,
    ingredientType,
    ingredientPrice,
    ingredientActive
  } = state;

  const {
    handleAddIngredient,
    handleRemoveIngredient,
    handleIngredientQuantityChange,
    handleIngredientTypeChange,
    handleIngredientPriceChange,
    handleIngredientActiveChange
  } = actions;

  return (
    <div className="prod-tab-section animate-fade-in">
      <div className="prod-form-group tab-composicao-header-group">
        <h3 className="prod-section-title tab-composicao-title">Composição e Ingredientes</h3>
        <p className="tab-composicao-subtitle">
          Configure a ficha técnica do produto (ingredientes essenciais), opcionais removíveis na venda ou adicionais pagos.
        </p>
      </div>

      {/* Formulário de Adição Rápida */}
      <div className="tab-composicao-form">
        {/* Linha 1: Select de Ingrediente e Input de Quantidade */}
        <div className="tab-composicao-row-1">
          <div className="tab-composicao-col-main">
            <span className="tab-composicao-label-text">Selecione o item do produto</span>
            <select
              value={selectedIngredientId}
              onChange={e => {
                const id = e.target.value;
                state.setSelectedIngredientId(id);
                const matched = productsList.find((p: any) => p.id === id);
                const unit = matched?.unit || 'UN';
                if (unit === 'KG' || unit === 'LT') {
                  state.setIngredientQty('0,000');
                } else {
                  state.setIngredientQty('1');
                }
              }}
              className="prod-select tab-composicao-select-full"
            >
              <option value="">- Selecione o item do produto</option>
              {[...productsList]
                .sort((a: any, b: any) => a.name.localeCompare(b.name))
                .map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)
              }
            </select>
          </div>

          <div className="tab-composicao-col-qty">
            <span className="tab-composicao-qty-label">Quantidade</span>
            <div className="tab-composicao-qty-input-row">
              <input
                type="text"
                value={ingredientQty}
                onChange={e => {
                  const unit = productsList.find((p: any) => p.id === selectedIngredientId)?.unit || 'UN';
                  if (unit === 'KG' || unit === 'LT') {
                    state.setIngredientQty(formatQuantityDecimal(e.target.value));
                  } else {
                    state.setIngredientQty(e.target.value.replace(/\D/g, ''));
                  }
                }}
                className="prod-input tab-composicao-qty-input"
              />
              <span className="tab-composicao-unit-text">
                {productsList.find((p: any) => p.id === selectedIngredientId)?.unit || 'UN'}
              </span>
            </div>
          </div>
        </div>

        {/* Linha 2: Tipo de composição, Valor, Ativo e Botão de Adicionar */}
        <div className="tab-composicao-row-2">
          <div className="tab-composicao-col-type">
            <span className="tab-composicao-label-text">Tipo de composição</span>
            <select
              value={ingredientType}
              onChange={e => {
                const type = parseInt(e.target.value);
                state.setIngredientType(type);
                if (type !== 2) {
                  state.setIngredientPrice('');
                }
              }}
              className="prod-select tab-composicao-select-full"
            >
              <option value={0}>Composição</option>
              <option value={1}>Opcional</option>
              <option value={2}>Adicional</option>
            </select>
          </div>

          {ingredientType === 2 && (
            <div className="tab-composicao-col-price">
              <span className="tab-composicao-label-text">Valor:</span>
              <input
                type="text"
                value={ingredientPrice}
                onChange={e => state.setIngredientPrice(e.target.value)}
                placeholder="0,00"
                className="prod-input tab-composicao-price-input"
              />
            </div>
          )}

          {ingredientType > 0 && (
            <div className="tab-composicao-col-active">
              <label className="tab-composicao-active-label">
                <input
                  type="checkbox"
                  checked={ingredientActive}
                  onChange={e => state.setIngredientActive(e.target.checked)}
                  className="tab-composicao-active-checkbox"
                />
                Ativo
              </label>
            </div>
          )}

          <div className="tab-composicao-col-btn">
            <button
              type="button"
              className="prod-btn prod-btn-secondary tab-composicao-add-btn"
              onClick={handleAddIngredient}
            >
              <Plus size={16} /> Adicionar
            </button>
          </div>
        </div>
      </div>

      {/* Listagem */}
      <div className="tab-composicao-table-wrapper">
        <table className="tab-composicao-table">
          <thead className="tab-composicao-thead">
            <tr>
              <th className="tab-composicao-th">Ingrediente</th>
              <th className="tab-composicao-th tab-composicao-th-qty">Quantidade</th>
              <th className="tab-composicao-th">Tipo</th>
              <th className="tab-composicao-th">Preço Adicional</th>
              <th className="tab-composicao-th tab-composicao-th-status">Ativo</th>
              <th className="tab-composicao-th tab-composicao-th-actions">Ações</th>
            </tr>
          </thead>
          <tbody>
            {formData.ingredients.length === 0 && (
              <EmptyTableRow colSpan={6} message="Nenhum ingrediente ou opcional adicionado." className="tab-composicao-empty-row" />
            )}
            {[...formData.ingredients]
              .sort((a: any, b: any) => a.name.localeCompare(b.name))
              .map((ing) => {
                const originalIdx = formData.ingredients.findIndex((item: any) => item.ingredientProductId === ing.ingredientProductId);
                const matchedProd = productsList.find((p: any) => p.id === ing.ingredientProductId);
                const unit = matchedProd ? matchedProd.unit : 'UN';

                return (
                  <tr key={ing.ingredientProductId} className="tab-composicao-tr">
                    <td className="tab-composicao-td-name">{ing.name}</td>
                    <td className="tab-composicao-td-qty">
                      <div className="tab-composicao-td-qty-row">
                        <input
                          type="text"
                          value={ing.quantity}
                          onChange={(e) => handleIngredientQuantityChange(originalIdx, e.target.value, unit)}
                          className="prod-input tab-composicao-row-qty-input"
                        />
                        <span className="tab-composicao-row-unit-text">{unit}</span>
                      </div>
                    </td>
                    <td className="tab-composicao-td-type">
                      <select
                        value={ing.type}
                        onChange={(e) => handleIngredientTypeChange(originalIdx, parseInt(e.target.value))}
                        className="prod-select tab-composicao-row-select"
                      >
                        <option value={0}>Composição</option>
                        <option value={1}>Opcional</option>
                        <option value={2}>Adicional</option>
                      </select>
                    </td>
                    <td className="tab-composicao-td-qty">
                      {ing.type === 2 ? (
                        <input
                          type="text"
                          value={ing.additionalPrice}
                          onChange={e => handleIngredientPriceChange(originalIdx, e.target.value)}
                          className="prod-input tab-composicao-row-price-input"
                          placeholder="R$ 0,00"
                        />
                      ) : (
                        <span className="tab-composicao-row-no-price">-</span>
                      )}
                    </td>
                    <td className="tab-composicao-td-status">
                      {ing.type > 0 ? (
                        <input
                          type="checkbox"
                          checked={ing.isActive !== false}
                          onChange={e => handleIngredientActiveChange(originalIdx, e.target.checked)}
                          className="tab-composicao-row-status-checkbox"
                        />
                      ) : (
                        <span className="tab-composicao-row-status-always">Sempre Ativo</span>
                      )}
                    </td>
                    <td className="tab-composicao-td-actions">
                      <button
                        className="prod-btn-close tab-composicao-row-delete-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveIngredient(ing.ingredientProductId);
                        }}
                      >
                        <X size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
