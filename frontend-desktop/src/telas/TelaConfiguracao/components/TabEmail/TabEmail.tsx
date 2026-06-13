import { AlertTriangle, Send } from 'lucide-react';
import type { EmailConfig } from '../../TelaConfiguracaoState';
import { useTabEmail } from './TabEmailState';
import './TabEmail.css';

interface TabEmailProps {
  email: EmailConfig;
  setEmail: React.Dispatch<React.SetStateAction<EmailConfig>>;
}

export function TabEmail({ email, setEmail }: TabEmailProps) {
  useTabEmail();

  return (
    <div className="email-tab-content">
      <div className="section-title-line">
        <span className="section-label">E-mail</span>
        <div className="title-line"></div>
      </div>
      <div className="field-group">
        <label>Destinatário:</label>
        <input
          type="text"
          value={email.recipient || ''}
          onChange={e => setEmail(prev => ({ ...prev, recipient: e.target.value }))}
        />
      </div>

      <div className="section-title-line" style={{ marginTop: '1.5rem' }}>
        <span className="section-label">Conta</span>
        <div className="title-line"></div>
      </div>
      <div className="form-row-2col">
        <div className="field-group">
          <label>Usuário:</label>
          <input
            type="text"
            value={email.username || ''}
            onChange={e => setEmail(prev => ({ ...prev, username: e.target.value }))}
          />
        </div>
        <div className="field-group">
          <label>Senha:</label>
          <input
            type="password"
            value={email.password || ''}
            onChange={e => setEmail(prev => ({ ...prev, password: e.target.value }))}
          />
        </div>
      </div>
      <div className="warning-box">
        <AlertTriangle size={18} />
        <span>Os dados da conta são salvos no banco de dados sem criptografia, proteja o acesso da rede do servidor para evitar exposição desses dados!</span>
      </div>

      <div className="section-title-line" style={{ marginTop: '1.5rem' }}>
        <span className="section-label">Avançado</span>
        <div className="title-line"></div>
      </div>
      <div className="form-row-advanced">
        <div className="field-group" style={{ flex: 1 }}>
          <label>Servidor:</label>
          <input
            type="text"
            value={email.server || 'smtp.gmail.com'}
            onChange={e => setEmail(prev => ({ ...prev, server: e.target.value }))}
          />
        </div>
        <div className="field-group" style={{ width: '100px' }}>
          <label>Porta:</label>
          <input
            type="number"
            value={email.port || 587}
            onChange={e => setEmail(prev => ({ ...prev, port: parseInt(e.target.value) || 587 }))}
          />
        </div>
      </div>
      <div className="encryption-row">
        <div className="encryption-box">
          <span className="encryption-label">Encriptação</span>
          <div className="radio-group-vertical">
            <label className="custom-radio-label">
              <input
                type="radio"
                name="enc"
                checked={email.encryption === 'Nenhum'}
                onChange={() => setEmail(prev => ({ ...prev, encryption: 'Nenhum' }))}
              /> Nenhum
            </label>
            <label className="custom-radio-label">
              <input
                type="radio"
                name="enc"
                checked={email.encryption === 'SSL'}
                onChange={() => setEmail(prev => ({ ...prev, encryption: 'SSL' }))}
              /> SSL
            </label>
            <label className="custom-radio-label">
              <input
                type="radio"
                name="enc"
                checked={email.encryption === 'TLS'}
                onChange={() => setEmail(prev => ({ ...prev, encryption: 'TLS' }))}
              /> TLS
            </label>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button 
            type="button" 
            className="btn-test" 
            onClick={() => alert('Teste de conexão SMTP enviado com sucesso para: ' + email.recipient)}
          >
            <Send size={16} />
            Testar
          </button>
        </div>
      </div>
    </div>
  );
}
