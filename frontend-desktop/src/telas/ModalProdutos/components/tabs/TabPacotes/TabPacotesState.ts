import { useState } from 'react';
import type { ModifierGroup, ModifierOption } from '../../../../../types/product.types';
import { generateGuid } from '../../../../../utils/formatters';

interface UseModifierGroupsProps {
  modifierGroups: ModifierGroup[];
  setModifierGroups: (groups: ModifierGroup[] | ((prev: ModifierGroup[]) => ModifierGroup[])) => void;
  productsList: any[];
  setError: (msg: string) => void;
}

export function useModifierGroups({
  modifierGroups,
  setModifierGroups,
  productsList,
  setError
}: UseModifierGroupsProps) {
  // Estados para CRUD de Etapas de Pacotes
  const [selectedGroupUiId, setSelectedGroupUiId] = useState<string | null>(null);
  const [isEditingGroup, setIsEditingGroup] = useState<boolean>(false);
  const [groupName, setGroupName] = useState<string>('');
  const [groupCanBeFractioned, setGroupCanBeFractioned] = useState<boolean>(false);
  const [groupPriceRule, setGroupPriceRule] = useState<number>(1); // Padrão Máximo (1)
  const [groupMinSelections, setGroupMinSelections] = useState<number>(1);
  const [groupMaxSelections, setGroupMaxSelections] = useState<number>(1);

  // Estados para CRUD de Opções (Itens da Etapa)
  const [customProperties, setCustomProperties] = useState<Array<{ id: string; name: string; abbreviation: string }>>([]);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState<boolean>(false);
  const [propNameInput, setPropNameInput] = useState<string>('');
  const [propAbbrevInput, setPropAbbrevInput] = useState<string>('');
  const [selectedPropId, setSelectedPropId] = useState<string | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isEditingOption, setIsEditingOption] = useState<boolean>(false);
  const [optType, setOptType] = useState<'prod' | 'prop'>('prop');
  const [optProductId, setOptProductId] = useState<string>('');
  const [optProductNameInput, setOptProductNameInput] = useState<string>(''); // Texto digitado na busca
  const [optPropName, setOptPropName] = useState<string>('');
  const [optBasePrice, setOptBasePrice] = useState<string>('0,00');
  const [optTotalPrice, setOptTotalPrice] = useState<string>('0,00');
  const [optMinQuantity, setOptMinQuantity] = useState<number>(0);
  const [optMaxQuantity, setOptMaxQuantity] = useState<number>(1);
  const [optParentOptionId, setOptParentOptionId] = useState<string>('');
  const [optAbbreviation, setOptAbbreviation] = useState<string>('');
  const [optIsPreSelected, setOptIsPreSelected] = useState<boolean>(false);
  const [optIsVisible, setOptIsVisible] = useState<boolean>(true);
  const [showProductSuggestions, setShowProductSuggestions] = useState<boolean>(false);

  const handleSelectOption = (optId: string) => {
    if (isEditingOption) return;
    setSelectedOptionId(optId);
  };

  const handleStartEditOption = (opt: any) => {
    const matchedId = opt.id || opt.uiId || opt.name;
    setSelectedOptionId(matchedId);
    setOptType(opt.productId ? 'prod' : 'prop');
    setOptProductId(opt.productId || '');
    if (opt.productId) {
      const matched = productsList.find(p => p.id === opt.productId);
      setOptProductNameInput(matched ? matched.name : opt.name);
    } else {
      setOptProductNameInput('');
    }
    setOptPropName(opt.productId ? '' : opt.name);
    setOptBasePrice(opt.basePrice || '0,00');
    setOptTotalPrice(opt.totalPrice || opt.additionalPrice || '0,00');
    setOptMinQuantity(opt.minQuantity || 0);
    setOptMaxQuantity(opt.maxQuantity || 1);
    setOptParentOptionId(opt.parentOptionId || '');
    setOptAbbreviation(opt.abbreviation || '');
    setOptIsPreSelected(opt.isPreSelected || false);
    setOptIsVisible(opt.isVisible !== false);
    setIsEditingOption(true);
  };

  const handleCancelEditOption = () => {
    setIsEditingOption(false);
    setSelectedOptionId(null);
    setOptProductId('');
    setOptProductNameInput('');
    setOptPropName('');
    setOptBasePrice('0,00');
    setOptTotalPrice('0,00');
    setOptMinQuantity(0);
    setOptMaxQuantity(1);
    setOptParentOptionId('');
    setOptAbbreviation('');
    setOptIsPreSelected(false);
    setOptIsVisible(true);
  };

  const handleAddOption = () => {
    if (!selectedGroupUiId) return;
    
    let optName = '';
    if (optType === 'prop') {
      optName = optPropName;
      if (!optName) {
        setError("Por favor, selecione uma propriedade.");
        return;
      }
    } else {
      if (!optProductId) {
        setError("Por favor, selecione um produto de estoque.");
        return;
      }
      const matched = productsList.find(p => p.id === optProductId);
      optName = matched ? matched.name : '';
    }

    const selectedGroup = modifierGroups.find(g => (g.uiId || g.id) === selectedGroupUiId);
    if (!selectedGroup) return;

    // Regra: propriedade não mistura com produto
    if (selectedGroup.options.length > 0) {
      const hasProducts = selectedGroup.options.some((o: any) => !!o.productId);
      if (optType === 'prod' && !hasProducts) {
        setError("Esta etapa está configurada para Propriedades. Remova os itens existentes ou crie outra etapa.");
        return;
      }
      if (optType === 'prop' && hasProducts) {
        setError("Esta etapa está configurada para Produtos. Remova os itens existentes ou crie outra etapa.");
        return;
      }
    }

    const newOption: ModifierOption = {
      uiId: generateGuid(),
      id: generateGuid(),
      name: optName,
      additionalPrice: optTotalPrice,
      basePrice: optBasePrice,
      totalPrice: optTotalPrice,
      minQuantity: optMinQuantity,
      maxQuantity: optMaxQuantity,
      productId: optType === 'prod' ? optProductId : '',
      isPreSelected: optIsPreSelected,
      isVisible: optIsVisible,
      abbreviation: optAbbreviation,
      parentOptionId: optParentOptionId
    };

    setModifierGroups((prev: ModifierGroup[]) => {
      return prev.map(g => {
        if ((g.uiId || g.id) === selectedGroupUiId) {
          return {
            ...g,
            options: [...g.options, newOption]
          };
        }
        return g;
      });
    });

    handleCancelEditOption();
  };

  const handleSaveOption = () => {
    if (!selectedGroupUiId || !selectedOptionId) return;

    let optName = '';
    if (optType === 'prop') {
      optName = optPropName;
      if (!optName) {
        setError("Por favor, selecione uma propriedade.");
        return;
      }
    } else {
      if (!optProductId) {
        setError("Por favor, selecione um produto de estoque.");
        return;
      }
      const matched = productsList.find(p => p.id === optProductId);
      optName = matched ? matched.name : '';
    }

    setModifierGroups((prev: ModifierGroup[]) => {
      return prev.map(g => {
        if ((g.uiId || g.id) === selectedGroupUiId) {
          const updatedOptions = g.options.map((o: any) => {
            const idToCompare = o.id || o.uiId || o.name;
            if (idToCompare === selectedOptionId) {
              return {
                ...o,
                name: optName,
                additionalPrice: optTotalPrice,
                basePrice: optBasePrice,
                totalPrice: optTotalPrice,
                minQuantity: optMinQuantity,
                maxQuantity: optMaxQuantity,
                productId: optType === 'prod' ? optProductId : '',
                isPreSelected: optIsPreSelected,
                isVisible: optIsVisible,
                abbreviation: optAbbreviation,
                parentOptionId: optParentOptionId
              };
            }
            return o;
          });
          return { ...g, options: updatedOptions };
        }
        return g;
      });
    });

    handleCancelEditOption();
  };

  const handleDeleteOption = (opt?: any) => {
    const targetOptionId = opt ? (opt.id || opt.uiId || opt.name) : selectedOptionId;
    if (!selectedGroupUiId || !targetOptionId) return;
    const targetOpt = opt || (modifierGroups.find(g => (g.uiId || g.id) === selectedGroupUiId)?.options.find((o: any) => (o.id || o.uiId || o.name) === targetOptionId));
    const targetName = targetOpt ? targetOpt.name : 'esta opção';
    if (!window.confirm(`Tem certeza que deseja excluir a opção "${targetName}"?`)) return;

    setModifierGroups((prev: ModifierGroup[]) => {
      return prev.map(g => {
        if ((g.uiId || g.id) === selectedGroupUiId) {
          const filteredOptions = g.options.filter((o: any) => {
            const idToCompare = o.id || o.uiId || o.name;
            return idToCompare !== targetOptionId;
          });
          return { ...g, options: filteredOptions };
        }
        return g;
      });
    });

    if (selectedOptionId === targetOptionId) {
      handleCancelEditOption();
    }
  };

  const handleSelectGroup = (uiId: string) => {
    if (isEditingGroup) return;
    setSelectedGroupUiId(uiId);
  };

  const handleStartEditGroup = (group: any) => {
    setGroupName(group.name);
    setGroupCanBeFractioned(group.canBeFractioned);
    setGroupPriceRule(group.priceRule);
    setGroupMinSelections(group.minSelections);
    setGroupMaxSelections(group.maxSelections);
    setIsEditingGroup(true);
    setSelectedGroupUiId(group.uiId || group.id);
  };

  const handleCancelEditGroup = () => {
    setIsEditingGroup(false);
    setSelectedGroupUiId(null);
    setGroupName('');
    setGroupCanBeFractioned(false);
    setGroupPriceRule(1);
    setGroupMinSelections(1);
    setGroupMaxSelections(1);
  };

  const handleAddGroup = () => {
    if (!groupName.trim()) {
      setError("A descrição da etapa é obrigatória.");
      return;
    }
    const newGroup: ModifierGroup = {
      uiId: generateGuid(),
      name: groupName,
      minSelections: groupMinSelections,
      maxSelections: groupMaxSelections,
      priceRule: groupPriceRule,
      isPropType: true,
      canBeFractioned: groupCanBeFractioned,
      options: []
    };
    setModifierGroups((prev: ModifierGroup[]) => [...prev, newGroup]);
    setGroupName('');
    setGroupCanBeFractioned(false);
    setGroupPriceRule(1);
    setGroupMinSelections(1);
    setGroupMaxSelections(1);
  };

  const handleSaveGroup = () => {
    if (!groupName.trim()) {
      setError("A descrição da etapa é obrigatória.");
      return;
    }
    setModifierGroups((prev: ModifierGroup[]) => {
      return prev.map(g => {
        const idToCompare = g.uiId || g.id;
        if (idToCompare === selectedGroupUiId) {
          return {
            ...g,
            name: groupName,
            minSelections: groupMinSelections,
            maxSelections: groupMaxSelections,
            priceRule: groupPriceRule,
            canBeFractioned: groupCanBeFractioned
          };
        }
        return g;
      });
    });
    handleCancelEditGroup();
  };

  const handleDeleteGroup = (group?: any) => {
    const targetGroupUiId = group ? (group.uiId || group.id) : selectedGroupUiId;
    if (!targetGroupUiId) return;
    const targetGroup = group || modifierGroups.find(g => (g.uiId || g.id) === targetGroupUiId);
    const targetName = targetGroup ? targetGroup.name : 'esta etapa';
    if (!window.confirm(`Tem certeza que deseja excluir a etapa "${targetName}" e todas as suas opções?`)) return;
    setModifierGroups((prev: ModifierGroup[]) => {
      return prev.filter(g => (g.uiId || g.id) !== targetGroupUiId);
    });
    if (selectedGroupUiId === targetGroupUiId) {
      handleCancelEditGroup();
    }
  };

  return {
    state: {
      selectedGroupUiId, setSelectedGroupUiId,
      isEditingGroup, setIsEditingGroup,
      groupName, setGroupName,
      groupCanBeFractioned, setGroupCanBeFractioned,
      groupPriceRule, setGroupPriceRule,
      groupMinSelections, setGroupMinSelections,
      groupMaxSelections, setGroupMaxSelections,
      customProperties, setCustomProperties,
      isPropertyModalOpen, setIsPropertyModalOpen,
      propNameInput, setPropNameInput,
      propAbbrevInput, setPropAbbrevInput,
      selectedPropId, setSelectedPropId,
      selectedOptionId, setSelectedOptionId,
      isEditingOption, setIsEditingOption,
      optType, setOptType,
      optProductId, setOptProductId,
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
    },
    actions: {
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
    }
  };
}
