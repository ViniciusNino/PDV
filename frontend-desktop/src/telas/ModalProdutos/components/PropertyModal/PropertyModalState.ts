import { useState } from 'react';


export function usePropertyModal(initialProperties: any[] = []) {
  const [propNameInput, setPropNameInput] = useState('');
  const [propAbbrevInput, setPropAbbrevInput] = useState('');
  const [selectedPropId, setSelectedPropId] = useState<number | string | null>(null);
  
  // mock/state
  const [customProperties, setCustomProperties] = useState<any[]>(initialProperties.length > 0 ? initialProperties : [
    { id: 1, name: 'Pequeno', abbreviation: 'P' },
    { id: 2, name: 'Médio', abbreviation: 'M' },
    { id: 3, name: 'Grande', abbreviation: 'G' },
    { id: 4, name: 'Calabresa', abbreviation: 'CAL' },
    { id: 5, name: 'Frango com Catupiry', abbreviation: 'FRG' },
    { id: 6, name: 'Coca-Cola 2L', abbreviation: 'COC2L' },
  ]);

  const generateLocalGuid = () => {
    return 'xxxx-xxxx-4xxx-yxxx-xxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const handleAddProperty = () => {
    const nameTrimmed = propNameInput.trim();
    if (!nameTrimmed) return;
    if (customProperties.some((p: any) => p.name.toLowerCase() === nameTrimmed.toLowerCase())) {
      alert("Esta propriedade já está cadastrada.");
      return;
    }
    const newProp = {
      id: generateLocalGuid(),
      name: nameTrimmed,
      abbreviation: propAbbrevInput.trim()
    };
    setCustomProperties((prev: any) => [...prev, newProp]);
    setPropNameInput('');
    setPropAbbrevInput('');
  };

  const handleSaveProperty = () => {
    if (!selectedPropId) return;
    const nameTrimmed = propNameInput.trim();
    if (!nameTrimmed) return;
    setCustomProperties((prev: any) =>
      prev.map((p: any) =>
        p.id === selectedPropId
          ? { ...p, name: nameTrimmed, abbreviation: propAbbrevInput.trim() }
          : p
      )
    );
    setSelectedPropId(null);
    setPropNameInput('');
    setPropAbbrevInput('');
  };

  const handleDeleteProperty = (onDeleteCallback?: (deletedName: string) => void) => {
    if (!selectedPropId) return;
    const prop = customProperties.find((p: any) => p.id === selectedPropId);
    if (prop && window.confirm(`Deseja realmente excluir a propriedade "${prop.name}"?`)) {
      setCustomProperties((prev: any) => prev.filter((p: any) => p.id !== selectedPropId));
      if (onDeleteCallback) {
        onDeleteCallback(prop.name);
      }
      setSelectedPropId(null);
      setPropNameInput('');
      setPropAbbrevInput('');
    }
  };

  const handleSelectProperty = (prop: any) => {
    setSelectedPropId(prop.id);
    setPropNameInput(prop.name);
    setPropAbbrevInput(prop.abbreviation || '');
  };

  return {
    propNameInput,
    setPropNameInput,
    propAbbrevInput,
    setPropAbbrevInput,
    selectedPropId,
    setSelectedPropId,
    customProperties,
    setCustomProperties,
    handleAddProperty,
    handleSaveProperty,
    handleDeleteProperty,
    handleSelectProperty
  };
}
