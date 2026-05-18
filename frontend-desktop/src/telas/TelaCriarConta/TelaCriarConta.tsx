import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Eye, EyeOff, X, ArrowLeft, CheckCircle2 } from 'lucide-react';
import './TelaCriarConta.css';

export function TelaCriarConta() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Estados do Formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('M');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);

  // Estados de Controle de Etapa
  const [step, setStep] = useState<'form' | 'verify' | 'success'>('form');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Estados de Verificação de Código
  const [codeDigits, setCodeDigits] = useState<string[]>(Array(6).fill(''));
  const [timer, setTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redimensionamento de Janela via Electron IPC
  useEffect(() => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      if (step === 'form') {
        ipcRenderer.send('set-window-size', { 
          width: 600, 
          height: 650, 
          resizable: false, 
          maximizable: false, 
          minimizable: false, 
          centered: true 
        });
      } else {
        ipcRenderer.send('set-window-size', { 
          width: 600, 
          height: 520, 
          resizable: false, 
          maximizable: false, 
          minimizable: false, 
          centered: true 
        });
      }
    }
  }, [step]);

  // Efeito de Contagem Regressiva
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTimer = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Envio do formulário de criação de conta
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terms) {
      setError("Você deve concordar com os Termos de Serviço para continuar.");
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5121/api/auth/register-cloud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, phone, gender, password })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Erro ao registrar. Verifique os dados inseridos.");
      }

      // Sucesso - Transiciona para a tela de verificação
      setStep('verify');
      setTimer(120); // Código válido por 2 minutos na tela
      setCodeDigits(Array(6).fill(''));
    } catch (err: any) {
      setError(err.message || "Não foi possível conectar ao servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  // Controle dos caixas de entrada de código individuais
  const handleDigitChange = (index: number, value: string) => {
    if (/[^0-9]/.test(value)) return; // Permite apenas dígitos numéricos

    const newDigits = [...codeDigits];
    newDigits[index] = value.substring(value.length - 1); // Registra apenas o último dígito inserido
    setCodeDigits(newDigits);

    // Auto-focus para o próximo campo à direita
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Ao pressionar Backspace em campo vazio, volta o foco para o campo anterior
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasteData)) {
      const newDigits = pasteData.split('');
      setCodeDigits(newDigits);
      inputRefs.current[5]?.focus();
    }
  };

  // Envio do código de validação
  const handleVerifyCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const fullCode = codeDigits.join('');
    if (fullCode.length < 6) {
      setError("Por favor, informe todos os 6 dígitos do código.");
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5121/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, code: fullCode })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Código de verificação inválido ou expirado.");
      }

      const data = await response.json();
      
      // Armazena as informações e token do usuário logado
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));

      // Sucesso total - exibe feedback premium e redireciona
      setStep('success');
      setTimeout(() => {
        navigate('/setup');
      }, 2500);

    } catch (err: any) {
      setError(err.message || "Erro na validação do código.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reenviar código
  const handleResendCode = async () => {
    if (timer > 0) return;

    setIsLoading(true);
    setError('');
    setCodeDigits(Array(6).fill(''));

    try {
      const response = await fetch('http://localhost:5121/api/auth/resend-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Erro ao reenviar o código.");
      }

      setTimer(120); // Reinicia o timer
    } catch (err: any) {
      setError(err.message || "Não foi possível reenviar o código.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-card glass-panel animate-fade-in">
      
      {/* CABEÇALHO COMUM */}
      {step !== 'success' && (
        <div className="register-header">
          <div className="header-top">
            <div className="register-logo">
              <Store size={32} />
              <span>NinoPDV</span>
            </div>
            <button className="btn-close-acc" onClick={() => navigate('/checkout')} disabled={isLoading}>
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      {/* ETAPA 1: FORMULÁRIO DE REGISTRO */}
      {step === 'form' && (
        <>
          <h1 className="register-title" style={{ marginBottom: '1.25rem' }}>Criar conta</h1>
          
          {error && (
            <div className="register-error-message" style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
              {error}
            </div>
          )}

          <form className="register-form" onSubmit={handleRegisterSubmit}>
            <div className="input-group">
              <label htmlFor="name">Nome completo:</label>
              <input 
                type="text" 
                id="name" 
                value={name}
                onChange={e => setName(e.target.value)}
                required 
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">E-mail:</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Informe seu E-mail..." 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="input-group">
              <label htmlFor="phone">Telefone:</label>
              <input 
                type="tel" 
                id="phone" 
                placeholder="(__) _____-____" 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required 
              />
            </div>

            <div className="input-group">
              <label>Gênero:</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="gender" 
                    value="M" 
                    checked={gender === 'M'}
                    onChange={() => setGender('M')}
                  />
                  Masculino
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="gender" 
                    value="F" 
                    checked={gender === 'F'}
                    onChange={() => setGender('F')}
                  />
                  Feminino
                </label>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Senha:</label>
              <div className="password-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  placeholder="Digite sua senha..." 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required 
                />
                <button 
                  type="button" 
                  className="toggle-password" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="checkbox-group">
              <input 
                type="checkbox" 
                id="terms" 
                checked={terms}
                onChange={e => setTerms(e.target.checked)}
                required 
              />
              <label htmlFor="terms">
                Eu concordo com os <a href="#" onClick={e => e.preventDefault()}>Termos de Serviço</a>
              </label>
            </div>

            <button type="submit" className="btn-primary btn-register" disabled={isLoading}>
              {isLoading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <div className="register-footer">
            Já possui uma conta? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/account/login'); }}>Clique aqui</a>
          </div>
        </>
      )}

      {/* ETAPA 2: VERIFICAÇÃO DO CÓDIGO */}
      {step === 'verify' && (
        <div className="verify-container animate-fade-in">
          <button className="btn-back" onClick={() => setStep('form')} disabled={isLoading}>
            <ArrowLeft size={16} />
            <span>Voltar</span>
          </button>

          <h1 className="register-title">Verificação de E-mail</h1>
          <p className="verify-subtitle">
            Enviamos um código de verificação de 6 dígitos para o e-mail:<br />
            <span className="highlight-email">{email}</span>
          </p>

          {error && (
            <div className="register-error-message" style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleVerifyCode} className="verify-form">
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
      )}

      {/* ETAPA 3: SUCESSO E REDIRECIONAMENTO */}
      {step === 'success' && (
        <div className="success-container animate-fade-in">
          <div className="success-animation-area">
            <div className="success-checkmark-circle">
              <CheckCircle2 size={72} className="success-checkmark-icon" />
              <div className="success-checkmark-ring"></div>
            </div>
          </div>
          <h1 className="success-title">Conta Verificada!</h1>
          <p className="success-subtitle">Sua conta foi ativada com sucesso.</p>
          
          <div className="redirect-pulse">
            <span>Redirecionando para as configurações...</span>
          </div>
        </div>
      )}

    </div>
  );
}
