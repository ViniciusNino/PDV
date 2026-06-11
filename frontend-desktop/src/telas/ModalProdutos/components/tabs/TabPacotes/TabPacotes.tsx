import { Pencil, Trash2, Layers, Plus, Search } from 'lucide-react';
import { EmptyTableRow } from '../../shared/EmptyTableRow';
import './TabPacotes.css';
import { formatCurrency } from '../../../../../utils/formatters';
import type { ProductFormData } from '../../../../../types/product.types';

interface TabPacotesProps {
  formData: ProductFormData;
  productsList: any[];
  modifierGroupsState: any;
  modifierGroupsActions: any;
}

export function TabPacotes({
  formData,
  productsList,
  modifierGroupsState,
  modifierGroupsActions
}: TabPacotesProps) {
  const {
    selectedGroupUiId,
    isEditingGroup,
    groupName, setGroupName,
    groupCanBeFractioned, setGroupCanBeFractioned,
    groupPriceRule, setGroupPriceRule,
    groupMinSelections, setGroupMinSelections,
    groupMaxSelections, setGroupMaxSelections,
    customProperties,
    setIsPropertyModalOpen,
    selectedOptionId,
    isEditingOption,
    optType, setOptType,
    setOptProductId,
    optProductNameInput, setOptProductNameInput,
    optPropName, setOptPropName,
    optBasePrice, setOptBasePrice,
    optTotalPrice, setOptTotalPrice,
    optMinQuantity, setOptMinQuantity,
    optMaxQuantity, setOptMaxQuantity,
    optParentOptionId, setOptParentOptionId,
    optAbbreviation, setOptAbbreviation,
    optIsPreSelected, setOptIsPreSelected,
    optIsVisible, setOptIsVisible,
    showProductSuggestions, setShowProductSuggestions
  } = modifierGroupsState;

  const {
    handleSelectOption,
    handleStartEditOption,
    handleCancelEditOption,
    handleAddOption,
    handleSaveOption,
    handleDeleteOption,
    handleSelectGroup,
    handleStartEditGroup,
    handleCancelEditGroup,
    handleAddGroup,
    handleSaveGroup,
    handleDeleteGroup
  } = modifierGroupsActions;

  return (
    <div className="prod-tab-section animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* 1. PAINEL SUPERIOR - CONFIGURAÇÃO DE ETAPA (CADASTRO E EDIÇÃO) */}
      <div className="prod-crud-card">
        <h4 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={16} style={{ color: 'var(--primary)' }} />
          {isEditingGroup ? 'Editar Etapa do Pacote' : 'Cadastrar Etapa do Pacote'}
        </h4>

        {/* Linha 1 */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', width: '100%' }}>
          {/* Linha 1 Esquerda */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Descrição:</span>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Ex: Etapa 1: Tamanho, Etapa 2: Sabores, Etapa 3: Bordas..."
              className="prod-input"
              style={{ height: '38px', background: 'rgba(0,0,0,0.2)' }}
            />
          </div>

          {/* Linha 1 Direita */}
          <div style={{ display: 'flex', gap: '1rem', width: '246px' }}>
            <div style={{ width: '120px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tipo de Seleção:</span>
              <select
                value={groupCanBeFractioned ? "fracionado" : "inteiro"}
                onChange={(e) => setGroupCanBeFractioned(e.target.value === "fracionado")}
                className="prod-select"
                style={{ height: '38px', background: 'rgba(0,0,0,0.2)', padding: '0 0.5rem', width: '120px' }}
              >
                <option value="inteiro">Inteiro</option>
                <option value="fracionado">Fracionado</option>
              </select>
            </div>

            <div style={{ width: '110px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Função de Preço:</span>
              <select
                value={groupPriceRule}
                onChange={(e) => setGroupPriceRule(parseInt(e.target.value))}
                className="prod-select"
                style={{ height: '38px', background: 'rgba(0,0,0,0.2)', padding: '0 0.5rem', width: '110px' }}
              >
                <option value={3}>Mínimo</option>
                <option value={0}>Média</option>
                <option value={1}>Máximo</option>
                <option value={2}>Soma</option>
              </select>
            </div>
          </div>
        </div>

        {/* Linha 2 */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', width: '100%' }}>
          {/* Linha 2 Esquerda */}
          <div style={{ flex: 1, display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div style={{ width: '140px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Quantidade Mínima:</span>
              <input
                type="number"
                min="0"
                value={groupMinSelections}
                onChange={(e) => setGroupMinSelections(Math.max(0, parseInt(e.target.value) || 0))}
                className="prod-input"
                style={{ height: '38px', background: 'rgba(0,0,0,0.2)', width: '140px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ width: '140px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Quantidade Máxima:</span>
              <input
                type="number"
                min="1"
                value={groupMaxSelections}
                onChange={(e) => setGroupMaxSelections(Math.max(1, parseInt(e.target.value) || 1))}
                className="prod-input"
                style={{ height: '38px', background: 'rgba(0,0,0,0.2)', width: '140px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Linha 2 Direita */}
          <div style={{ display: 'flex', gap: '0.5rem', width: '246px', justifyContent: 'flex-end' }}>
            <button
              className="prod-btn prod-btn-primary"
              onClick={(e) => { e.preventDefault(); isEditingGroup ? handleSaveGroup() : handleAddGroup(); }}
              style={{ background: 'var(--primary)', width: isEditingGroup ? '110px' : '120px', height: '38px', padding: 0 }}
            >
              {isEditingGroup ? 'Salvar' : 'Cadastrar'}
            </button>

            {isEditingGroup && (
              <button
                className="prod-btn prod-btn-secondary"
                onClick={(e) => { e.preventDefault(); handleCancelEditGroup(); }}
                style={{ width: '110px', height: '38px', padding: 0 }}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>

      </div>

      {/* 2. TABELA CENTRAL - LISTAGEM DE ETAPAS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Etapas Cadastradas (Clique simples para selecionar | Duplo clique para editar):</span>
        <div style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden', background: 'var(--bg-surface)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead style={{ background: '#1e293b', borderBottom: '1px solid var(--border-strong)' }}>
              <tr>
                <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Descrição</th>
                <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, width: '100px', textAlign: 'center' }}>Múltiplo</th>
                <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, width: '140px' }}>Tipo de Seleção</th>
                <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, width: '120px' }}>Função</th>
                <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, width: '80px', textAlign: 'center' }}>Mínimo</th>
                <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, width: '80px', textAlign: 'center' }}>Máximo</th>
                <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, width: '90px', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {formData.modifierGroups.length === 0 && (
                <EmptyTableRow colSpan={7} message="Nenhuma etapa cadastrada. Preencha os campos acima para cadastrar a primeira etapa." />
              )}
              {formData.modifierGroups.map((group) => {
                const uiId = group.uiId || group.id || '';
                const isSelected = selectedGroupUiId === uiId;
                
                let pricingText = 'Média';
                if (group.priceRule === 1) pricingText = 'Máximo';
                else if (group.priceRule === 2) pricingText = 'Soma';
                else if (group.priceRule === 3) pricingText = 'Mínimo';

                return (
                  <tr
                    key={uiId}
                    onClick={() => handleSelectGroup(uiId)}
                    onDoubleClick={() => handleStartEditGroup(group)}
                    style={{
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(249, 115, 22, 0.08)' : 'transparent',
                      borderBottom: '1px solid var(--border-subtle)',
                      borderLeft: isSelected ? '3px solid #f97316' : '3px solid transparent',
                      transition: 'all var(--transition-fast)',
                      fontWeight: isSelected ? '600' : 'normal',
                      color: isSelected ? '#f97316' : 'var(--text-primary)'
                    }}
                    className={`package-row-hover ${isSelected ? 'selected' : ''}`}
                  >
                    <td style={{ padding: '0.6rem 0.75rem' }}>{group.name}</td>
                    <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>
                      {group.maxSelections > 1 ? (
                        <span style={{ color: '#10b981', fontWeight: 600 }}>Sim</span>
                      ) : 'Não'}
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem' }}>
                      {group.canBeFractioned ? 'Fracionada' : 'Inteira'}
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem' }}>{pricingText}</td>
                    <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>{group.minSelections}</td>
                    <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>{group.maxSelections}</td>
                    <td style={{ padding: '0.25rem 0.75rem', textAlign: 'center', verticalAlign: 'middle' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleStartEditGroup(group)}
                          className="action-btn edit-btn"
                          title="Editar Etapa"
                          style={{ width: '24px', height: '24px', padding: 0 }}
                        >
                          <Pencil size={10} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteGroup(group)}
                          className="action-btn delete-btn"
                          title="Excluir Etapa"
                          style={{ width: '24px', height: '24px', padding: 0 }}
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. PAINEL INFERIOR - ITENS/OPÇÕES DA ETAPA SELECIONADA */}
      {(() => {
        const selectedGroup = formData.modifierGroups.find(g => (g.uiId || g.id) === selectedGroupUiId);
        const selectedIdx = formData.modifierGroups.findIndex(g => (g.uiId || g.id) === selectedGroupUiId);

        if (!selectedGroup) {
          return (
            <div style={{ flex: 1, padding: '2.5rem', textAlign: 'center', background: 'rgba(15, 23, 42, 0.2)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Layers size={28} style={{ color: 'var(--text-muted)' }} />
              <h5 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '0.9rem' }}>Nenhuma etapa selecionada</h5>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Selecione uma etapa na lista acima para gerenciar e configurar seus itens e opções.</p>
            </div>
          );
        }

        // Função auxiliar para pegar opções qualificadas das etapas anteriores
        const getParentOptionsForGroup = (currentIdx: number) => {
          const list: Array<{ id: string; name: string; groupName: string }> = [];
          for (let i = 0; i < currentIdx; i++) {
            const prevGroup = formData.modifierGroups[i];
            prevGroup.options.forEach(opt => {
              const optId = opt.id || opt.productId || opt.name;
              list.push({
                id: optId,
                name: opt.name,
                groupName: prevGroup.name || `Etapa ${i + 1}`
              });
            });
          }
          return list;
        };

        const parentOptions = getParentOptionsForGroup(selectedIdx);

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1, minHeight: '350px' }}>
            
            {/* PAINEL INFERIOR - CADASTRO/EDIÇÃO DE OPÇÕES */}
            <div className="prod-crud-card">
              <h4 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={16} style={{ color: '#f97316' }} />
                {isEditingOption ? `Editar Item da Etapa: ${selectedGroup.name}` : `Cadastrar Item na Etapa: ${selectedGroup.name}`}
              </h4>

              {/* Linha 1 */}
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', width: '100%' }}>
                {/* Linha 1 Esquerda (Tipo e Nome do Item) */}
                <div style={{ flex: 1, display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                  <div style={{ width: '130px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tipo de Item:</span>
                    <select
                      value={optType}
                      onChange={(e) => {
                        setOptType(e.target.value as 'prod' | 'prop');
                        handleCancelEditOption();
                      }}
                      disabled={selectedGroup.options.length > 0}
                      className="prod-select"
                      style={{ height: '36px', background: 'rgba(0,0,0,0.2)', padding: '0 0.75rem', width: '130px' }}
                    >
                      <option value="prop">Propriedade</option>
                      <option value="prod">Produto</option>
                    </select>
                  </div>

                  {/* Campo Condicional baseia-se em optType */}
                  {optType === 'prod' ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem', position: 'relative' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Produto:</span>
                      <div style={{ position: 'relative', width: '100%' }}>
                        <input
                          type="text"
                          value={optProductNameInput}
                          onChange={(e) => {
                            setOptProductNameInput(e.target.value);
                            setShowProductSuggestions(true);
                          }}
                          onFocus={() => setShowProductSuggestions(true)}
                          placeholder="Digite para buscar produto..."
                          className="prod-input"
                          style={{ height: '36px', padding: '0 2.2rem 0 0.75rem', background: 'rgba(0,0,0,0.2)', width: '100%', boxSizing: 'border-box' }}
                        />
                        <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                          <Search size={16} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
                        </div>
                        
                        {/* Lista suspensa de sugestões */}
                        {showProductSuggestions && optProductNameInput.trim() && (
                          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', zIndex: 1000, maxHeight: '200px', overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                            {productsList
                              .filter(p => p.name.toLowerCase().includes(optProductNameInput.toLowerCase()))
                              .map(p => (
                                <div
                                  key={p.id}
                                  onClick={() => {
                                    setOptProductId(p.id);
                                    setOptProductNameInput(p.name);
                                    setShowProductSuggestions(false);
                                  }}
                                  style={{ padding: '0.5rem 0.75rem', cursor: 'pointer', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}
                                  className="package-row-hover"
                                >
                                  {p.name}
                                </div>
                              ))
                            }
                            {productsList.filter(p => p.name.toLowerCase().includes(optProductNameInput.toLowerCase())).length === 0 && (
                              <div style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Nenhum produto encontrado.</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Propriedade:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                        <select
                          value={optPropName}
                          onChange={(e) => {
                            const selectedVal = e.target.value;
                            setOptPropName(selectedVal);
                            const matchedProp = customProperties.find((p: any) => p.name === selectedVal);
                            if (matchedProp && !optAbbreviation) {
                              setOptAbbreviation(matchedProp.abbreviation);
                            }
                          }}
                          className="prod-select"
                          style={{ height: '36px', background: 'rgba(0,0,0,0.2)', padding: '0 0.75rem', flex: 1 }}
                        >
                          <option value="">Selecione...</option>
                          {customProperties.map((p: any) => <option key={p.id} value={p.name}>{p.name}</option>)}
                        </select>
                        
                        <div
                          onClick={() => {
                            setIsPropertyModalOpen(true);
                          }}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary)', color: 'white', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', flexShrink: 0 }}
                        >
                          <Plus size={14} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Linha 1 Direita (Preços e Quantidades) */}
                <div style={{ display: 'flex', gap: '1rem', width: '368px' }}>
                  <div style={{ width: '80px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Preço Base:</span>
                    <input
                      type="text"
                      value={optBasePrice}
                      onChange={(e) => setOptBasePrice(formatCurrency(e.target.value))}
                      className="prod-input"
                      style={{ height: '36px', padding: '0 0.5rem', background: 'rgba(0,0,0,0.2)', textAlign: 'right', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div style={{ width: '80px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total:</span>
                    <input
                      type="text"
                      value={optTotalPrice}
                      onChange={(e) => setOptTotalPrice(formatCurrency(e.target.value))}
                      className="prod-input"
                      style={{ height: '36px', padding: '0 0.5rem', background: 'rgba(0,0,0,0.2)', textAlign: 'right', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div style={{ width: '80px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Qtd. Mínima:</span>
                    <input
                      type="number"
                      min="0"
                      value={optMinQuantity}
                      onChange={(e) => setOptMinQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                      className="prod-input"
                      style={{ height: '36px', padding: '0 0.5rem', background: 'rgba(0,0,0,0.2)', width: '80px', boxSizing: 'border-box', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div style={{ width: '80px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Qtd. Máxima:</span>
                    <input
                      type="number"
                      min="1"
                      value={optMaxQuantity}
                      onChange={(e) => setOptMaxQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="prod-input"
                      style={{ height: '36px', padding: '0 0.5rem', background: 'rgba(0,0,0,0.2)', width: '80px', boxSizing: 'border-box', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Linha 2 */}
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', width: '100%' }}>
                {/* Linha 2 Esquerda (Abreviação, Associação) */}
                <div style={{ flex: 1, display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                  {/* Abreviação */}
                  <div style={{ width: '130px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Abreviação:</span>
                    <input
                      type="text"
                      value={optAbbreviation}
                      onChange={(e) => setOptAbbreviation(e.target.value)}
                      placeholder="Ex: PEQ"
                      className="prod-input"
                      style={{ height: '36px', padding: '0 0.75rem', background: 'rgba(0,0,0,0.2)', width: '130px', boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* Associação (Etapa anterior) */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>Associação (Etapa anterior):</span>
                    <select
                      value={optParentOptionId}
                      onChange={(e) => setOptParentOptionId(e.target.value)}
                      className="prod-select"
                      style={{ height: '36px', padding: '0 0.75rem', background: 'rgba(0,0,0,0.2)', width: '100%' }}
                    >
                      <option value="">Sem Associação (Disponível sempre)</option>
                      {parentOptions.map(po => <option key={po.id} value={po.id}>{po.groupName} → {po.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* Linha 2 Direita (Checkboxes + Botões de Ação) */}
                <div style={{ display: 'flex', gap: '0.5rem', width: '368px', justifyContent: 'flex-end', alignItems: 'center', height: '36px' }}>
                  {/* Checkboxes */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', userSelect: 'none', marginRight: 'auto' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--text-primary)', margin: 0, whiteSpace: 'nowrap' }}>
                      <input
                        type="checkbox"
                        checked={optIsPreSelected}
                        onChange={(e) => setOptIsPreSelected(e.target.checked)}
                        style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                      />
                      Selecionado
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--text-primary)', margin: 0, whiteSpace: 'nowrap' }}>
                      <input
                        type="checkbox"
                        checked={optIsVisible}
                        onChange={(e) => setOptIsVisible(e.target.checked)}
                        style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                      />
                      Visível
                    </label>
                  </div>

                  {/* Botões */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="prod-btn prod-btn-primary"
                      onClick={(e) => { e.preventDefault(); isEditingOption ? handleSaveOption() : handleAddOption(); }}
                      style={{ background: 'var(--primary)', width: isEditingOption ? '95px' : '110px', height: '36px', padding: 0 }}
                    >
                      {isEditingOption ? 'Salvar' : 'Cadastrar'}
                    </button>

                    {isEditingOption && (
                      <button
                        className="prod-btn prod-btn-secondary"
                        onClick={(e) => { e.preventDefault(); handleCancelEditOption(); }}
                        style={{ width: '95px', height: '36px', padding: 0 }}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Lista de Opções da Etapa Selecionada */}
            <div style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflowX: 'auto', background: 'var(--bg-surface)' }}>
              <table style={{ width: '100%', minWidth: '1100px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead style={{ background: '#1e293b', borderBottom: '1px solid var(--border-strong)' }}>
                  <tr>
                    <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Opção (Descrição)</th>
                    <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, width: '90px' }}>Abreviação</th>
                    <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, width: '180px' }}>Associação (Etapa anterior)</th>
                    <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, width: '100px', textAlign: 'center' }}>Selecionado</th>
                    <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, width: '80px', textAlign: 'center' }}>Visível</th>
                    <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, width: '110px', textAlign: 'right' }}>Preço Base</th>
                    <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, width: '110px', textAlign: 'right' }}>Total</th>
                    <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, width: '80px', textAlign: 'center' }}>Mín Qtd</th>
                    <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, width: '80px', textAlign: 'center' }}>Máx Qtd</th>
                    <th className="tab-pacotes-actions-th" style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedGroup.options.length === 0 && (
                    <EmptyTableRow colSpan={10} message="Nenhuma opção inserida para esta etapa. Adicione opções acima." />
                  )}
                  {selectedGroup.options.map((opt: any, optIdx: number) => {
                    const matchedId = opt.id || opt.uiId || opt.name || '';
                    const isSelected = selectedOptionId === matchedId;

                    let parentLabel = 'Sem Associação';
                    if (opt.parentOptionId) {
                      const po = parentOptions.find(p => p.id === opt.parentOptionId);
                      if (po) parentLabel = `${po.groupName} → ${po.name}`;
                    }

                    return (
                      <tr
                        key={optIdx}
                        onClick={() => handleSelectOption(matchedId)}
                        onDoubleClick={() => handleStartEditOption(opt)}
                        style={{
                          cursor: 'pointer',
                          background: isSelected ? 'rgba(249, 115, 22, 0.08)' : 'transparent',
                          borderBottom: '1px solid var(--border-subtle)',
                          borderLeft: isSelected ? '3px solid #f97316' : '3px solid transparent',
                          transition: 'all var(--transition-fast)',
                          fontWeight: isSelected ? '600' : 'normal',
                          color: isSelected ? '#f97316' : 'var(--text-primary)'
                        }}
                        className={`package-row-hover ${isSelected ? 'selected' : ''}`}
                      >
                        <td style={{ padding: '0.5rem 0.75rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span>{opt.name}</span>
                            {opt.productId && (
                              <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600 }}>
                                ↳ Vinculado ao produto
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '0.5rem 0.75rem' }}>{opt.abbreviation || '-'}</td>
                        <td style={{ padding: '0.5rem 0.75rem' }}>{parentLabel}</td>
                        <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>
                          {opt.isPreSelected ? (
                            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Sim</span>
                          ) : 'Não'}
                        </td>
                        <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>
                          {opt.isVisible !== false ? (
                            <span style={{ color: '#10b981', fontWeight: 600 }}>Sim</span>
                          ) : (
                            <span style={{ color: '#ef4444', fontWeight: 600 }}>Não</span>
                          )}
                        </td>
                        <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right' }}>
                          R$ {opt.basePrice || '0,00'}
                        </td>
                        <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontWeight: 600 }}>
                          R$ {opt.totalPrice || opt.additionalPrice || '0,00'}
                        </td>
                        <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>{opt.minQuantity || 0}</td>
                        <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>{opt.maxQuantity}</td>
                        <td className="tab-pacotes-actions-td" onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center', alignItems: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleStartEditOption(opt)}
                              className="action-btn edit-btn"
                              title="Editar Opção"
                              style={{ width: '24px', height: '24px', padding: 0 }}
                            >
                              <Pencil size={10} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteOption(opt)}
                              className="action-btn delete-btn"
                              title="Excluir Opção"
                              style={{ width: '24px', height: '24px', padding: 0 }}
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
