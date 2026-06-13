import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useTelaAcesseConta() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/checkout');
  };

  const handleFacebookLogin = () => {
    console.log("Iniciando fluxo de login com Facebook...");
    navigate('/checkout');
  };

  useEffect(() => {
    // Configura a janela para tamanho fixo e centralizado no Electron
    try {
      if ((window as any).require) {
        const { ipcRenderer } = (window as any).require('electron');
        ipcRenderer.send('set-window-size', { 
          width: 600, 
          height: 500, 
          resizable: false, 
          maximizable: false, 
          minimizable: false, 
          centered: true 
        });
      }
    } catch (err) {
      console.warn('Electron integration bypassed:', err);
    }
  }, []);

  return {
    showPassword,
    setShowPassword,
    handleLogin,
    handleFacebookLogin,
    navigate
  };
}
