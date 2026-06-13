import { Store, X } from 'lucide-react';
import { useTelaCriarConta } from './TelaCriarContaState';
import { CadastroForm } from './components/CadastroForm/CadastroForm';
import { VerificacaoForm } from './components/VerificacaoForm/VerificacaoForm';
import { SucessoFeedback } from './components/SucessoFeedback/SucessoFeedback';
import './TelaCriarConta.css';

export function TelaCriarConta() {
  const {
    showPassword,
    setShowPassword,
    name,
    setName,
    email,
    setEmail,
    phone,
    setPhone,
    gender,
    setGender,
    password,
    setPassword,
    terms,
    setTerms,
    step,
    setStep,
    error,
    setError,
    isLoading,
    codeDigits,
    setCodeDigits,
    timer,
    formatTimer,
    handleRegisterSubmit,
    handleVerifyCode,
    handleResendCode,
    navigate
  } = useTelaCriarConta();

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
            <button 
              type="button" 
              className="btn-close-acc" 
              onClick={() => navigate('/checkout')} 
              disabled={isLoading}
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Exibição comum de erros nas etapas de formulário e verificação */}
      {step !== 'success' && error && (
        <div className="register-error-message" style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
          {error}
        </div>
      )}

      {/* ETAPA 1: FORMULÁRIO DE REGISTRO */}
      {step === 'form' && (
        <CadastroForm 
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          phone={phone}
          setPhone={setPhone}
          gender={gender}
          setGender={setGender}
          password={password}
          setPassword={setPassword}
          terms={terms}
          setTerms={setTerms}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          isLoading={isLoading}
          handleSubmit={handleRegisterSubmit}
          onLoginClick={() => navigate('/account/login')}
        />
      )}

      {/* ETAPA 2: VERIFICAÇÃO DO CÓDIGO */}
      {step === 'verify' && (
        <VerificacaoForm 
          email={email}
          codeDigits={codeDigits}
          setCodeDigits={setCodeDigits}
          timer={timer}
          formatTimer={formatTimer}
          isLoading={isLoading}
          handleVerifyCode={handleVerifyCode}
          handleResendCode={handleResendCode}
          onBackClick={() => {
            setError('');
            setStep('form');
          }}
        />
      )}

      {/* ETAPA 3: SUCESSO E REDIRECIONAMENTO */}
      {step === 'success' && (
        <SucessoFeedback 
          onRedirect={() => navigate('/setup')}
        />
      )}

    </div>
  );
}
