import React from 'react';
import type { MdiWindowInfo } from '../../TelaCheckoutState';
import './StatusBar.css';

interface StatusBarProps {
  windows: MdiWindowInfo[];
  activeWindowId: string | null;
  toggleMinimizeWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  openWindow: (id: string, title: string, icon: string) => void;
  
  // Caixa
  caixaAtivo: string;
  setCaixaAtivo: (caixa: string) => void;

  // Usuário
  usuarioAtivo: string;
  setUsuarioAtivo: (usuario: string) => void;

  // Impressora
  impressoraAtiva: string;
  setImpressoraAtiva: (impressora: string) => void;

  // Balança
  balancaHabilitada: boolean;
  setBalancaHabilitada: (habilitada: boolean) => void;
  balancaModalOpen: boolean;
  setBalancaModalOpen: (open: boolean) => void;

  // Identificador
  identificadorHabilitado: boolean;
  setIdentificadorHabilitado: (habilitado: boolean) => void;
  identificadorModalOpen: boolean;
  setIdentificadorModalOpen: (open: boolean) => void;

  // Login
  loginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  selectedLoginUser: string;
  setSelectedLoginUser: (user: string) => void;
  loginPassword: string;
  setLoginPassword: (password: string) => void;

  // Popover ativo
  activePopover: 'impressora' | 'caixa' | null;
  setActivePopover: React.Dispatch<React.SetStateAction<'impressora' | 'caixa' | null>>;
}

