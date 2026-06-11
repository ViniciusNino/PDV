import { Pencil, Trash2 } from 'lucide-react';
import { useStockSectorModal } from './StockSectorModalState';
import { NotificationAlert } from '../../../../components/NotificationAlert/NotificationAlert';
import './StockSectorModal.css';

export interface StockSectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StockSectorModal({ isOpen, onClose }: StockSectorModalProps) {
  const {
    sectorsList,
    sectorName,
    setSectorName,
    sectorDescription,
    setSectorDescription,
    editingSectorId,
    error,
    successMessage,
    handleSaveSector,
    handleEditSector,
    handleCancelSectorEdit,
    handleDeleteSector
  } = useStockSectorModal();

  if (!isOpen) return null;

  return (
    <div className="prod-modal-overlay sector-modal-overlay animate-fade-in" onClick={onClose}>
      <div
        className="mdi-window active sector-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Notificações independentes do Modal de Setores */}
        {error && <NotificationAlert type="error" message={error} />}
        {successMessage && <NotificationAlert type="success" message={successMessage} />}

        {/* Cabeçalho de Janela MDI */}
        <div className="mdi-window-header sector-modal-header">
          <div className="mdi-window-title sector-modal-title">
            <span className="mdi-window-icon">💻</span>
            <span>Setores de Estoque</span>
          </div>
          <div className="mdi-window-controls">
            <button
              className="mdi-control-btn btn-close sector-modal-close"
              title="Fechar"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="sector-modal-body">
          {/* Form de Cadastro */}
          <div className="sector-form-row">
            <div className="sector-form-col-1">
              <span>Nome Setor *</span>
              <input
                type="text"
                value={sectorName}
                onChange={e => setSectorName(e.target.value)}
                placeholder="Ex: Cozinha, Bar..."
                className="prod-input prop-input-custom"
              />
            </div>
            <div className="sector-form-col-2">
              <span>Descrição</span>
              <input
                type="text"
                value={sectorDescription}
                onChange={e => setSectorDescription(e.target.value)}
                placeholder="Descrição do setor"
                className="prod-input prop-input-custom"
              />
            </div>
          </div>

          {/* Botões Cadastrar, Editar e Excluir */}
          <div className="sector-actions-row">
            <button
              className="prod-btn prod-btn-primary sector-btn-action sector-btn-primary-custom"
              onClick={handleSaveSector}
            >
              {editingSectorId ? 'Salvar' : 'Cadastrar'}
            </button>
            {editingSectorId && (
              <button
                className="prod-btn prod-btn-secondary sector-btn-action"
                onClick={handleCancelSectorEdit}
              >
                Cancelar
              </button>
            )}
          </div>

          {/* Tabela de Setores */}
          <div className="sector-table-container">
            <table className="prod-modal-table">
              <thead className="prod-modal-table-header">
                <tr>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th className="col-actions">Ações</th>
                </tr>
              </thead>
              <tbody>
                {sectorsList.length === 0 ? (
                  <tr className="prod-modal-table-empty">
                    <td colSpan={3}>
                      Nenhum setor de estoque cadastrado.
                    </td>
                  </tr>
                ) : (
                  sectorsList.map(s => (
                    <tr key={s.id}>
                      <td className="font-medium">{s.name}</td>
                      <td className="text-muted">{s.description || '-'}</td>
                      <td className="actions-cell">
                        <button
                          type="button"
                          onClick={() => handleEditSector(s)}
                          className="action-btn edit-btn action-btn-small"
                          title="Editar"
                        >
                          <Pencil size={10} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSector(s.id, s.name)}
                          className="action-btn delete-btn action-btn-small"
                          title="Excluir"
                        >
                          <Trash2 size={10} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rodapé */}
        <div className="prod-modal-footer-secondary">
          <button className="prod-btn prod-btn-secondary prop-btn-action" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
