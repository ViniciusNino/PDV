import type { CompanyConfig } from '../../../TelaConfiguracaoState';
import './SubDocumentos.css';

interface SubDocumentosProps {
  company: CompanyConfig;
  setCompany: React.Dispatch<React.SetStateAction<CompanyConfig>>;
}

export function SubDocumentos({ company, setCompany }: SubDocumentosProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div className="field-group" style={{ flex: 1 }}>
          <label>CNPJ:</label>
          <input
            type="text"
            placeholder="__.___.___/____-__"
            value={company.cnpj || ''}
            onChange={e => setCompany({ ...company, cnpj: e.target.value })}
          />
        </div>
        <div className="field-group" style={{ flex: 1 }}>
          <label>IE:</label>
          <input
            type="text"
            value={company.stateRegistration || ''}
            onChange={e => setCompany({ ...company, stateRegistration: e.target.value })}
          />
        </div>
        <div className="field-group" style={{ flex: 1 }}>
          <label>IM:</label>
          <input
            type="text"
            value={company.municipalRegistration || ''}
            onChange={e => setCompany({ ...company, municipalRegistration: e.target.value })}
          />
        </div>
      </div>
      <div className="field-group" style={{ width: '300px' }}>
        <label>Data de fundação:</label>
        <input
          type="date"
          className="date-input"
          value={company.foundationDate || ''}
          onChange={e => setCompany({ ...company, foundationDate: e.target.value })}
        />
      </div>
    </div>
  );
}
