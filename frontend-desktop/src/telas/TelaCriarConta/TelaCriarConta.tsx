import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Eye, EyeOff } from 'lucide-react';
import './TelaCriarConta.css';

export function TelaCriarConta() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="register-container animate-fade-in">
      <div className="register-card glass-panel">
        
        <div className="register-header">
          <div className="register-logo">
            <Store size={32} />
            <span>NinoPDV</span>
          </div>
          <h1 className="register-title">Criar conta</h1>
        </div>

        <form className="register-form" onSubmit={(e) => { e.preventDefault(); navigate('/'); }}>
          <div className="input-group">
            <label htmlFor="name">Nome completo:</label>
            <input type="text" id="name" required />
          </div>

          <div className="input-group">
            <label htmlFor="email">E-mail:</label>
            <input type="email" id="email" placeholder="Informe seu E-mail..." required />
          </div>

          <div className="input-group">
            <label htmlFor="phone">Telefone:</label>
            <input type="tel" id="phone" placeholder="(__) _____-____" required />
          </div>

          <div className="input-group">
            <label>Gênero:</label>
            <div className="radio-group">
              <label className="radio-label">
                <input type="radio" name="gender" value="M" defaultChecked />
                Masculino
              </label>
              <label className="radio-label">
                <input type="radio" name="gender" value="F" />
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
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              Eu concordo com os <a href="#">Termos de Serviço</a>
            </label>
          </div>

          <button type="submit" className="btn-primary btn-register">
            Criar conta
          </button>
        </form>

        <div className="register-footer">
          Já possui uma conta? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Clique aqui</a>
        </div>

      </div>
    </div>
  );
}
