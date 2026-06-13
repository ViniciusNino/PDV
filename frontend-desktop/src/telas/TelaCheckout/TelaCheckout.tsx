import { useEffect } from 'react';
import { useTelaCheckout } from './TelaCheckoutState';
import { MenuBar } from './components/MenuBar/MenuBar';
import { TopToolbar } from './components/TopToolbar/TopToolbar';
import { MdiWorkspace } from './components/MdiWorkspace/MdiWorkspace';
import { StatusBar } from './components/StatusBar/StatusBar';
import './TelaCheckout.css';

export function TelaCheckout() {
  const state = useTelaCheckout();

  useEffect(() => {
    // Ao entrar no checkout, maximiza a janela do Electron se aplicável
    try {
      if ((window as any).require) {
        const { ipcRenderer } = (window as any).require('electron');
        ipcRenderer.send('maximize-window');
      }
    } catch (err) {
      console.warn('Electron maximize integration bypassed:', err);
    }
  }, []);

  return (
    <div className="checkout-container animate-fade-in" onClick={state.handleClickOutside}>
      
      {/* Menu Bar */}
      <MenuBar 
        activeMenu={state.activeMenu}
        setActiveMenu={state.setActiveMenu}
        toggleMenu={state.toggleMenu}
        handleDropdownItemClick={state.handleDropdownItemClick}
      />

      {/* Top Toolbar */}
      <TopToolbar 
        activeToolbarItem={state.activeToolbarItem}
        setActiveToolbarItem={state.setActiveToolbarItem}
        openWindow={state.openWindow}
      />

      {/* Main Workspace (Suporta MDI) */}
      <MdiWorkspace 
        windows={state.windows}
        activeWindowId={state.activeWindowId}
        focusWindow={state.focusWindow}
        minimizeWindow={state.minimizeWindow}
        toggleMaximizeWindow={state.toggleMaximizeWindow}
        closeWindow={state.closeWindow}
        handleHeaderMouseDown={state.handleHeaderMouseDown}
        
        // Servidor
        conectandoServidor={state.conectandoServidor}
        progressoConexao={state.progressoConexao}
        servidorAba={state.servidorAba}
        setServidorAba={state.setServidorAba}
        sincronizacaoIniciada={state.sincronizacaoIniciada}
        setSincronizacaoIniciada={state.setSincronizacaoIniciada}
        handleIniciarSincronizacao={state.handleIniciarSincronizacao}

        // Suporte
        suporteChat={state.suporteChat}
        suporteInput={state.suporteInput}
        setSuporteInput={state.setSuporteInput}
        handleSendSuporteMessage={state.handleSendSuporteMessage}
      />

      {/* Bottom Status Bar */}
      <StatusBar 
        windows={state.windows}
        activeWindowId={state.activeWindowId}
        toggleMinimizeWindow={state.toggleMinimizeWindow}
        closeWindow={state.closeWindow}
        openWindow={state.openWindow}
        
        // Caixa
        caixaAtivo={state.caixaAtivo}
        setCaixaAtivo={state.setCaixaAtivo}

        // Usuário
        usuarioAtivo={state.usuarioAtivo}
        setUsuarioAtivo={state.setUsuarioAtivo}

        // Impressora
        impressoraAtiva={state.impressoraAtiva}
        setImpressoraAtiva={state.setImpressoraAtiva}

        // Balança
        balancaHabilitada={state.balancaHabilitada}
        setBalancaHabilitada={state.setBalancaHabilitada}
        balancaModalOpen={state.balancaModalOpen}
        setBalancaModalOpen={state.setBalancaModalOpen}

        // Identificador
        identificadorHabilitado={state.identificadorHabilitado}
        setIdentificadorHabilitado={state.setIdentificadorHabilitado}
        identificadorModalOpen={state.identificadorModalOpen}
        setIdentificadorModalOpen={state.setIdentificadorModalOpen}

        // Login
        loginModalOpen={state.loginModalOpen}
        setLoginModalOpen={state.setLoginModalOpen}
        selectedLoginUser={state.selectedLoginUser}
        setSelectedLoginUser={state.setSelectedLoginUser}
        loginPassword={state.loginPassword}
        setLoginPassword={state.setLoginPassword}

        // Popover
        activePopover={state.activePopover}
        setActivePopover={state.setActivePopover}
      />
    </div>
  );
}
