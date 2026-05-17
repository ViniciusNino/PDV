import React from 'react';
import { 
  ShoppingCart, LayoutGrid, ClipboardList, MonitorPlay, Receipt, UtensilsCrossed, 
  PackageSearch, PackageOpen, Truck, MessageCircle, Cloud, Printer, User, Laptop,
  Key, X, History, Save, Power, Server, Settings as SettingsIcon, Eraser, List,
  Monitor, PenTool, Globe, BarChart, ListOrdered, Package, Users, Calendar, 
  Activity, DollarSign, Scale, TrendingUp, FileText, Info, CreditCard, MapPin, Wallet,
  Folder, Map, Briefcase, Building, Coins, Building2, HelpCircle, MonitorSpeaker, RefreshCw,
  ChevronRight, ArrowRightLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './TelaCheckout.css';

const menusData: Record<string, { label: string; shortcut?: string; icon: any; hasSub?: boolean }[]> = {
  Arquivo: [
    { label: 'Login...', shortcut: 'Ctrl+L', icon: Key },
    { label: 'Fechar', shortcut: 'Ctrl+W', icon: X },
    { label: 'Restaurar...', icon: History },
    { label: 'Cópia de segurança...', icon: Save },
    { label: 'Sair', icon: Power }
  ],
  Financeiro: [
    { label: 'Selecionar caixa...', icon: Monitor },
    { label: 'Abrir caixa...', shortcut: 'Ctrl+Home', icon: Save },
    { label: 'Fechar caixa...', shortcut: 'Ctrl+End', icon: X },
    { label: 'Inserir dinheiro...', icon: Coins },
    { label: 'Registrar despesa...', shortcut: 'Ctrl+Ins', icon: Receipt },
    { label: 'Realizar sangria...', icon: DollarSign },
    { label: 'Realizar repasse...', icon: ArrowRightLeft },
    { label: 'Receitas e despesas', icon: FileText }
  ],
  Visualizar: [
    { label: 'Tela cheia', icon: Monitor },
    { label: 'Barra de ferramentas', icon: null, hasSub: true },
    { label: 'Ícones modernos', icon: null },
    { label: 'Linguagem', icon: Globe, hasSub: true },
    { label: 'Gerenciamento local', icon: SettingsIcon },
    { label: 'Site Delivery', icon: Truck }
  ],
  Vendas: [
    { label: 'Mesas', shortcut: 'F3', icon: LayoutGrid },
    { label: 'Comandas', shortcut: 'F11', icon: ClipboardList },
    { label: 'Balcão', shortcut: 'F4', icon: MonitorPlay },
    { label: 'Entrega', shortcut: 'F8', icon: Truck },
    { label: 'Venda rápida...', shortcut: 'F12', icon: ShoppingCart },
    { label: 'Fila de pedidos', shortcut: 'Ctrl+O', icon: List }
  ],
  Relatórios: [
    { label: 'Relatório de vendas', icon: BarChart },
    { label: 'Relatório de pedidos', icon: ListOrdered },
    { label: 'Vendas por produto', icon: Package },
    { label: 'Vendas por vendedor', icon: User },
    { label: 'Vendas por cliente', icon: Users },
    { label: 'Vendas por período', icon: Calendar },
    { label: 'Movimentação do caixa', icon: Activity },
    { label: 'Pagamento de contas', icon: DollarSign },
    { label: 'Balanço de contas', icon: Scale },
    { label: 'Fluxo de caixa', icon: TrendingUp },
    { label: 'Relatório de cheques', icon: FileText },
    { label: 'Entregas por entregador', icon: Truck },
    { label: 'Movimentação de estoque', icon: PackageOpen },
    { label: 'Relatório de produtos', icon: Info },
    { label: 'Relatório de funcionários', icon: Users },
    { label: 'Relatório de clientes', icon: Users },
    { label: 'Créditos de clientes', icon: CreditCard },
    { label: 'Relatório de bairros', icon: MapPin },
    { label: 'Relatório de carteiras', icon: Wallet }
  ],
  Cadastro: [
    { label: 'Produtos', icon: Package },
    { label: 'Estoque...', icon: PackageOpen },
    { label: 'Categorias', icon: Folder },
    { label: 'Fornecedores', icon: Truck },
    { label: 'Clientes', icon: Users },
    { label: 'Mesas', icon: LayoutGrid },
    { label: 'Comandas', icon: ClipboardList },
    { label: 'Países', icon: Globe },
    { label: 'Estados', icon: Map },
    { label: 'Cidades', icon: MapPin },
    { label: 'Bairros', icon: MapPin },
    { label: 'Funcionários', icon: Users },
    { label: 'Funções', icon: Briefcase },
    { label: 'Contas', icon: Receipt },
    { label: 'Serviços', icon: PenTool },
    { label: 'Créditos', icon: CreditCard },
    { label: 'Formas de pagamento', icon: DollarSign },
    { label: 'Cartões', icon: CreditCard },
    { label: 'Bancos', icon: Building },
    { label: 'Carteiras', icon: Wallet },
    { label: 'Moedas', icon: Coins },
    { label: 'Caixas', icon: Monitor },
    { label: 'Patrimônio', icon: Building2 }
  ],
  Configurações: [
    { label: 'Impressoras...', icon: Printer },
    { label: 'Computadores e Tablets', icon: Laptop },
    { label: 'Meu IP...', icon: Globe },
    { label: 'Conectar ao servidor...', icon: Server },
    { label: 'Empresa e Sistema...', icon: SettingsIcon },
    { label: 'Limpar vendas...', icon: Eraser },
    { label: 'Auditoria', icon: List }
  ],
  Ajuda: [
    { label: 'NinoPDV', shortcut: 'F1', icon: HelpCircle },
    { label: 'Registro...', icon: Key },
    { label: 'Suporte remoto', icon: MonitorSpeaker },
    { label: 'Atualizar', icon: RefreshCw },
    { label: 'Sobre...', icon: Info }
  ]
};

export function TelaCheckout() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  const [activeToolbarItem, setActiveToolbarItem] = React.useState<string>('PDV');

  const toggleMenu = (menuName: string) => {
    setActiveMenu(prev => prev === menuName ? null : menuName);
  };

  const handleClickOutside = () => {
    if (activeMenu) setActiveMenu(null);
  };
  
  React.useEffect(() => {
    // Ao entrar no checkout, maximiza a janela
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('maximize-window');
    }
  }, []);

  return (
    <div className="checkout-container animate-fade-in" onClick={handleClickOutside}>
      
      {/* Menu Bar (Referência Tela 4) */}
      <nav className="menu-bar">
        {Object.keys(menusData).map(menuName => (
          <div 
            key={menuName}
            className={`menu-item ${activeMenu === menuName ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu(menuName);
            }}
            onMouseEnter={() => {
              if (activeMenu && activeMenu !== menuName) {
                setActiveMenu(menuName);
              }
            }}
            style={{ position: 'relative' }}
          >
            {menuName}
            {activeMenu === menuName && (
              <div className="dropdown-menu">
                {menusData[menuName].map((item, idx) => (
                  <button key={idx} className="dropdown-item">
                    <span className="icon">
                      {item.icon && React.createElement(item.icon, { size: 14 })}
                    </span>
                    <span className="dropdown-label">{item.label}</span>
                    {item.shortcut && <span className="dropdown-shortcut">{item.shortcut}</span>}
                    {item.hasSub && <ChevronRight size={14} className="dropdown-submenu-arrow" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Top Toolbar (Referência Tela 4) */}
      <header className="checkout-topbar">
        <div className="toolbar-menu">
          {[
            { id: 'Mesas', icon: LayoutGrid },
            { id: 'Comandas', icon: ClipboardList },
            { id: 'Balcão', icon: MonitorPlay },
            { id: 'PDV', icon: ShoppingCart }
          ].map(item => (
            <button 
              key={item.id}
              className={`toolbar-btn ${activeToolbarItem === item.id ? 'active' : ''}`}
              onClick={() => setActiveToolbarItem(item.id)}
            >
              <item.icon size={24} />
              <span>{item.id}</span>
            </button>
          ))}
          <div className="toolbar-divider"></div>
          {[
            { id: 'Contas', icon: Receipt },
            { id: 'Contas+', icon: UtensilsCrossed }
          ].map(item => (
            <button 
              key={item.id}
              className={`toolbar-btn ${activeToolbarItem === item.id ? 'active' : ''}`}
              onClick={() => setActiveToolbarItem(item.id)}
            >
              <item.icon size={24} />
              <span>{item.id}</span>
            </button>
          ))}
          <div className="toolbar-divider"></div>
          {[
            { id: 'Produtos', icon: PackageSearch },
            { id: 'Estoque', icon: PackageOpen },
            { id: 'Delivery', icon: Truck }
          ].map(item => (
            <button 
              key={item.id}
              className={`toolbar-btn ${activeToolbarItem === item.id ? 'active' : ''}`}
              onClick={() => setActiveToolbarItem(item.id)}
            >
              <item.icon size={24} />
              <span>{item.id}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Main Empty Workspace (Referência Tela 4) */}
      <div className="checkout-content empty-workspace">
        
        {/* Botão de Suporte Flutuante no canto inferior esquerdo */}
        <button className="support-button">
          <MessageCircle size={20} />
          Suporte
        </button>

      </div>

      {/* Bottom Status Bar */}
      <footer className="status-bar">
        <div className="status-items">
          <div className="status-item status-green"></div>
          <div className="status-item"><Cloud size={14} /></div>
          <div className="status-item"><Printer size={14} /></div>
          <div className="status-item"><User size={14} /> Admin</div>
          <div className="status-item"><Laptop size={14} /> Caixa 1</div>
        </div>
      </footer>

    </div>
  );
}
