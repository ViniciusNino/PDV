import React from 'react';
import { LayoutList, MonitorPlay, LayoutGrid, Truck, ShoppingBag } from 'lucide-react';
import type { ProductFormData } from '../../../../../types/product.types';
import { useTabPrecos } from './TabPrecosState';
import './TabPrecos.css';

interface TabPrecosProps {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export function TabPrecos({ formData, setFormData }: TabPrecosProps) {
  const { handlePriceChange, handleVisibilityChange } = useTabPrecos({ formData, setFormData });

  return (
    <div className="prod-tab-section animate-fade-in">
      <div className="prod-form-group tab-precos-header-group">
        <h3 className="prod-section-title tab-precos-title">Tabela de Preços por Canal</h3>
        <p className="tab-precos-subtitle">
          Deixe em branco para usar o <strong>Preço Base (R$ {formData.basePrice || '0,00'})</strong>.
        </p>
      </div>

      <div className="tab-precos-table-wrapper">
        <table className="tab-precos-table">
          <thead className="tab-precos-thead">
            <tr>
              <th className="tab-precos-th tab-precos-th-canal">Canal de Venda</th>
              <th className="tab-precos-th tab-precos-th-preco">Preço Diferenciado (R$)</th>
              <th className="tab-precos-th tab-precos-th-status">Habilitado / Visível</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: 0, name: 'Comandas', icon: LayoutList },
              { id: 1, name: 'Balcão', icon: MonitorPlay },
              { id: 2, name: 'Mesas', icon: LayoutGrid },
              { id: 3, name: 'Delivery', icon: Truck },
              { id: 4, name: 'iFood', icon: ShoppingBag }
            ].map(canal => {
              const priceObj = formData.prices.find((p: any) => p.channel === canal.id) || { channel: canal.id, price: '', isVisible: true };
              return (
                <tr key={canal.id} className="tab-precos-tr">
                  <td className="tab-precos-td-canal">
                    <canal.icon size={16} className="text-primary" />
                    {canal.name}
                  </td>
                  <td className="tab-precos-td-input">
                    <input
                      type="text"
                      value={priceObj.price}
                      onChange={(e) => handlePriceChange(canal.id, e.target.value)}
                      placeholder="Ex: 25,00"
                      className="prod-input tab-precos-input-field"
                    />
                  </td>
                  <td className="tab-precos-td-checkbox">
                    <input
                      type="checkbox"
                      checked={priceObj.isVisible !== false}
                      onChange={(e) => handleVisibilityChange(canal.id, e.target.checked)}
                      className="tab-precos-checkbox"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
