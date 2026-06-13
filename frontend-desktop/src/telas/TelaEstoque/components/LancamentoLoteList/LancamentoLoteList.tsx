import { Trash2 } from 'lucide-react';
import type { StockItem } from '../../TelaEstoqueState';
import { useLancamentoLoteList } from './LancamentoLoteListState';
import './LancamentoLoteList.css';

interface LancamentoLoteListProps {
  stockItems: StockItem[];
  handleRemoveItem: (index: number) => void;
  handleClearTable: () => void;
}

export function LancamentoLoteList({
  stockItems,
  handleRemoveItem,
  handleClearTable
}: LancamentoLoteListProps) {
  const { getGrandTotal, getTotalQuantity } = useLancamentoLoteList({ stockItems });

  return (
    <div className="estoque-table-section">
      <div className="table-header-row">
        <h3>Lançamentos do Lote Atual</h3>
        {stockItems.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Total Itens: <strong>{getTotalQuantity()}</strong> | Valor Total: <strong>
                R$ {getGrandTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </strong>
            </span>
            <button type="button" onClick={handleClearTable} className="btn-clear-table">
              <Trash2 size={13} /> Limpar Lote
            </button>
          </div>
        )}
      </div>
      <div className="estoque-table-container">
        <table className="estoque-main-table">
          <thead>
            <tr>
              <th>Código</th>
              <th className="desc-col">Descrição</th>
              <th className="num-col">Unidades</th>
              <th className="num-col">Quantidade</th>
              <th className="num-col">Preço</th>
              <th className="num-col">Total</th>
              <th>Setor</th>
              <th>Fornecedor</th>
              <th>Detalhes</th>
              <th className="actions-col"></th>
            </tr>
          </thead>
          <tbody>
            {stockItems.length === 0 ? (
              <tr className="empty-table-row">
                <td colSpan={10}>Nenhum item lançado neste lote de estoque.</td>
              </tr>
            ) : (
              stockItems.map((item, index) => (
                <tr key={index}>
                  <td className="code-cell">
                    <span className="box-icon">📦</span>
                    {item.code}
                  </td>
                  <td className="desc-col font-medium">{item.description}</td>
                  <td className="num-col">{item.units}</td>
                  <td className="num-col">{item.quantity}</td>
                  <td className="num-col">
                    {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="num-col font-medium">
                    {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td>{item.sector}</td>
                  <td>{item.supplier}</td>
                  <td className="text-muted">{item.details}</td>
                  <td className="actions-col">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="item-delete-btn"
                      title="Remover Item"
                    >
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
