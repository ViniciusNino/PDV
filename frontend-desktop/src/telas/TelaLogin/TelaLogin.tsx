import { KeyRound, User, Lock } from 'lucide-react';
import { useTelaLogin } from './TelaLoginState';
import './TelaLogin.css';

export function TelaLogin() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    isLoading,
    users,
    error,
    handleLogin
  } = useTelaLogin();

  return (
    <div className="login-card glass-panel animate-fade-in">
      <div className="login-layout">
        {/* Lado Esquerdo - Ícone da Chave */}
        <div className="login-icon-area">
          <div className="key-icon-wrapper">
            <KeyRound size={80} strokeWidth={1.5} />
          </div>
        </div>

        {/* Lado Direito - Formulário */}
        <div className="login-form-area">
          <h1 className="login-title">Autenticação</h1>
          
          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-row">
              <label htmlFor="username">Usuário:</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <select 
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="sleek-select"
                  disabled={isLoading}
                >
                  {users.map(u => (
                    <option key={u.username} value={u.username}>
                      {u.name} ({u.username})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="login-error-message" style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <div className="input-row">
              <label htmlFor="password">Senha:</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input 
                  id="password"
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="login-actions">
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={isLoading || !password}
              >
                {isLoading ? 'Autenticando...' : 'Entrar'}
              </button>
              <button 
                type="button" 
                className="btn-ghost"
                onClick={() => setPassword('')}
                disabled={isLoading}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
