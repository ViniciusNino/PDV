import { Store, Eye, EyeOff, LogIn, X } from 'lucide-react';
import { useTelaAcesseConta } from './TelaAcesseContaState';
import './TelaAcesseConta.css';

export function TelaAcesseConta() {
  const {
    showPassword,
    setShowPassword,
    handleLogin,
    handleFacebookLogin,
    navigate
  } = useTelaAcesseConta();

  return (
    <div className="login-account-card glass-panel animate-fade-in">
      
      <div className="login-account-header">
        <div className="header-top">
          <div className="login-account-logo">
            <Store size={32} />
            <span>NinoPDV</span>
          </div>
          <button className="btn-close-acc" onClick={() => navigate('/checkout')}>
            <X size={24} />
          </button>
        </div>
        <h1 className="login-account-title">Acesse sua conta</h1>
      </div>

      <form className="login-account-form" onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="email">E-mail ou Usuário:</label>
          <input type="text" id="email" placeholder="Informe seu E-mail ou Usuário..." required />
        </div>

        <div className="input-group">
          <label htmlFor="password">Senha:</label>
          <div className="password-wrapper">
            <input 
              type={showPassword ? "text" : "password"} 
              id="password" 
              placeholder="Digite sua senha..." 
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

        <div className="login-options">
          <label className="remember-me">
            <input type="checkbox" /> Lembrar de mim
          </label>
          <a href="#" className="forgot-password">Esqueceu a senha?</a>
        </div>

        <button type="submit" className="btn-primary btn-login-acc">
          <LogIn size={20} />
          Entrar
        </button>

        <div className="social-login-divider">
          <span>ou</span>
        </div>

        <button 
          type="button" 
          className="btn-social btn-facebook"
          onClick={handleFacebookLogin}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Entrar com o Facebook
        </button>
      </form>

      <div className="login-account-footer">
        Não possui uma conta? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/account/register'); }}>Clique aqui</a>
      </div>

    </div>
  );
}
