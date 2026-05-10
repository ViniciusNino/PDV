import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Store, WifiHigh } from 'lucide-react';
import './TelaLogin.css';

export function TelaLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Focus the first input on load (Desktop optimization)
  useEffect(() => {
    const userInp = document.getElementById('username');
    if (userInp) userInp.focus();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate auth and redirect
    setTimeout(() => {
      setIsLoading(false);
      navigate('/checkout');
    }, 800);
  };

  return (
    <div className="login-container">
      <div className="login-card glass-panel animate-fade-in">
        
        <div className="login-header">
          <div className="login-logo">
            <Store size={36} />
            <span>NinoPDV</span>
          </div>
          <p className="login-subtitle">Acesso ao Terminal de Vendas</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username">Operador</label>
            <div className="input-wrapper">
              <User size={20} className="input-icon" />
              <input 
                id="username"
                type="text" 
                placeholder="Nome de usuário" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input 
                id="password"
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isLoading || !username || !password}
            style={{ marginTop: '1rem' }}
          >
            {isLoading ? 'Autenticando...' : 'Entrar no Sistema'}
          </button>
        </form>

        <div className="login-footer">
          <div className="offline-badge">
            <WifiHigh size={16} />
            <span>Sincronização Ativa</span>
          </div>
        </div>

      </div>
    </div>
  );
}
