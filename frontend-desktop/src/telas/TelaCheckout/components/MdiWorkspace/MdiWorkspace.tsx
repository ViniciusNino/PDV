import React from 'react';
import type { MdiWindowInfo } from '../../TelaCheckoutState';
import { ModalCategorias } from '../../../ModalCategorias/ModalCategorias';
import { ModalProdutos } from '../../../ModalProdutos/ModalProdutos';
import { TelaConfiguracao } from '../../../TelaConfiguracao/TelaConfiguracao';
import { TelaBalcao } from '../../../TelaBalcao/TelaBalcao';
import { TelaEstoque } from '../../../TelaEstoque/TelaEstoque';
import { TelaFornecedores } from '../../../TelaFornecedores/TelaFornecedores';
import './MdiWorkspace.css';

interface MdiWorkspaceProps {
  windows: MdiWindowInfo[];
  activeWindowId: string | null;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleMaximizeWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  handleHeaderMouseDown: (e: React.MouseEvent, windowId: string) => void;

  // Servidor Simulado Props
  conectandoServidor: boolean;
  progressoConexao: number;
  servidorAba: 'principal' | 'tarefas' | 'registros';
  setServidorAba: (aba: 'principal' | 'tarefas' | 'registros') => void;
  sincronizacaoIniciada: boolean;
  setSincronizacaoIniciada: React.Dispatch<React.SetStateAction<boolean>>;
  handleIniciarSincronizacao: () => void;

  // Chat de Suporte Props
  suporteChat: Array<{ sender: 'user' | 'bot'; text: string; time: string }>;
  suporteInput: string;
  setSuporteInput: (input: string) => void;
  handleSendSuporteMessage: () => void;
}

