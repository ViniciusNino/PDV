import { ArrowLeft } from 'lucide-react';
import { useVerificacaoForm } from './VerificacaoFormState';
import './VerificacaoForm.css';

interface VerificacaoFormProps {
  email: string;
  codeDigits: string[];
  setCodeDigits: (digits: string[]) => void;
  timer: number;
  formatTimer: () => string;
  isLoading: boolean;
  handleVerifyCode: (fullCode: string) => void;
  handleResendCode: () => void;
  onBackClick: () => void;
}

export function VerificacaoForm({
  email,
  codeDigits,
  setCodeDigits,
  timer,
  formatTimer,
  isLoading,
  handleVerifyCode,
  handleResendCode,
  onBackClick
}: VerificacaoFormProps) {
  
  const {
    inputRefs,
    handleDigitChange,
    handleKeyDown,
    handlePaste
  } = useVerificacaoForm({ codeDigits, setCodeDigits });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = codeDigits.join('');
    handleVerifyCode(fullCode);
  };

  return (
    <div className="verify-container animate-fade-in">
      <button className="btn-back" onClick={onBackClick} disabled={isLoading}>
        <ArrowLeft size={16} />
        <span>Voltar</span>
      </button>

      <h1 className="register-title">Verificação de E-mail</h1>
      <p className="verify-subtitle">
        Enviamos um código de verificação de 6 dígitos para o e-mail:<br />
        <span className="highlight-email">{email}</span>
      </p>

      <form onSubmit={handleSubmit} className="verify-form">
        <div className="code-digits-grid">
          {codeDigits.map((digit, idx) => (
            <input
              key={idx}
              ref={el => { inputRefs.current[idx] = el; }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={e => handleDigitChange(idx, e.target.value)}
              onKeyDown={e => handleKeyDown(idx, e)}
              onPaste={idx === 0 ? handlePaste : undefined}
              className="code-digit-input"
              required
              autoFocus={idx === 0}
              disabled={isLoading}
            />
          ))}
        </div>

        <button type="submit" className="btn-primary btn-verify" disabled={isLoading || codeDigits.some(d => !d)}>
          {isLoading ? 'Confirmando...' : 'Confirmar Código'}
        </button>
      </form>

      <div className="resend-section">
        {timer > 0 ? (
          <p className="timer-text">Reenviar código em <strong>{formatTimer()}</strong></p>
        ) : (
          <p className="resend-prompt">
            Não recebeu o código?{' '}
            <a href="#" className="resend-link" onClick={(e) => { e.preventDefault(); handleResendCode(); }}>
              Clique para reenviar
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
