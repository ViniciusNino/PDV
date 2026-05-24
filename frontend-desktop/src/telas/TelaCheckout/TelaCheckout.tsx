import React from 'react';
import { useNavigate } from 'react-router-dom';

import { 
  MessageCircle, Cloud, Printer, User, Laptop, ChevronRight
} from 'lucide-react';
import './TelaCheckout.css';
import { ModalCategorias } from '../ModalCategorias/ModalCategorias';
import { ModalProdutos } from '../ModalProdutos/ModalProdutos';
import { TelaConfiguracao } from '../TelaConfiguracao/TelaConfiguracao';

const menusData: Record<string, { label: string; shortcut?: string; icon: string | null; hasSub?: boolean }[]> = {
  Arquivo: [
    { label: 'Login...', shortcut: 'Ctrl+L', icon: '🔑' },
    { label: 'Fechar', shortcut: 'Ctrl+W', icon: '❌' },
    { label: 'Restaurar...', icon: '🔄' },
    { label: 'Cópia de segurança...', icon: '💾' },
    { label: 'Sair', icon: '🚪' }
  ],
  Financeiro: [
    { label: 'Selecionar caixa...', icon: '🖥️' },
    { label: 'Abrir caixa...', shortcut: 'Ctrl+Home', icon: '🔓' },
    { label: 'Fechar caixa...', shortcut: 'Ctrl+End', icon: '🔒' },
    { label: 'Inserir dinheiro...', icon: '🪙' },
    { label: 'Registrar despesa...', shortcut: 'Ctrl+Ins', icon: '💸' },
    { label: 'Realizar sangria...', icon: '💰' },
    { label: 'Realizar repasse...', icon: '🔃' },
    { label: 'Receitas e despesas', icon: '📊' }
  ],
  Visualizar: [
    { label: 'Tela cheia', icon: '📺' },
    { label: 'Barra de ferramentas', icon: '🛠️', hasSub: true },
    { label: 'Ícones modernos', icon: '✨' },
    { label: 'Linguagem', icon: '🌐', hasSub: true },
    { label: 'Gerenciamento local', icon: '⚙️' },
    { label: 'Site Delivery', icon: '🛵' }
  ],
  Vendas: [
    { label: 'Mesas', shortcut: 'F3', icon: '🍽️' },
    { label: 'Comandas', shortcut: 'F11', icon: '📋' },
    { label: 'Balcão', shortcut: 'F4', icon: '🥤' },
    { label: 'Entrega', shortcut: 'F8', icon: '🛵' },
    { label: 'Venda rápida...', shortcut: 'F12', icon: '🛒' },
    { label: 'Fila de pedidos', shortcut: 'Ctrl+O', icon: '⏳' }
  ],
  Relatórios: [
    { label: 'Relatório de vendas', icon: '📈' },
    { label: 'Relatório de pedidos', icon: '📋' },
    { label: 'Vendas por produto', icon: '📦' },
    { label: 'Vendas por vendedor', icon: '👤' },
    { label: 'Vendas por cliente', icon: '👥' },
    { label: 'Vendas por período', icon: '📅' },
    { label: 'Movimentação do caixa', icon: '📊' },
    { label: 'Pagamento de contas', icon: '💳' },
    { label: 'Balanço de contas', icon: '⚖️' },
    { label: 'Fluxo de caixa', icon: '💸' },
    { label: 'Relatório de cheques', icon: '📝' },
    { label: 'Entregas por entregador', icon: '🛵' },
    { label: 'Movimentação de estoque', icon: '📦' },
    { label: 'Relatório de produtos', icon: 'ℹ️' },
    { label: 'Relatório de funcionários', icon: '👥' },
    { label: 'Relatório de clientes', icon: '👥' },
    { label: 'Créditos de clientes', icon: '💳' },
    { label: 'Relatório de bairros', icon: '📍' },
    { label: 'Relatório de carteiras', icon: '👛' }
  ],
  Cadastro: [
    { label: 'Produtos', icon: '🍔' },
    { label: 'Estoque...', icon: '📦' },
    { label: 'Categorias', icon: '📁' },
    { label: 'Fornecedores', icon: '🚚' },
    { label: 'Clientes', icon: '👥' },
    { label: 'Mesas', icon: '🍽️' },
    { label: 'Comandas', icon: '📋' },
    { label: 'Países', icon: '🌐' },
    { label: 'Estados', icon: '🗺️' },
    { label: 'Cidades', icon: '🏙️' },
    { label: 'Bairros', icon: '📍' },
    { label: 'Funcionários', icon: '👥' },
    { label: 'Funções', icon: '💼' },
    { label: 'Contas', icon: '🧾' },
    { label: 'Serviços', icon: '🛠️' },
    { label: 'Créditos', icon: '💳' },
    { label: 'Formas de pagamento', icon: '💵' },
    { label: 'Cartões', icon: '💳' },
    { label: 'Bancos', icon: '🏦' },
    { label: 'Carteiras', icon: '👛' },
    { label: 'Moedas', icon: '🪙' },
    { label: 'Caixas', icon: '🖥️' },
    { label: 'Patrimônio', icon: '🏢' }
  ],
  Configurações: [
    { label: 'Impressoras...', icon: '🖨️' },
    { label: 'Computadores e Tablets', icon: '💻' },
    { label: 'Meu IP...', icon: '🌐' },
    { label: 'Conectar ao servidor...', icon: '🔌' },
    { label: 'Empresa e Sistema...', icon: '⚙️' },
    { label: 'Limpar vendas...', icon: '🧹' },
    { label: 'Auditoria', icon: '🔎' }
  ],
  Ajuda: [
    { label: 'NinoPDV', shortcut: 'F1', icon: '❓' },
    { label: 'Registro...', icon: '🔑' },
    { label: 'Suporte remoto', icon: '🎧' },
    { label: 'Atualizar', icon: '🔄' },
    { label: 'Sobre...', icon: 'ℹ️' }
  ]
};

