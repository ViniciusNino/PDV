import { Eye, EyeOff } from 'lucide-react';
import { useCadastroForm } from './CadastroFormState';
import './CadastroForm.css';

interface CadastroFormProps {
  name: string;
  setName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  gender: string;
  setGender: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  terms: boolean;
  setTerms: (val: boolean) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  onLoginClick: () => void;
}

export function CadastroForm({
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
  showPassword,
  setShowPassword,
  isLoading,
  handleSubmit,
  onLoginClick
}: CadastroFormProps) {
  useCadastroForm();

  return (
    <>
      <h1 className="register-title" style={{ marginBottom: '1.25rem' }}>Criar conta</h1>

      <form className="register-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="name">Nome completo:</label>
          <input 
            type="text" 
            id="name" 
            value={name}
            onChange={e => setName(e.target.value)}
            required 
            disabled={isLoading}
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">E-mail:</label>
          <input 
            type="email" 
            id="email" 
            placeholder="Informe seu E-mail..." 
            value={email}
            onChange={e => setEmail(e.target.value)}
            required 
            disabled={isLoading}
          />
        </div>

        <div className="input-group">
          <label htmlFor="phone">Telefone:</label>
          <input 
            type="tel" 
            id="phone" 
            placeholder="(__) _____-____" 
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required 
            disabled={isLoading}
          />
        </div>

        <div className="input-group">
          <label>Gênero:</label>
          <div className="radio-group">
            <label className="radio-label">
              <input 
                type="radio" 
                name="gender" 
                value="M" 
                checked={gender === 'M'}
                onChange={() => setGender('M')}
                disabled={isLoading}
              />
              Masculino
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                name="gender" 
                value="F" 
                checked={gender === 'F'}
                onChange={() => setGender('F')}
                disabled={isLoading}
              />
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
              value={password}
              onChange={e => setPassword(e.target.value)}
              required 
              disabled={isLoading}
            />
            <button 
              type="button" 
              className="toggle-password" 
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="checkbox-group">
          <input 
            type="checkbox" 
            id="terms" 
            checked={terms}
            onChange={e => setTerms(e.target.checked)}
            required 
            disabled={isLoading}
          />
          <label htmlFor="terms">
            Eu concordo com os <a href="#" onClick={e => e.preventDefault()}>Termos de Serviço</a>
          </label>
        </div>

        <button type="submit" className="btn-primary btn-register" disabled={isLoading}>
          {isLoading ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>

      <div className="register-footer">
        Já possui uma conta? <a href="#" onClick={(e) => { e.preventDefault(); onLoginClick(); }}>Clique aqui</a>
      </div>
    </>
  );
}
