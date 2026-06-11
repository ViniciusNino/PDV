import { X, type LucideIcon } from 'lucide-react';
import './Header.css';

export interface HeaderProps {
  title: string;
  icon?: LucideIcon;
  onClose: () => void;
}

export function Header({ title, icon: Icon, onClose }: HeaderProps) {
  return (
    <header className="modal-header">
      <div className="modal-header-title">
        {Icon && <Icon size={20} className="text-primary" />}
        <span>{title}</span>
      </div>
      <button className="modal-btn-close" onClick={onClose} title="Fechar">
        <X size={18} />
      </button>
    </header>
  );
}