export function TelaCheckout() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  const [activeToolbarItem, setActiveToolbarItem] = React.useState<string>('PDV');
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = React.useState(false);
  const [isProductsModalOpen, setIsProductsModalOpen] = React.useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState(false);

  const toggleMenu = (menuName: string) => {
    setActiveMenu(prev => prev === menuName ? null : menuName);
  };

  const handleClickOutside = () => {
    if (activeMenu) setActiveMenu(null);
  };

  const handleDropdownItemClick = (menuName: string, label: string) => {
    setActiveMenu(null);
    if (menuName === 'Cadastro' && label === 'Categorias') {
      setIsCategoriesModalOpen(true);
    }
    if (menuName === 'Cadastro' && label === 'Produtos') {
      setIsProductsModalOpen(true);
    }
    if (menuName === 'Configurações' && label === 'Empresa e Sistema...') {
      navigate('/setup');
    }
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
                  <button 
                    key={idx} 
                    className="dropdown-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDropdownItemClick(menuName, item.label);
                    }}
                  >
                    <span className="icon-emoji">
                      {item.icon || ''}
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
            { id: 'Mesas', icon3d: '/icons/3d/mesas.png' },
            { id: 'Comandas', icon3d: '/icons/3d/comandas.png' },
            { id: 'Balcão', icon3d: '/icons/3d/balcao.png' },
            { id: 'PDV', icon3d: '/icons/3d/pdv.png' }
          ].map(item => (
            <button 
              key={item.id}
              className={`toolbar-btn ${activeToolbarItem === item.id ? 'active' : ''}`}
              onClick={() => setActiveToolbarItem(item.id)}
            >
              <div className="toolbar-icon-wrapper">
                <img src={item.icon3d} alt={item.id} className="toolbar-icon-3d" />
              </div>
              <span>{item.id}</span>
            </button>
          ))}
          <div className="toolbar-divider"></div>
          {[
            { id: 'Contas', icon3d: '/icons/3d/contas.png' },
            { id: 'Contas+', icon3d: '/icons/3d/contasm.png' }
          ].map(item => (
            <button 
              key={item.id}
              className={`toolbar-btn ${activeToolbarItem === item.id ? 'active' : ''}`}
              onClick={() => setActiveToolbarItem(item.id)}
            >
              <div className="toolbar-icon-wrapper">
                <img src={item.icon3d} alt={item.id} className="toolbar-icon-3d" />
              </div>
              <span>{item.id}</span>
            </button>
          ))}
          <div className="toolbar-divider"></div>
          {[
            { id: 'Produtos', icon3d: '/icons/3d/produtos.png' },
            { id: 'Estoque', icon3d: '/icons/3d/estoque.png' },
            { id: 'Delivery', icon3d: '/icons/3d/delivery.png' }
          ].map(item => (
            <button 
              key={item.id}
              className={`toolbar-btn ${activeToolbarItem === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveToolbarItem(item.id);
                if (item.id === 'Produtos') {
                  setIsProductsModalOpen(true);
                }
              }}
            >
              <div className="toolbar-icon-wrapper">
                <img src={item.icon3d} alt={item.id} className="toolbar-icon-3d" />
              </div>
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

      {isCategoriesModalOpen && (
        <ModalCategorias onClose={() => setIsCategoriesModalOpen(false)} />
      )}
      {isProductsModalOpen && (
        <ModalProdutos onClose={() => setIsProductsModalOpen(false)} />
      )}
      {isSettingsModalOpen && (
        <TelaConfiguracao isModal={true} onClose={() => setIsSettingsModalOpen(false)} />
      )}
    </div>
  );
}
