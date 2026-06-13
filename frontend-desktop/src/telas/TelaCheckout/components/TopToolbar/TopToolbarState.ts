export interface ToolbarItem {
  id: string;
  icon3d: string;
  mdiId: string;
  emoji: string;
  title: string;
}

export const toolbarGroup1: ToolbarItem[] = [
  { id: 'Mesas', icon3d: '/icons/3d/mesas.png', mdiId: 'mesas', emoji: '🍽️', title: 'Mesas (F3)' },
  { id: 'Comandas', icon3d: '/icons/3d/comandas.png', mdiId: 'comandas', emoji: '📋', title: 'Comandas (F11)' },
  { id: 'Balcão', icon3d: '/icons/3d/balcao.png', mdiId: 'balcao', emoji: '🥤', title: 'Venda para Balcão (F4)' },
  { id: 'PDV', icon3d: '/icons/3d/pdv.png', mdiId: 'pdv', emoji: '💻', title: 'PDV' }
];

export const toolbarGroup2: ToolbarItem[] = [
  { id: 'Contas', icon3d: '/icons/3d/contas.png', mdiId: 'contas', emoji: '🧾', title: 'Contas a Pagar/Receber' },
  { id: 'Contas+', icon3d: '/icons/3d/contasm.png', mdiId: 'contasm', emoji: '🖥️', title: 'Abertura/Fechamento de Caixa' }
];

export const toolbarGroup3: ToolbarItem[] = [
  { id: 'Produtos', icon3d: '/icons/3d/produtos.png', mdiId: 'produtos', emoji: '🍔', title: 'Cadastro de Produtos' },
  { id: 'Estoque', icon3d: '/icons/3d/estoque.png', mdiId: 'estoque', emoji: '📦', title: 'Controle de Estoque' },
  { id: 'Delivery', icon3d: '/icons/3d/delivery.png', mdiId: 'delivery', emoji: '🛵', title: 'Painel de Delivery (F8)' }
];

export function useTopToolbar() {
  return {};
}