export function StatusBar({
  windows,
  activeWindowId,
  toggleMinimizeWindow,
  closeWindow,
  openWindow,
  
  // Caixa
  caixaAtivo,
  setCaixaAtivo,

  // Usuário
  usuarioAtivo,
  setUsuarioAtivo,

  // Impressora
  impressoraAtiva,
  setImpressoraAtiva,

  // Balança
  balancaHabilitada,
  setBalancaHabilitada,
  balancaModalOpen,
  setBalancaModalOpen,

  // Identificador
  identificadorHabilitado,
  setIdentificadorHabilitado,
  identificadorModalOpen,
  setIdentificadorModalOpen,

  // Login
  loginModalOpen,
  setLoginModalOpen,
  selectedLoginUser,
  setSelectedLoginUser,
  loginPassword,
  setLoginPassword,

  // Popover ativo
  activePopover,
  setActivePopover
}: StatusBarProps) {
  
  return (
    <>
      <footer className="status-bar">
        <div className="status-mdi-bar">
          {windows.map(win => (
            <button 
              key={win.id}
              className={`mdi-taskbar-btn ${activeWindowId === win.id ? 'active' : ''} ${win.isMinimized ? 'minimized' : ''}`}
              onClick={() => toggleMinimizeWindow(win.id)}
            >
              <span className="taskbar-icon">{win.icon}</span>
              <span className="taskbar-label">{win.title}</span>
              <span className="taskbar-close" onClick={(e) => {
                e.stopPropagation();
                closeWindow(win.id);
              }}>×</span>
            </button>
          ))}
        </div>
        <div className="status-items">
          <button 
            className="status-item-btn" 
            title="Rede Local (Status do Servidor)"
            onClick={() => openWindow('servidor', 'Servidor do GrandChef', '☁️')}
          >
            <span className="status-green-dot"></span>
          </button>
          
          <button 
            className="status-item-btn" 
            title="Servidor de Sincronização"
            onClick={() => openWindow('servidor', 'Servidor do GrandChef', '☁️')}
          >
            <span className="status-item-emoji">☁️</span>
          </button>
          
          <div className="status-item-wrapper" style={{ position: 'relative' }}>
            <button 
              className="status-item-btn" 
              title="Configurações de Impressão"
              onClick={() => setActivePopover(prev => prev === 'impressora' ? null : 'impressora')}
            >
              <span className="status-item-emoji">🖨️</span>
            </button>
            {activePopover === 'impressora' && (
              <div className="status-popover impressora-popover">
                <div className="popover-header">Selecione a Impressora</div>
                <button className={`popover-item ${impressoraAtiva === 'Térmica 80mm' ? 'active' : ''}`} onClick={() => { setImpressoraAtiva('Térmica 80mm'); setActivePopover(null); }}>
                  🖨️ Térmica 80mm {impressoraAtiva === 'Térmica 80mm' ? '✓' : ''}
                </button>
                <button className={`popover-item ${impressoraAtiva === 'Cozinha (Produção)' ? 'active' : ''}`} onClick={() => { setImpressoraAtiva('Cozinha (Produção)'); setActivePopover(null); }}>
                  🍳 Cozinha (Produção) {impressoraAtiva === 'Cozinha (Produção)' ? '✓' : ''}
                </button>
                <button className={`popover-item ${impressoraAtiva === 'Nenhuma' ? 'active' : ''}`} onClick={() => { setImpressoraAtiva('Nenhuma'); setActivePopover(null); }}>
                  ❌ Nenhuma {impressoraAtiva === 'Nenhuma' ? '✓' : ''}
                </button>
                <div className="popover-divider"></div>
                <button className="popover-item-action" onClick={() => { openWindow('configuracoes', 'Configurações da Empresa e Sistema', '⚙️'); setActivePopover(null); }}>
                  ⚙️ Configurar no Sistema
                </button>
              </div>
            )}
          </div>

          <button 
            className={`status-item-btn ${balancaHabilitada ? '' : 'inactive'}`} 
            title="Balança"
            onClick={() => setBalancaModalOpen(true)}
          >
            <span className="status-item-emoji">⚖️</span>
          </button>

          <button 
            className={`status-item-btn ${identificadorHabilitado ? '' : 'inactive'}`} 
            title="Identificador de Chamadas"
            onClick={() => setIdentificadorModalOpen(true)}
          >
            <span className="status-item-emoji">📞</span>
          </button>
          
          <button 
            className="status-item-btn" 
            title="Usuário Autenticado"
            onClick={() => {
              setSelectedLoginUser(usuarioAtivo);
              setLoginPassword('');
              setLoginModalOpen(true);
            }}
          >
            <span className="status-item-emoji">👤</span>
            <span className="status-item-text">{usuarioAtivo}</span>
          </button>
          
          <div className="status-item-wrapper" style={{ position: 'relative' }}>
            <button 
              className={`status-item-btn ${caixaAtivo === 'Nenhum caixa' ? 'inactive' : ''}`} 
              title="Terminal / Caixa"
              onClick={() => setActivePopover(prev => prev === 'caixa' ? null : 'caixa')}
            >
              <span className="status-item-emoji">💻</span>
              <span className="status-item-text">{caixaAtivo}</span>
            </button>
            {activePopover === 'caixa' && (
              <div className="status-popover caixa-popover">
                <div className="popover-header">Status do Caixa</div>
                <button className={`popover-item ${caixaAtivo === 'Nenhum caixa' ? 'active' : ''}`} onClick={() => { setCaixaAtivo('Nenhum caixa'); setActivePopover(null); }}>
                  📁 Nenhum caixa {caixaAtivo === 'Nenhum caixa' ? '✓' : ''}
                </button>
                <button className={`popover-item ${caixaAtivo === 'Caixa 1' ? 'active' : ''}`} onClick={() => { setCaixaAtivo('Caixa 1'); setActivePopover(null); }}>
                  🖥️ Admin - Caixa 1 {caixaAtivo === 'Caixa 1' ? '✓' : ''}
                </button>
              </div>
            )}
          </div>

          <div className="status-bar-divider"></div>

          <button 
            className="status-item-btn support-btn-footer" 
            title="Suporte Técnico"
            onClick={() => openWindow('suporte', 'Suporte Técnico', '💬')}
          >
            <span className="status-item-emoji">💬</span>
            <span className="status-item-text">Suporte</span>
          </button>
        </div>
      </footer>

      {/* Modais de Confirmação e Login */}
      {balancaModalOpen && (
        <div className="footer-dialog-overlay">
          <div className="footer-dialog-box animate-scale-in">
            <div className="footer-dialog-header">
              <span>GrandChef Desktop</span>
              <button className="footer-dialog-close" onClick={() => setBalancaModalOpen(false)}>×</button>
            </div>
            <div className="footer-dialog-body">
              <div className="footer-dialog-icon">?</div>
              <div className="footer-dialog-text">O uso de balança está desabilitado, deseja habilitá-lo agora?</div>
            </div>
            <div className="footer-dialog-footer">
              <button className="footer-dialog-btn btn-primary" onClick={() => { setBalancaHabilitada(true); setBalancaModalOpen(false); }}>Sim</button>
              <button className="footer-dialog-btn" onClick={() => { setBalancaHabilitada(false); setBalancaModalOpen(false); }}>Não</button>
              <button className="footer-dialog-btn" onClick={() => setBalancaModalOpen(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {identificadorModalOpen && (
        <div className="footer-dialog-overlay">
          <div className="footer-dialog-box animate-scale-in">
            <div className="footer-dialog-header">
              <span>GrandChef Desktop</span>
              <button className="footer-dialog-close" onClick={() => setIdentificadorModalOpen(false)}>×</button>
            </div>
            <div className="footer-dialog-body">
              <div className="footer-dialog-icon">?</div>
              <div className="footer-dialog-text">O identificador de chamadas está desabilitado, deseja habilitá-lo agora?</div>
            </div>
            <div className="footer-dialog-footer">
              <button className="footer-dialog-btn btn-primary" onClick={() => { setIdentificadorHabilitado(true); setIdentificadorModalOpen(false); }}>Sim</button>
              <button className="footer-dialog-btn" onClick={() => { setIdentificadorHabilitado(false); setIdentificadorModalOpen(false); }}>Não</button>
              <button className="footer-dialog-btn" onClick={() => setIdentificadorModalOpen(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {loginModalOpen && (
        <div className="footer-dialog-overlay">
          <div className="footer-login-box animate-scale-in">
            <div className="footer-login-header">
              <span className="footer-login-key">🔑</span>
              <span>Autenticação</span>
            </div>
            <div className="footer-login-body">
              <div className="login-field-row">
                <label>Usuário:</label>
                <select 
                  value={selectedLoginUser} 
                  onChange={e => setSelectedLoginUser(e.target.value)}
                  className="login-select"
                >
                  <option value="Admin">👤 Admin</option>
                  <option value="Operador 1">👤 Operador 1</option>
                  <option value="Gerente">👤 Gerente</option>
                </select>
              </div>
              <div className="login-field-row">
                <label>Senha:</label>
                <input 
                  type="password" 
                  value={loginPassword} 
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="Digite a senha..."
                  className="login-input"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      setUsuarioAtivo(selectedLoginUser);
                      setLoginModalOpen(false);
                    }
                  }}
                />
              </div>
            </div>
            <div className="footer-login-footer">
              <button className="login-btn-action btn-submit" onClick={() => {
                setUsuarioAtivo(selectedLoginUser);
                setLoginModalOpen(false);
              }}>Entrar</button>
              <button className="login-btn-action" onClick={() => setLoginModalOpen(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
