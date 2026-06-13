import { Image as ImageIcon, X } from 'lucide-react';
import { useBuscaClienteModal } from './BuscaClienteModalState';
import './BuscaClienteModal.css';

interface BuscaClienteModalProps {
  onClose: () => void;
}

export function BuscaClienteModal({ onClose }: BuscaClienteModalProps) {
  useBuscaClienteModal();

  return (
    <div className="search-modal-overlay">
      <div className="search-modal glass-panel">
        <div className="search-modal-header">
          <div className="header-title">
            <ImageIcon size={20} />
            <span>Busca de clientes</span>
          </div>
          <div className="header-actions">
            <button className="modal-icon-btn">?</button>
            <button className="modal-icon-btn" onClick={onClose}><X size={18} /></button>
          </div>
        </div>

        <div className="search-modal-body">
          <div className="search-field-wrapper">
            <div className="field-group" style={{ flex: 1 }}>
              <label>Nome, Telefone, E-mail ou CPF:</label>
              <input type="text" autoFocus />
            </div>
            <button className="btn-select">Selecionar</button>
          </div>

          <div className="search-results-table">
            <div className="table-header">
              <div className="th-col">Nome/Fantasia</div>
              <div className="th-col">Telefone</div>
              <div className="th-col">E-mail</div>
              <div className="th-col">CPF/CNPJ</div>
            </div>
            <div className="table-empty">
              {/* Lista vazia inicialmente */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
