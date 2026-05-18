import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, User, Lock } from 'lucide-react';
import './TelaLogin.css';

export function TelaLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('Admin');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<{ name: string; username: string; role: string }[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Configura a janela para o modo "Login" (centralizada, tamanho fixo)
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('set-window-size', { 
        width: 600, 
        height: 450, 
        resizable: false, 
        maximizable: false, 
        minimizable: false, 
        centered: true 
      });
    }

    const passInp = document.getElementById('password');
    if (passInp) passInp.focus();

    // Busca usuários cadastrados na API
    fetch('http://localhost:5121/api/auth/users')
      .then(res => {
        if (!res.ok) throw new Error("Erro na resposta do servidor");
        return res.json();
      })
      .then((data: { name: string; username: string; role: string }[]) => {
        setUsers(data);
        if (data.length > 0) {
          // Garante o "Admin" como padrão se ele existir na lista
          const adminExists = data.find((u) => u.username.toLowerCase() === 'admin');
          setUsername(adminExists ? adminExists.username : data[0].username);
        }
      })
      .catch(err => {
        console.error("Erro ao carregar usuários:", err);
        // Fallback caso a API esteja inacessível
        const fallbackUsers = [{ name: 'Administrador', username: 'Admin', role: 'Admin' }];
        setUsers(fallbackUsers);
        setUsername('Admin');
      });
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    fetch('http://localhost:5121/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    .then(async res => {
      if (res.ok) {
        return res.json();
      } else {
        const text = await res.text();
        throw new Error(text || "Usuário ou senha inválidos.");
      }
    })
    .then(data => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      // Verifica se a empresa já está configurada
      return fetch('http://localhost:5121/api/settings/check', {
        headers: {
          'Authorization': `Bearer ${data.token}`
        }
      });
    })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao verificar configurações da empresa.");
      return res.json();
    })
    .then(hasCompany => {
      setIsLoading(false);
      if (hasCompany) {
        navigate('/account/login'); // Vai para a Tela 3
      } else {
        navigate('/setup'); // Vai para a Tela 2
      }
    })
    .catch(err => {
      setIsLoading(false);
      setError(err.message || "Não foi possível conectar ao servidor.");
    });
  };

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
          </form>
        </div>
      </div>
    </div>
  );
}

