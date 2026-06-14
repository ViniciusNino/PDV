import { useSubOutrosCliente } from './SubOutrosClienteState';
import './SubOutrosCliente.css';

interface SubOutrosClienteProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export function SubOutrosCliente({ formData, setFormData }: SubOutrosClienteProps) {
  const { formatCurrency, parseCurrency } = useSubOutrosCliente();

  const handleLimitChange = (val: string) => {
    const numericValue = parseCurrency(val);
    setFormData((prev: any) => ({ ...prev, purchaseLimit: numericValue }));
  };

  return (
    <div className="subtab-outros">
      <div className="outros-container">
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
      </div>
    </div>
  );
}
