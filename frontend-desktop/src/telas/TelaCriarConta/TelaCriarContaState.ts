import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useTelaCriarConta() {
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

  // Redimensionamento de Janela via Electron IPC
  useEffect(() => {
    const anyWindow = window as any;
    if (anyWindow.require) {
      const { ipcRenderer } = anyWindow.require('electron');
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

      setStep('verify');
      setTimer(120); // Código válido por 2 minutos
      setCodeDigits(Array(6).fill(''));
    } catch (err: any) {
      setError(err.message || "Não foi possível conectar ao servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  // Envio do código de validação
  const handleVerifyCode = async (fullCode: string) => {
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

      setStep('success');
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

  return {
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
  };
}
