import { Search } from 'lucide-react';
import { useSubOutrosCliente } from './SubOutrosClienteState';
import './SubOutrosCliente.css';

interface SubOutrosClienteProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  entityType?: 'cliente' | 'fornecedor';
  setIsSearchModalOpen?: (open: boolean) => void;
}

export function SubOutrosCliente({
  formData,
  setFormData,
  entityType = 'cliente',
  setIsSearchModalOpen
}: SubOutrosClienteProps) {
  const { formatCurrency, parseCurrency } = useSubOutrosCliente();

  const handleLimitChange = (val: string) => {
    const numericValue = parseCurrency(val);
    setFormData((prev: any) => ({ ...prev, purchaseLimit: numericValue }));
  };

  return (
    <div className="subtab-outros">
      <div className="outros-container" style={{ display: 'flex', gap: '1rem', width: '100%' }}>
        <div className="field-item w-200">
          <label className="field-label">Limite de compra:</label>
          <input
            type="text"
            className="nino-input"
            style={{ textAlign: 'right' }}
            value={formatCurrency(formData.purchaseLimit || 0)}
            onChange={e => handleLimitChange(e.target.value)}
          />
        </div>

        {entityType === 'fornecedor' && (
          <div className="field-item flex-1">
            <label className="field-label">Acionista:</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="text"
                className="nino-input"
                style={{ flex: 1 }}
                placeholder="Nome do acionista ou proprietário"
                value={formData.shareholder || ''}
                onChange={e => setFormData((prev: any) => ({ ...prev, shareholder: e.target.value }))}
              />
              <button
                type="button"
                className="nino-input-btn"
                style={{
                  background: 'var(--bg-surface-hover)',
                  border: '1px solid var(--border-strong)',
                  color: 'var(--text-primary)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  height: '36px',
                  transition: 'all var(--transition-fast)'
                }}
                onClick={() => setIsSearchModalOpen?.(true)}
                title="Buscar acionista nos clientes"
              >
                <Search size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
