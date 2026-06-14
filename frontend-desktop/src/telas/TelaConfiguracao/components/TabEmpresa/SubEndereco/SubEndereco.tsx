import type { CompanyConfig } from '../../../TelaConfiguracaoState';
import { useSubEndereco } from './SubEnderecoState';
import './SubEndereco.css';

interface SubEnderecoProps {
  company: CompanyConfig;
  setCompany: React.Dispatch<React.SetStateAction<CompanyConfig>>;
}

export function SubEndereco({ company, setCompany }: SubEnderecoProps) {
  const { handleCepSearch } = useSubEndereco({ setCompany });
  const isApartamento = company.locationType === 'Apartamento';

  return (
    <div className="address-section">
      <div className="address-header">
        <span className="address-label">Endereço</span>
        <div className="address-line"></div>
      </div>
      <div className="address-grid-full">
        <div className="field-group">
          <label>CEP <span style={{ color: '#ff4a4a' }}>*</span>:</label>
          <input
            type="text"
            value={company.cep || ''}
            onChange={e => handleCepSearch(e.target.value)}
          />
        </div>
        <div className="field-group">
          <label>Estado <span style={{ color: '#ff4a4a' }}>*</span>:</label>
          <input
            type="text"
            value={company.state || ''}
            onChange={e => setCompany({ ...company, state: e.target.value })}
          />
        </div>
        <div className="field-group">
          <label>Cidade <span style={{ color: '#ff4a4a' }}>*</span>:</label>
          <input
            type="text"
            value={company.city || ''}
            onChange={e => setCompany({ ...company, city: e.target.value })}
          />
        </div>
        <div className="field-group">
          <label>Bairro <span style={{ color: '#ff4a4a' }}>*</span>:</label>
          <input
            type="text"
            value={company.neighborhood || ''}
            onChange={e => setCompany({ ...company, neighborhood: e.target.value })}
          />
        </div>

        <div className="field-group">
          <label>Tipo de localização:</label>
          <select
            value={company.locationType || 'Casa'}
            onChange={e => setCompany({ ...company, locationType: e.target.value })}
          >
            <option>Casa</option>
            <option>Loja</option>
            <option>Apartamento</option>
          </select>
        </div>
        <div className="field-group" style={{ gridColumn: 'span 2' }}>
          <label>Logradouro <span style={{ color: '#ff4a4a' }}>*</span>:</label>
          <input
            type="text"
            value={company.street || ''}
            onChange={e => setCompany({ ...company, street: e.target.value })}
          />
        </div>
        <div className="field-group">
          <label>Número <span style={{ color: '#ff4a4a' }}>*</span>:</label>
          <input
            type="text"
            value={company.number || ''}
            onChange={e => setCompany({ ...company, number: e.target.value })}
          />
        </div>

        {/* Campos condicionais de Apartamento */}
        {isApartamento && (
          <>
            <div className="field-group address-apt-field animate-fade-in" style={{ gridColumn: 'span 2' }}>
              <label>Edifício / Condomínio:</label>
              <input
                type="text"
                placeholder="Ex: Edifício Central Park"
                value={company.building || ''}
                onChange={e => setCompany({ ...company, building: e.target.value })}
              />
            </div>
            <div className="field-group address-apt-field animate-fade-in">
              <label>Nº Apartamento:</label>
              <input
                type="text"
                placeholder="Ex: 301"
                value={company.apartmentNumber || ''}
                onChange={e => setCompany({ ...company, apartmentNumber: e.target.value })}
              />
            </div>
            <div className="field-group address-apt-field animate-fade-in">
              <label>Bloco / Torre:</label>
              <input
                type="text"
                placeholder="Ex: Bloco B"
                value={company.block || ''}
                onChange={e => setCompany({ ...company, block: e.target.value })}
              />
            </div>
            <div className="field-group address-apt-field animate-fade-in">
              <label>Andar:</label>
              <input
                type="text"
                placeholder="Ex: 3º andar"
                value={company.floor || ''}
                onChange={e => setCompany({ ...company, floor: e.target.value })}
              />
            </div>
          </>
        )}

        <div className="field-group" style={{ gridColumn: 'span 2' }}>
          <label>Complemento:</label>
          <input
            type="text"
            value={company.complement || ''}
            onChange={e => setCompany({ ...company, complement: e.target.value })}
          />
        </div>
        <div className="field-group" style={{ gridColumn: 'span 2' }}>
          <label>Ponto de referência:</label>
          <input
            type="text"
            value={company.referencePoint || ''}
            onChange={e => setCompany({ ...company, referencePoint: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
