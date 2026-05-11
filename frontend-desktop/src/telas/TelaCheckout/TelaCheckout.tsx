import React from 'react';
import { ShoppingCart, LogOut, Settings, LayoutGrid, ClipboardList, MonitorPlay, Receipt, UtensilsCrossed, PackageSearch, PackageOpen, Truck, MessageCircle, Cloud, Printer, User, Laptop } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './TelaCheckout.css';

export function TelaCheckout() {
  const navigate = useNavigate();

  return (
    <div className="checkout-container animate-fade-in">
      
      {/* Top Toolbar (Referência Tela 4) */}
      <header className="checkout-topbar">
        <div className="toolbar-menu">
          <button className="toolbar-btn"><LayoutGrid size={24} /><span>Mesas</span></button>
          <button className="toolbar-btn"><ClipboardList size={24} /><span>Comandas</span></button>
          <button className="toolbar-btn"><MonitorPlay size={24} /><span>Balcão</span></button>
          <button className="toolbar-btn active"><ShoppingCart size={24} /><span>PDV</span></button>
          <div className="toolbar-divider"></div>
          <button className="toolbar-btn"><Receipt size={24} /><span>Contas</span></button>
          <button className="toolbar-btn"><UtensilsCrossed size={24} /><span>Contas+</span></button>
          <div className="toolbar-divider"></div>
          <button className="toolbar-btn"><PackageSearch size={24} /><span>Produtos</span></button>
          <button className="toolbar-btn"><PackageOpen size={24} /><span>Estoque</span></button>
          <button className="toolbar-btn"><Truck size={24} /><span>Delivery</span></button>
        </div>
        <div className="toolbar-actions">
          <button className="toolbar-btn" title="Configurações" onClick={() => navigate('/settings')}><Settings size={24} /><span>Config</span></button>
          <button className="toolbar-btn" onClick={() => navigate('/')}><LogOut size={24} /><span>Sair</span></button>
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
