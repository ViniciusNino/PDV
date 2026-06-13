import type { CompanyConfig } from '../../../TelaConfiguracaoState';
import { formatPhone } from '../../../TelaConfiguracaoState';
import './SubContato.css';

interface SubContatoProps {
  company: CompanyConfig;
  setCompany: React.Dispatch<React.SetStateAction<CompanyConfig>>;
}

export function SubContato({ company, setCompany }: SubContatoProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div className="field-group" style={{ flex: 1 }}>
          <label>Login:</label>
          <input type="text" disabled placeholder="Admin" />
        </div>
        <div className="field-group" style={{ flex: 1 }}>
          <label>Senha:</label>
          <input type="password" disabled placeholder="******" />
        </div>
        <div className="field-group" style={{ flex: 2 }}>
          <label>E-mail:</label>
          <input
            type="email"
            value={company.email || ''}
            onChange={e => setCompany({ ...company, email: e.target.value })}
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div className="field-group" style={{ width: '200px' }}>
          <label>Celular:</label>
          <input
            type="tel"
            placeholder="(__) _____-____"
            value={company.cellphone || ''}
            onChange={e => setCompany({ ...company, cellphone: formatPhone(e.target.value) })}
          />
        </div>
        <div className="field-group" style={{ flex: 1 }}>
          <label>Slogan:</label>
          <input
            type="text"
            value={company.slogan || ''}
            onChange={e => setCompany({ ...company, slogan: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
