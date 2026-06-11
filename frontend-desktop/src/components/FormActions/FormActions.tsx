import { type LucideIcon } from 'lucide-react';
import { useFormActions } from './useFormActions';
import './FormActions.css';

export interface FormActionsProps {
  onSave: () => void | Promise<void>;
  onCancel: () => void;
  saveText?: string;
  cancelText?: string;
  saveIcon?: LucideIcon;
  disableSave?: boolean;
}

export function FormActions({
  onSave,
  onCancel,
  saveText = 'Salvar',
  cancelText = 'Cancelar',
  saveIcon: SaveIcon,
  disableSave = false
}: FormActionsProps) {
  const { isSubmitting, handleSaveWrapper } = useFormActions(onSave);

  return (
    <div className="form-actions-container">
      <button 
        className="prod-btn prod-btn-secondary" 
        onClick={onCancel}
        disabled={isSubmitting}
        type="button"
      >
        {cancelText}
      </button>
      <button 
        className="prod-btn prod-btn-primary" 
        onClick={handleSaveWrapper}
        disabled={disableSave || isSubmitting}
        type="button"
      >
        {SaveIcon && !isSubmitting && <SaveIcon size={16} />}
        {isSubmitting && <span className="spinner-small" />}
        {isSubmitting ? 'Salvando...' : saveText}
      </button>
    </div>
  );
}
