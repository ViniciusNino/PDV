import { CheckCircle2 } from 'lucide-react';
import { useSucessoFeedback } from './SucessoFeedbackState';
import './SucessoFeedback.css';

interface SucessoFeedbackProps {
  onRedirect: () => void;
}

export function SucessoFeedback({ onRedirect }: SucessoFeedbackProps) {
  useSucessoFeedback({ onRedirect });

  return (
    <div className="success-container animate-fade-in">
      <div className="success-animation-area">
        <div className="success-checkmark-circle">
          <CheckCircle2 size={72} className="success-checkmark-icon" />
          <div className="success-checkmark-ring"></div>
        </div>
      </div>
      <h1 className="success-title">Conta Verificada!</h1>
      <p className="success-subtitle">Sua conta foi ativada com sucesso.</p>
      
      <div className="redirect-pulse">
        <span>Redirecionando para as configurações...</span>
      </div>
    </div>
  );
}
