import type { CompanyConfig } from '../../../TelaConfiguracaoState';
import './SubSocial.css';

interface SubSocialProps {
  company: CompanyConfig;
  setCompany: React.Dispatch<React.SetStateAction<CompanyConfig>>;
}

export function SubSocial({ company, setCompany }: SubSocialProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
      <div className="field-group">
        <label>Facebook:</label>
        <input
          type="text"
          placeholder="https://facebook.com/..."
          value={company.facebook || ''}
          onChange={e => setCompany({ ...company, facebook: e.target.value })}
        />
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div className="field-group" style={{ flex: 1 }}>
          <label>Twitter:</label>
          <input
            type="text"
            placeholder="@seuusuario"
            value={company.twitter || ''}
            onChange={e => setCompany({ ...company, twitter: e.target.value })}
          />
        </div>
        <div className="field-group" style={{ flex: 1 }}>
          <label>LinkedIn:</label>
          <input
            type="text"
            placeholder="https://linkedin.com/in/..."
            value={company.linkedin || ''}
            onChange={e => setCompany({ ...company, linkedin: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