export function MdiWorkspace({
  windows,
  activeWindowId,
  focusWindow,
  minimizeWindow,
  toggleMaximizeWindow,
  closeWindow,
  handleHeaderMouseDown,

  // Servidor
  conectandoServidor,
  progressoConexao,
  servidorAba,
  setServidorAba,
  sincronizacaoIniciada,
  setSincronizacaoIniciada,
  handleIniciarSincronizacao,

  // Suporte
  suporteChat,
  suporteInput,
  setSuporteInput,
  handleSendSuporteMessage
}: MdiWorkspaceProps) {

  const renderServidorContent = () => {
    if (conectandoServidor) {
      return (
        <div className="servidor-connecting">
          <div className="servidor-connecting-icon">💻⚡☁️</div>
          <h3>Conectando ao servidor...</h3>
          <div className="servidor-progress-bar">
            <div className="servidor-progress-fill" style={{ width: `${progressoConexao}%` }}></div>
          </div>
          <span className="servidor-progress-text">{progressoConexao}%</span>
        </div>
      );
    }

    return (
      <div className="servidor-layout">
        <div className="servidor-tabs">
          <button className={`servidor-tab ${servidorAba === 'principal' ? 'active' : ''}`} onClick={() => setServidorAba('principal')}>Principal</button>
          <button className={`servidor-tab ${servidorAba === 'tarefas' ? 'active' : ''}`} onClick={() => setServidorAba('tarefas')}>Tarefas</button>
          <button className={`servidor-tab ${servidorAba === 'registros' ? 'active' : ''}`} onClick={() => setServidorAba('registros')}>Registros</button>
        </div>
        <div className="servidor-tab-content">
          {servidorAba === 'principal' && (
            <div className="servidor-panel-principal">
              <div className="servidor-info-cols">
                <div className="servidor-info-section">
                  <h4>Serviço de sincronização</h4>
                  <div className="servidor-status-box">
                    <span className={`servidor-status-dot ${sincronizacaoIniciada ? 'green' : 'red'}`}></span>
                    <span>Status: <strong>{sincronizacaoIniciada ? 'Iniciado' : 'Parado'}</strong></span>
                  </div>
                  <div className="servidor-status-subtext">Dispositivos conectados: <strong>{sincronizacaoIniciada ? '1' : '0'}</strong></div>
                  <div className="servidor-actions-col">
                    {!sincronizacaoIniciada ? (
                      <button className="servidor-btn action-start" onClick={handleIniciarSincronizacao}>Iniciar</button>
                    ) : (
                      <button className="servidor-btn action-stop" onClick={() => setSincronizacaoIniciada(false)}>Parar</button>
                    )}
                    <button className="servidor-btn" disabled={!sincronizacaoIniciada} onClick={() => {
                      setSincronizacaoIniciada(false);
                      setTimeout(handleIniciarSincronizacao, 300);
                    }}>Reiniciar</button>
                  </div>
                </div>

                <div className="servidor-info-section">
                  <h4>Descoberta de rede</h4>
                  <div className="servidor-status-box">
                    <span className="servidor-status-dot green"></span>
                    <span>Status: <strong>Iniciado</strong></span>
                  </div>
                  <div className="servidor-status-subtext">IP: <strong>192.168.0.14</strong></div>
                  <div className="servidor-actions-col">
                    <button className="servidor-btn action-stop">Parar</button>
                    <button className="servidor-btn">Reiniciar</button>
                  </div>
                </div>

                <div className="servidor-info-section">
                  <h4>Servidor Web</h4>
                  <div className="servidor-status-box">
                    <span className="servidor-status-dot green"></span>
                    <span>Status: <strong>Iniciado</strong></span>
                  </div>
                  <div className="servidor-status-subtext">Site: <span className="servidor-link">http://127.0.0.1:8001</span></div>
                  <div className="servidor-actions-col">
                    <button className="servidor-btn">Recarregar</button>
                  </div>
                </div>
              </div>

              <div className="servidor-devices-section">
                <h5>Dispositivos conectados</h5>
                <div className="servidor-devices-table-wrapper">
                  <table className="servidor-devices-table">
                    <thead>
                      <tr>
                        <th>Descrição</th>
                        <th>Nome</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sincronizacaoIniciada ? (
                        <tr>
                          <td>💻 Computador - Desktop-Nino (Admin)</td>
                          <td>Desktop-Nino (127.0.0.1)</td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan={2} className="no-devices">Nenhum dispositivo conectado. Inicie a sincronização.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="servidor-footer-actions">
                <button className="servidor-btn-sair" onClick={() => closeWindow('servidor')}>Sair</button>
              </div>
            </div>
          )}

          {servidorAba === 'tarefas' && (
            <div className="servidor-panel-text">
              <h5>Tarefas de Sincronização Recentes</h5>
              <div className="servidor-log-list">
                <div className="servidor-log-item">✓ Sincronização de tabelas de produtos (100%) - Concluído</div>
                <div className="servidor-log-item">✓ Envio de histórico de vendas - Concluído</div>
                <div className="servidor-log-item">✓ Atualização de categorias locais - Concluído</div>
                {sincronizacaoIniciada && <div className="servidor-log-item">✓ Sincronização em tempo real ativa</div>}
              </div>
            </div>
          )}

          {servidorAba === 'registros' && (
            <div className="servidor-panel-text">
              <h5>Registros do Servidor (Logs)</h5>
              <div className="servidor-log-console">
                <div>[12:10:01] Servidor Web iniciado na porta 8001...</div>
                <div>[12:10:02] Serviço de descoberta de rede ativo no IP 192.168.0.14</div>
                {sincronizacaoIniciada ? (
                  <>
                    <div>[12:15:32] Solicitando conexão com a nuvem...</div>
                    <div>[12:15:33] Conexão com o servidor principal estabelecida com sucesso.</div>
                    <div>[12:15:34] Dispositivo Desktop-Nino autenticado.</div>
                  </>
                ) : (
                  <div>[12:10:02] Sincronização de nuvem aguardando início do usuário.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSuporteContent = () => {
    return (
      <div className="suporte-layout">
        <div className="suporte-sidebar">
          <h4>Canais de Suporte</h4>
          <button className="suporte-channel-btn active">
            <span>💬</span> Chat NinoPDV
          </button>
          <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="suporte-channel-btn-link">
            <span>🟢</span> WhatsApp Suporte
          </a>
          <button className="suporte-channel-btn" onClick={() => alert('Central de Ajuda NinoPDV: Em breve!')}>
            <span>📚</span> Central de Ajuda
          </button>
          <div className="suporte-hours">
            <strong>Atendimento:</strong>
            <p>Seg a Sex: 8h às 22h</p>
            <p>Sáb e Dom: 10h às 20h</p>
          </div>
        </div>
        <div className="suporte-chat-area">
          <div className="suporte-chat-header">
            <strong>Assistente Virtual NinoPDV</strong>
            <span className="suporte-status-online">● online</span>
          </div>
          <div className="suporte-chat-messages">
            {suporteChat.map((msg, idx) => (
              <div key={idx} className={`suporte-msg-bubble ${msg.sender}`}>
                <div className="suporte-msg-text">{msg.text}</div>
                <div className="suporte-msg-time">{msg.time}</div>
              </div>
            ))}
          </div>
          <div className="suporte-chat-input-wrapper">
            <input 
              type="text" 
              placeholder="Digite sua dúvida aqui... (ex: caixa, cadastrar)" 
              value={suporteInput}
              onChange={e => setSuporteInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSendSuporteMessage();
              }}
              className="suporte-chat-input"
            />
            <button className="suporte-chat-send" onClick={handleSendSuporteMessage}>Enviar</button>
          </div>
        </div>
      </div>
    );
  };

  const renderPlaceholderContent = (_id: string, title: string) => {
    return (
      <div className="mdi-placeholder-content animate-fade-in">
        <div className="placeholder-icon">🚧</div>
        <h2>Módulo de {title}</h2>
        <p>
          Este módulo está em desenvolvimento e será integrado com o banco de dados em breve. 
          Aqui será renderizada a interface completa do NinoPDV para gerenciamento de {title.toLowerCase()}.
        </p>
        <div className="placeholder-badge">
          Status: Simulação de Janela MDI Ativa
        </div>
      </div>
    );
  };

  const renderWindowContent = (id: string) => {
    switch (id) {
      case 'servidor':
        return renderServidorContent();
      case 'suporte':
        return renderSuporteContent();
      case 'produtos':
        return <ModalProdutos isWindowMode={true} onClose={() => closeWindow('produtos')} />;
      case 'categorias':
        return <ModalCategorias isWindowMode={true} onClose={() => closeWindow('categorias')} />;
      case 'configuracoes':
        return <TelaConfiguracao isModal={true} isWindowMode={true} onClose={() => closeWindow('configuracoes')} />;
      case 'mesas':
        return renderPlaceholderContent('mesas', 'Mesas');
      case 'comandas':
        return renderPlaceholderContent('comandas', 'Comandas');
      case 'balcao':
        return <TelaBalcao />;
      case 'contas':
        return renderPlaceholderContent('contas', 'Contas a Pagar/Receber');
      case 'contasm':
        return renderPlaceholderContent('contasm', 'Abertura/Fechamento de Caixa');
      case 'estoque':
        return <TelaEstoque isWindowMode={true} onClose={() => closeWindow('estoque')} />;
      case 'fornecedores':
        return <TelaFornecedores isWindowMode={true} onClose={() => closeWindow('fornecedores')} />;
      case 'delivery':
        return renderPlaceholderContent('delivery', 'Painel de Delivery');
      default:
        return renderPlaceholderContent(id, id.charAt(0).toUpperCase() + id.slice(1));
    }
  };

  return (
    <div className="checkout-content empty-workspace">
      {windows.map(win => {
        if (win.isMinimized) return null;
        
        return (
          <div 
            key={win.id}
            className={`mdi-window ${win.isMaximized ? 'maximized' : ''} ${activeWindowId === win.id ? 'active' : ''}`}
            style={{
              zIndex: win.zIndex,
              left: win.isMaximized ? 0 : `${win.x}px`,
              top: win.isMaximized ? 0 : `${win.y}px`,
              width: win.isMaximized ? '100%' : `${win.width}px`,
              height: win.isMaximized ? '100%' : `${win.height}px`,
            }}
            onClick={() => focusWindow(win.id)}
          >
            <div 
              className="mdi-window-header"
              onMouseDown={(e) => handleHeaderMouseDown(e, win.id)}
              onDoubleClick={() => toggleMaximizeWindow(win.id)}
            >
              <div className="mdi-window-title">
                <span className="mdi-window-icon">{win.icon}</span>
                <span>{win.title}</span>
              </div>
              <div className="mdi-window-controls" onClick={e => e.stopPropagation()}>
                <button className="mdi-control-btn btn-min" title="Minimizar" onClick={() => minimizeWindow(win.id)}>🗕</button>
                <button className="mdi-control-btn btn-max" title={win.isMaximized ? 'Restaurar' : 'Maximizar'} onClick={() => toggleMaximizeWindow(win.id)}>{win.isMaximized ? '🗗' : '🗖'}</button>
                <button className="mdi-control-btn btn-close" title="Fechar" onClick={() => closeWindow(win.id)}>✕</button>
              </div>
            </div>
            <div className="mdi-window-content">
              {renderWindowContent(win.id)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
