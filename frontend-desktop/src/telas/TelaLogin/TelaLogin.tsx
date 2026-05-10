import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, User, Lock } from 'lucide-react';
import './TelaLogin.css';

export function TelaLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('Admin');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const passInp = document.getElementById('password');
    if (passInp) passInp.focus();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      navigate('/checkout'); // Temporarily navigating to checkout as the main system screen will be created next
    }, 800);
  };

  return (
    <div className="login-container">
      <div className="login-card glass-panel animate-fade-in">
        
        <div className="login-layout">
          {/* Lado Esquerdo - Ícone da Chave (Referência Tela 1) */}
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
                  >
                    <option value="Admin">Admin</option>
                    <option value="Operador 1">Operador 1</option>
                    <option value="Caixa">Caixa</option>
                  </select>
                </div>
              </div>

              <div className="input-row">
                <label htmlFor="password">Senha:</label>
                <div className="input-wrapper">
                  <input 
                    id="password"
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
                >
                  Cancelar
                </button>
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                  Registrar licença de teste
                </a>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

