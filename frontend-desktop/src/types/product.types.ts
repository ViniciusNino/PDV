export interface ProductPrice {
  channel: number;
  price: string;
  isVisible: boolean;
}

export interface Ingredient {
  ingredientProductId: string;
  quantity: string;
  type: number;
  additionalPrice: string;
  isActive: boolean;
  name: string;
}

export interface ComboItem {
  childProductId: string;
  quantity: string;
  fixedPrice: string;
  name: string;
}

export interface ModifierOption {
  id?: string;
  uiId?: string;
  name: string;
  additionalPrice: string;
  basePrice: string;
  totalPrice: string;
  minQuantity: number;
  maxQuantity: number;
  productId: string;
  isPreSelected: boolean;
  isVisible: boolean;
  abbreviation: string;
  parentOptionId: string;
}

export interface ModifierGroup {
  uiId: string;
  id?: string;
  name: string;
  minSelections: number;
  maxSelections: number;
  priceRule: number;
  isPropType: boolean;
  canBeFractioned: boolean;
  options: ModifierOption[];
}

export interface Promotion {
  id?: string;
  uiId?: string;
  dayStart: string;
  hourStart: number;
  dayEnd: string;
  hourEnd: number;
  price: string;
  isSaleForbidden: boolean;
}

export interface ProductFormData {
  name: string;
  categoryId: string;
  description: string;
  type: number;
  basePrice: string;
  costPrice: string;
  unit: string;
  isFractionable: boolean;
  barcode: string;
  code: string;
  abbreviation: string;
  isActive: boolean;
  isVisible: boolean;
  imageBase64: string;
  printTarget: string;
  prices: ProductPrice[];
  ingredients: Ingredient[];
  comboItems: ComboItem[];
  modifierGroups: ModifierGroup[];
  preparationTime: number;
  controlStock: boolean;
  stockSectorId: string;
  minStock: number;
  maxStock: number;
  stockContent: number;
  isDivisible: boolean;
  isPerishable: boolean;
  isAutoWeight: boolean;
  promotions: Promotion[];
}
