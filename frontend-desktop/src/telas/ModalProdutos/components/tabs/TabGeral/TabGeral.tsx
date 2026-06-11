import React from 'react';
import { UploadCloud, Pencil } from 'lucide-react';
import { formatCurrency } from '../../../../../utils/formatters';
import type { ProductFormData } from '../../../../../types/product.types';
import { useTabGeral } from './TabGeralState';
import { HelpTooltip } from '../../shared/HelpTooltip';
import './TabGeral.css';

interface TabGeralProps {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  categories: any[];
  setError: (msg: string) => void;
  setActiveTab: (tab: string) => void;
}

export function TabGeral({
  formData,
  setFormData,
  categories,
  setError,
  setActiveTab
}: TabGeralProps) {
  const { handleImageUpload } = useTabGeral({ setFormData, setError });

  return (
    <div className="prod-tab-section tab-geral-container animate-fade-in">
      
      {/* Coluna Esquerda - Imagem e Status (Checkboxes) */}
      <div className="tab-geral-left-column">
        
        {/* Imagem do Produto */}
        <div className="prod-form-group tab-geral-img-group">
          <div className="tab-geral-img-label-row">
            <label className="tab-geral-img-label">Imagem do Produto</label>
            <HelpTooltip
              text="Dimensão recomendada: proporção 1:1 (quadrada), ex: 400x400px. Limite máximo: 2MB e resolução de até 2500x2500px."
              tooltipClassName="tab-geral-img-tooltip"
            />
          </div>
          <div className="cat-image-upload-area tab-geral-upload-area" onClick={() => document.getElementById('prod-img')?.click()}>
            <input type="file" id="prod-img" accept="image/*" onChange={handleImageUpload} className="tab-geral-hidden-file" />
            {formData.imageBase64 ? (
              <div className="cat-image-preview">
                <img src={formData.imageBase64} alt="Preview" />
                <div className="cat-image-overlay"><Pencil size={20} /></div>
              </div>
            ) : (
              <div className="cat-image-placeholder">
                <UploadCloud size={28} />
                <span>Enviar foto (F4)</span>
              </div>
            )}
          </div>
        </div>

        {/* Checkboxes empilhadas verticalmente abaixo da imagem */}
        <div className="prod-form-group tab-geral-checkbox-container">
          <label className="tab-geral-checkbox-label">
            <input
              type="checkbox"
              checked={formData.isFractionable}
              onChange={e => setFormData({ ...formData, isFractionable: e.target.checked })}
              className="tab-geral-checkbox-field"
            />
            Venda Fracionada
          </label>
          <label className="tab-geral-checkbox-label">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
              className="tab-geral-checkbox-field"
            />
            Produto Ativo
          </label>
          <label className="tab-geral-checkbox-label">
            <input
              type="checkbox"
              checked={formData.isVisible}
              onChange={e => setFormData({ ...formData, isVisible: e.target.checked })}
              className="tab-geral-checkbox-field"
            />
            Produto Visível
          </label>
        </div>

      </div>

      {/* Coluna Direita - Formulário de Dados */}
      <div className="tab-geral-right-column">
        
        {/* Nome do Produto */}
        <div className="prod-form-group">
          <label>Nome do Produto *</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Hambúrguer Clássico"
            className="prod-input"
          />
        </div>

        {/* Tipo de Produto e Categoria lado a lado */}
        <div className="prod-form-group">
          <div className="tab-geral-form-row">
            <div className="tab-geral-flex-1">
              <label>Tipo do Produto *</label>
              <select
                value={formData.type}
                onChange={e => {
                  const newType = parseInt(e.target.value, 10) || 0;
                  setFormData((prev: any) => ({ ...prev, type: newType }));
                  setActiveTab('geral');
                }}
                className="prod-select tab-geral-select-field"
              >
                <option value={0}>Estoque</option>
                <option value={1}>Composição</option>
                <option value={2}>Pacote</option>
              </select>
            </div>
            <div className="tab-geral-flex-1-2">
              <label>Categoria *</label>
              <select
                value={formData.categoryId}
                onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                className="prod-select tab-geral-select-field"
              >
                <option value="">Selecione...</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.parentCategoryId ? `  ↳ ${c.name}` : c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Preço Base, Código e Abreviação lado a lado */}
        <div className="prod-form-group">
          <div className="tab-geral-form-row">
            <div className="tab-geral-flex-1">
              <label>Preço Base (R$)</label>
              <input
                type="text"
                value={formData.basePrice}
                onChange={e => setFormData({ ...formData, basePrice: formatCurrency(e.target.value) })}
                placeholder="0,00"
                className="prod-input tab-geral-input-field"
              />
            </div>
            <div className="tab-geral-flex-1">
              <label>Código do Produto</label>
              <input
                type="text"
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                placeholder="Ex: 001"
                className="prod-input tab-geral-input-field"
              />
            </div>
            <div className="tab-geral-flex-1">
              <label>Abreviação</label>
              <input
                type="text"
                value={formData.abbreviation}
                onChange={e => setFormData({ ...formData, abbreviation: e.target.value })}
                placeholder="Ex: Hambúrguer"
                className="prod-input tab-geral-input-field"
              />
            </div>
          </div>
        </div>

        {/* Unidade, Impressão e Tempo de Preparo lado a lado */}
        <div className="prod-form-group">
          <div className="tab-geral-form-row">
            <div className="tab-geral-flex-1">
              <label>Unidade</label>
              <select
                value={formData.unit}
                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                className="prod-select tab-geral-select-field"
              >
                <option value="UN">UN</option>
                <option value="KG">KG</option>
                <option value="LT">LT</option>
                <option value="ML">ML</option>
                <option value="G">G</option>
              </select>
            </div>
            <div className="tab-geral-flex-1-5">
              <label>Impressão</label>
              <select
                value={formData.printTarget}
                onChange={e => setFormData({ ...formData, printTarget: e.target.value })}
                className="prod-select tab-geral-select-field"
              >
                <option value="">Sem Impressão</option>
                <option value="Cozinha">Cozinha</option>
                <option value="Bar">Bar</option>
                <option value="Balcão">Balcão</option>
                <option value="Copa">Copa</option>
              </select>
            </div>
            <div className="tab-geral-flex-1">
              <label>Preparo (min)</label>
              <input
                type="number"
                value={formData.preparationTime || ''}
                onChange={e => setFormData({ ...formData, preparationTime: parseInt(e.target.value) || 0 })}
                placeholder="Ex: 15"
                className="prod-input tab-geral-input-field"
                min="0"
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
