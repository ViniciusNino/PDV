import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface UserInfo {
  name: string;
  username: string;
  role: string;
}

export function useTelaLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('Admin');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Configura a janela para o modo "Login" (centralizada, tamanho fixo)
    const anyWindow = window as any;
    if (anyWindow.require) {
      const { ipcRenderer } = anyWindow.require('electron');
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
      .then((data: UserInfo[]) => {
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

  return {
    username,
    setUsername,
    password,
    setPassword,
    isLoading,
    users,
    error,
    handleLogin
  };
}
