import React from 'react';
import { Outlet } from 'react-router-dom';
import { Store } from 'lucide-react';
import './SetupLayout.css';

export function SetupLayout() {
  return (
    <div className="setup-layout-container">
      {/* Background que imita a tela de carregamento (Tela 2/3) */}
      <div className="setup-background">
        <div className="setup-logo-area">
          <Store size={64} />
          <span>NinoPDV</span>
        </div>
        <h1 className="setup-title">NinoPDV Desktop 1.0</h1>
        <h2 className="setup-subtitle">Gerenciamento de Restaurantes e Afins</h2>
        <span className="setup-loading-text">Carregando informações da empresa...</span>
      </div>

      <div className="setup-overlay"></div>

      {/* Renderiza a TelaConfiguracao ou TelaCriarConta por cima */}
      <div className="setup-content">
        <Outlet />
      </div>
    </div>
  );
}
