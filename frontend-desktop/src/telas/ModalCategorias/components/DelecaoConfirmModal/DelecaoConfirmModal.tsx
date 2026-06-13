import { AlertCircle } from 'lucide-react';
import { useDelecaoConfirmModal } from './DelecaoConfirmModalState';
import './DelecaoConfirmModal.css';

interface DelecaoConfirmModalProps {
  categoryName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DelecaoConfirmModal({
  categoryName,
  onCancel,
  onConfirm
}: DelecaoConfirmModalProps) {
  
  useDelecaoConfirmModal();

  return (
    <div className="cat-confirm-overlay animate-fade-in" onClick={onCancel}>
      <div className="cat-confirm-card glass-panel animate-slide-in" onClick={(e) => e.stopPropagation()}>
        <div className="cat-confirm-icon-wrapper">
          <AlertCircle size={32} className="cat-confirm-icon" />
        </div>
        <h3>Excluir Categoria?</h3>
        <p>Você tem certeza que deseja excluir permanentemente a categoria <strong>"{categoryName}"</strong>?</p>
        <span className="cat-confirm-warning">Esta ação não poderá ser desfeita e removerá a classificação dos produtos que a utilizam.</span>
        
        <div className="cat-confirm-actions">
          <button 
            type="button"
            className="cat-btn cat-btn-secondary" 
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button 
            type="button"
            className="cat-btn cat-btn-danger" 
            onClick={onConfirm}
          >
            Excluir Categoria
          </button>
        </div>
      </div>
    </div>
  );
}
