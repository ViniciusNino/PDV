import './SubSocialCliente.css';

interface SubSocialClienteProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export function SubSocialCliente({ formData, setFormData }: SubSocialClienteProps) {
  return (
    <div className="subtab-social">
      <div className="social-container">
        {/* Facebook (Longo) */}
        <div className="field-item">
          <label className="field-label">Facebook:</label>
          <input
            type="text"
            className="nino-input"
            placeholder="Link ou usuário do Facebook"
            value={formData.facebook || ''}
            onChange={e => setFormData((prev: any) => ({ ...prev, facebook: e.target.value }))}
          />
        </div>

        {/* Twitter e LinkedIn lado a lado */}
        <div className="social-row">
          <div className="field-item flex-1">
            <label className="field-label">Twitter:</label>
            <input
              type="text"
              className="nino-input"
              placeholder="Link ou usuário do Twitter"
              value={formData.twitter || ''}
              onChange={e => setFormData((prev: any) => ({ ...prev, twitter: e.target.value }))}
            />
          </div>
          <div className="field-item flex-1">
            <label className="field-label">LinkedIn:</label>
            <input
              type="text"
              className="nino-input"
              placeholder="Link ou usuário do LinkedIn"
              value={formData.linkedin || ''}
              onChange={e => setFormData((prev: any) => ({ ...prev, linkedin: e.target.value }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
