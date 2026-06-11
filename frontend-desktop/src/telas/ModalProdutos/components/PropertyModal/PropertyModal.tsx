import { Layers, X } from 'lucide-react';
import { usePropertyModal } from './PropertyModalState';
import './PropertyModal.css';

export interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPropertyDeleted?: (deletedName: string) => void;
}

export function PropertyModal({ isOpen, onClose, onPropertyDeleted }: PropertyModalProps) {
  const {
    propNameInput,
    setPropNameInput,
    propAbbrevInput,
    setPropAbbrevInput,
    selectedPropId,
    customProperties,
    handleAddProperty,
    handleSaveProperty,
    handleDeleteProperty,
    handleSelectProperty
  } = usePropertyModal();

  if (!isOpen) return null;

  return (
    <div className="prod-modal-overlay prop-modal-overlay animate-fade-in" onClick={onClose}>
      <div
        className="prop-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="prop-modal-header">
          <h3 className="prop-modal-title">
            <Layers size={16} />
            Cadastro de Propriedades
          </h3>
          <button onClick={onClose} className="prop-modal-close">
            <X size={18} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="prop-modal-body">
          {/* Inputs na mesma linha */}
          <div className="prop-form-row">
            <div className="prop-form-col-2">
              <span>Nome:</span>
              <input
                type="text"
                value={propNameInput}
                onChange={(e) => setPropNameInput(e.target.value)}
                placeholder="Ex: Pequeno, Médio, Calabresa..."
                className="prod-input prop-input-custom"
              />
            </div>
            <div className="prop-form-col-1">
              <span>Abreviação:</span>
              <input
                type="text"
                value={propAbbrevInput}
                onChange={(e) => setPropAbbrevInput(e.target.value)}
                placeholder="Ex: PEQ, MED, CAL..."
                className="prod-input prop-input-custom"
              />
            </div>
          </div>

          {/* Botões Cadastrar, Editar e Excluir */}
          <div className="prop-actions-row">
            <button
              className="prod-btn prod-btn-primary prop-btn-action"
              disabled={!!selectedPropId}
              onClick={handleAddProperty}
            >
              Cadastrar
            </button>

            <button
              className="prod-btn prod-btn-secondary prop-btn-action"
              disabled={!selectedPropId}
              onClick={handleSaveProperty}
            >
              Editar (Salvar)
            </button>

            <button
              className="prod-btn prod-btn-secondary prop-btn-action prop-btn-danger"
              disabled={!selectedPropId}
              onClick={() => handleDeleteProperty(onPropertyDeleted)}
            >
              Excluir
            </button>
          </div>

          {/* Tabela de Propriedades Cadastradas */}
          <div className="prop-table-container">
            <table className="prod-modal-table">
              <thead className="prod-modal-table-header">
                <tr>
                  <th>Nome</th>
                  <th>Abreviação</th>
                </tr>
              </thead>
              <tbody>
                {customProperties.length === 0 && (
                  <tr className="prod-modal-table-empty">
                    <td colSpan={2}>
                      Nenhuma propriedade cadastrada. Use os campos acima para cadastrar.
                    </td>
                  </tr>
                )}
                {customProperties.map((p: any) => {
                  const isSelected = selectedPropId === p.id;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => handleSelectProperty(p)}
                      className={`package-row-hover prop-row-select ${isSelected ? 'selected' : ''}`}
                    >
                      <td>{p.name}</td>
                      <td>{p.abbreviation || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rodapé do Modal */}
        <div className="prod-modal-footer-secondary">
          <button className="prod-btn prod-btn-secondary prop-btn-action" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
