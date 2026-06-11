import { Pencil, Trash2 } from 'lucide-react';
import './TabPromocoes.css';
import { formatCurrency } from '../../../../../utils/formatters';
import type { ProductFormData } from '../../../../../types/product.types';

interface TabPromocoesProps {
  formData: ProductFormData;
  promoState: any;
  promoActions: any;
}

export function TabPromocoes({ formData, promoState, promoActions }: TabPromocoesProps) {
  const {
    promoDiaInicio, setPromoDiaInicio,
    promoHoraInicio, setPromoHoraInicio,
    promoDiaFim, setPromoDiaFim,
    promoHoraFim, setPromoHoraFim,
    promoPreco, setPromoPreco,
    promoProibirVenda, setPromoProibirVenda,
    editingPromoId, editingPromoUiId
  } = promoState;

  const {
    handleAddPromotion,
    handleEditPromotion,
    handleDeletePromotion,
    handleCancelEditPromotion
  } = promoActions;

  return (
    <div className="prod-tab-section animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <h3 className="prod-section-title" style={{ margin: 0 }}>Gerenciamento de Promoções</h3>
        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div><strong>Produto:</strong> <span style={{ color: 'var(--text-primary)' }}>{formData.name || '(Sem nome definido)'}</span></div>
          <div><strong>Preço normal:</strong> <span style={{ color: 'var(--primary)', fontWeight: 600 }}>R$ {formData.basePrice || '0,00'}</span></div>
        </div>
      </div>

      <div style={{ background: 'rgba(30, 41, 59, 0.3)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', width: '100%', alignItems: 'flex-end' }}>
          <div style={{ flex: 1.8, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Do dia</span>
            <select
              value={promoDiaInicio}
              onChange={e => setPromoDiaInicio(e.target.value)}
              className="prod-select"
              style={{ height: '38px', padding: '0 2.2rem 0 0.75rem', fontSize: '0.85rem', textOverflow: 'ellipsis' }}
            >
              <option value="Segunda-feira">Segunda-feira</option>
              <option value="Terça-feira">Terça-feira</option>
              <option value="Quarta-feira">Quarta-feira</option>
              <option value="Quinta-feira">Quinta-feira</option>
              <option value="Sexta-feira">Sexta-feira</option>
              <option value="Sábado">Sábado</option>
              <option value="Domingo">Domingo</option>
              <option value="Todos os dias">Todos os dias</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '80px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Às (Hora)</span>
            <input
              type="number"
              min="0"
              max="23"
              value={promoHoraInicio}
              onChange={e => setPromoHoraInicio(Math.min(23, Math.max(0, parseInt(e.target.value) || 0)))}
              className="prod-input"
              style={{ height: '38px' }}
              placeholder="14"
            />
          </div>

          <div style={{ flex: 1.8, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Até o dia</span>
            <select
              value={promoDiaFim}
              onChange={e => setPromoDiaFim(e.target.value)}
              className="prod-select"
              style={{ height: '38px', padding: '0 2.2rem 0 0.75rem', fontSize: '0.85rem', textOverflow: 'ellipsis' }}
            >
              <option value="Segunda-feira">Segunda-feira</option>
              <option value="Terça-feira">Terça-feira</option>
              <option value="Quarta-feira">Quarta-feira</option>
              <option value="Quinta-feira">Quinta-feira</option>
              <option value="Sexta-feira">Sexta-feira</option>
              <option value="Sábado">Sábado</option>
              <option value="Domingo">Domingo</option>
              <option value="Todos os dias">Todos os dias</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '80px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Às (Hora)</span>
            <input
              type="number"
              min="0"
              max="23"
              value={promoHoraFim}
              onChange={e => setPromoHoraFim(Math.min(23, Math.max(0, parseInt(e.target.value) || 0)))}
              className="prod-input"
              style={{ height: '38px' }}
              placeholder="18"
            />
          </div>

          <div style={{ flex: 1.2, minWidth: '100px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Preço (R$)</span>
            <input
              type="text"
              value={promoPreco}
              onChange={e => setPromoPreco(formatCurrency(e.target.value))}
              className="prod-input"
              style={{ height: '38px', textAlign: 'right' }}
              placeholder="0,00"
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0 }}>
            <input
              type="checkbox"
              checked={promoProibirVenda}
              onChange={e => setPromoProibirVenda(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
            />
            Proibir a venda neste período
          </label>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleAddPromotion}
              className="prod-btn prod-btn-primary"
            >
              {editingPromoUiId || editingPromoId ? 'Salvar' : 'Cadastrar'}
            </button>
            {(editingPromoUiId || editingPromoId) && (
              <button
                type="button"
                onClick={handleCancelEditPromotion}
                className="prod-btn prod-btn-secondary"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(15, 23, 42, 0.4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead style={{ background: 'rgba(30, 41, 59, 0.8)', borderBottom: '1px solid var(--border-strong)' }}>
            <tr>
              <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>De (Dia)</th>
              <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600, width: '90px' }}>Às (Hora)</th>
              <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Até (Dia)</th>
              <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600, width: '90px' }}>Às (Hora)</th>
              <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'right', width: '110px' }}>Preço</th>
              <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'center', width: '110px' }}>Proibir Venda</th>
              <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600, width: '100px', textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {formData.promotions.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Nenhuma promoção cadastrada para este produto.
                </td>
              </tr>
            ) : (
              formData.promotions.map((p, idx) => (
                <tr key={p.id || p.uiId || idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}>{p.dayStart}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{p.hourStart}:00h</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}>{p.dayEnd}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{p.hourEnd}:00h</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: 'var(--primary)', fontWeight: 600 }}>R$ {p.price}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                    {p.isSaleForbidden ? (
                      <span style={{ color: '#ef4444', fontWeight: 600 }}>Sim</span>
                    ) : 'Não'}
                  </td>
                  <td style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button
                      type="button"
                      onClick={() => handleEditPromotion(p)}
                      className="action-btn edit-btn"
                      title="Editar"
                      style={{ width: '28px', height: '28px' }}
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePromotion(p)}
                      className="action-btn delete-btn"
                      title="Excluir"
                      style={{ width: '28px', height: '28px' }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
