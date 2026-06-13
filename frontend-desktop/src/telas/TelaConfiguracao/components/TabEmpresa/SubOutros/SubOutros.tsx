import { Search } from 'lucide-react';
import type { CompanyConfig } from '../../../TelaConfiguracaoState';
import './SubOutros.css';

interface SubOutrosProps {
  company: CompanyConfig;
  setCompany: React.Dispatch<React.SetStateAction<CompanyConfig>>;
  setIsSearchModalOpen: (open: boolean) => void;
}

export function SubOutros({ company, setCompany, setIsSearchModalOpen }: SubOutrosProps) {
  return (
    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
      <div className="field-group" style={{ width: '250px' }}>
        <label>Limite de compra:</label>
        <div className="money-input-wrapper">
          <input
            type="number"
            value={company.purchaseLimit}
            step="0.01"
            style={{ textAlign: 'right' }}
            onChange={e => setCompany({ ...company, purchaseLimit: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>
      <div className="field-group" style={{ flex: 1 }}>
        <label>Acionista:</label>
        <div className="search-input-wrapper">
          <input
            type="text"
            value={company.shareholder || ''}
            onChange={e => setCompany({ ...company, shareholder: e.target.value })}
          />
          <button
            type="button"
            className="search-icon-btn"
            onClick={() => setIsSearchModalOpen(true)}
          >
            <Search size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
