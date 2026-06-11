import React from 'react';

import { 
  ChevronRight
} from 'lucide-react';
import './TelaCheckout.css';
import { ModalCategorias } from '../ModalCategorias/ModalCategorias';
import { ModalProdutos } from '../ModalProdutos/ModalProdutos';
import { TelaConfiguracao } from '../TelaConfiguracao/TelaConfiguracao';
import { TelaBalcao } from '../TelaBalcao/TelaBalcao';

const menusData: Record<string, { label: string; shortcut?: string; icon: string | null; hasSub?: boolean; dividerAfter?: boolean }[]> = {
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
    { label: 'Categorias', icon: '📁', dividerAfter: true },
    { label: 'Fornecedores', icon: '🚚' },
    { label: 'Clientes', icon: '👥', dividerAfter: true },
    { label: 'Mesas', icon: '🍽️' },
    { label: 'Comandas', icon: '📋', dividerAfter: true },
    { label: 'Países', icon: '🌐' },
    { label: 'Estados', icon: '🗺️' },
    { label: 'Cidades', icon: '🏙️' },
    { label: 'Bairros', icon: '📍', dividerAfter: true },
    { label: 'Funcionários', icon: '👥' },
    { label: 'Funções', icon: '💼', dividerAfter: true },
    { label: 'Contas', icon: '🧾' },
    { label: 'Serviços', icon: '🛠️' },
    { label: 'Créditos', icon: '💳', dividerAfter: true },
    { label: 'Formas de pagamento', icon: '💵' },
    { label: 'Cartões', icon: '💳' },
    { label: 'Bancos', icon: '🏦' },
    { label: 'Carteiras', icon: '👛' },
    { label: 'Moedas', icon: '🪙', dividerAfter: true },
    { label: 'Caixas', icon: '🖥️', dividerAfter: true },
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
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  const [activeToolbarItem, setActiveToolbarItem] = React.useState<string>('PDV');

  // Estados MDI para controle de janelas flutuantes
  const [windows, setWindows] = React.useState<any[]>([]);
  const [activeWindowId, setActiveWindowId] = React.useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = React.useState<number>(100);

  // Estados para as funções interativas do rodapé
  const [caixaAtivo, setCaixaAtivo] = React.useState<string>('Caixa 1');
  const [usuarioAtivo, setUsuarioAtivo] = React.useState<string>('Admin');
  const [balancaHabilitada, setBalancaHabilitada] = React.useState<boolean>(false);
  const [identificadorHabilitado, setIdentificadorHabilitado] = React.useState<boolean>(false);
  const [impressoraAtiva, setImpressoraAtiva] = React.useState<string>('Térmica 80mm');

  // Estados de popovers e modais
  const [activePopover, setActivePopover] = React.useState<'impressora' | 'caixa' | null>(null);
  const [balancaModalOpen, setBalancaModalOpen] = React.useState<boolean>(false);
  const [identificadorModalOpen, setIdentificadorModalOpen] = React.useState<boolean>(false);
  const [loginModalOpen, setLoginModalOpen] = React.useState<boolean>(false);

  // Estados para o login simulado
  const [selectedLoginUser, setSelectedLoginUser] = React.useState<string>('Admin');
  const [loginPassword, setLoginPassword] = React.useState<string>('');

  // Estados para o servidor simulado
  const [sincronizacaoIniciada, setSincronizacaoIniciada] = React.useState<boolean>(false);
  const [servidorAba, setServidorAba] = React.useState<'principal' | 'tarefas' | 'registros'>('principal');
  const [conectandoServidor, setConectandoServidor] = React.useState<boolean>(false);
  const [progressoConexao, setProgressoConexao] = React.useState<number>(0);

  // Estados para o chat de suporte simulado
  const [suporteInput, setSuporteInput] = React.useState<string>('');
  const [suporteChat, setSuporteChat] = React.useState<{ sender: 'user' | 'bot'; text: string; time: string }[]>([
    { sender: 'bot', text: 'Olá! Sou o assistente virtual do NinoPDV. Como posso te ajudar hoje?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);

  const handleSendSuporteMessage = () => {
    if (!suporteInput.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = suporteInput;
    setSuporteChat(prev => [...prev, { sender: 'user', text: userMsg, time }]);
    setSuporteInput('');

    setTimeout(() => {
      let botResponse = 'Entendi sua dúvida. Como este é um chat de simulação, posso te guiar nos seguintes tópicos:\n1. Como abrir o caixa?\n2. Como cadastrar produtos?\n3. Suporte no WhatsApp.';
      const lower = userMsg.toLowerCase();
      if (lower.includes('abrir') || lower.includes('caixa') || lower.includes('fechar')) {
        botResponse = 'Para gerenciar o caixa, clique em "Contas+" no menu superior para abrir a janela de Abertura/Fechamento de Caixa, ou acesse pelo menu Financeiro > Selecionar Caixa.';
      } else if (lower.includes('produto') || lower.includes('cadastro') || lower.includes('cadastrar')) {
        botResponse = 'Para cadastrar produtos, você pode clicar no botão "Produtos" na barra de ferramentas superior ou acessar pelo menu Cadastro > Produtos.';
      } else if (lower.includes('whatsapp') || lower.includes('fone') || lower.includes('contato') || lower.includes('telefone')) {
        botResponse = 'Você pode falar com o suporte humano diretamente no WhatsApp pelo número (11) 99999-9999 ou clicando no botão "Falar no WhatsApp" ao lado.';
      } else if (lower.includes('1')) {
        botResponse = 'Para abrir o caixa, você pode clicar no botão "Contas+" no menu superior. Ele abrirá a janela de Controle de Caixa para abertura e fechamento.';
      } else if (lower.includes('2')) {
        botResponse = 'Para cadastrar um novo produto, clique no ícone "Produtos" da barra superior. Uma janela MDI se abrirá permitindo adicionar, editar ou excluir produtos e preços.';
      } else if (lower.includes('3')) {
        botResponse = 'Suporte no WhatsApp: Entre em contato pelo telefone (11) 99999-9999. Nosso horário de atendimento é de segunda a sexta, das 8h às 22h, e fins de semana das 10h às 20h.';
      }
      setSuporteChat(prev => [...prev, { sender: 'bot', text: botResponse, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1000);
  };

  const handleIniciarSincronizacao = () => {
    setConectandoServidor(true);
    setProgressoConexao(0);
    
    const interval = setInterval(() => {
      setProgressoConexao(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setConectandoServidor(false);
          setSincronizacaoIniciada(true);
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

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

  const toggleMenu = (menuName: string) => {
    setActiveMenu(prev => prev === menuName ? null : menuName);
  };

  const handleClickOutside = () => {
    if (activeMenu) setActiveMenu(null);
  };

  const focusWindow = (id: string) => {
    setActiveWindowId(id);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: nextZIndex } : w));
    setNextZIndex(p => p + 1);
  };

  const openWindow = (id: string, title: string, icon: string) => {
    setActiveMenu(null);
    const existing = windows.find(w => w.id === id);
    
    if (existing) {
      setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w));
      setActiveWindowId(id);
      setNextZIndex(p => p + 1);
      return;
    }

    const offset = (windows.length % 6) * 30;
    
    let width = 780;
    let height = 580;
    if (id === 'produtos') {
      width = 1100;
      height = 620;
    } else if (id === 'configuracoes') {
      width = 820;
      height = 600;
    } else if (id === 'categorias') {
      width = 950;
      height = 580;
    }

    const newWin = {
      id,
      title,
      icon,
      isMinimized: false,
      isMaximized: false,
      x: 50 + offset,
      y: 40 + offset,
      width,
      height,
      zIndex: nextZIndex
    };

    setWindows(prev => [...prev, newWin]);
    setActiveWindowId(id);
    setNextZIndex(p => p + 1);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) {
      const remaining = windows.filter(w => w.id !== id && !w.isMinimized);
      if (remaining.length > 0) {
        const sorted = [...remaining].sort((a, b) => b.zIndex - a.zIndex);
        setActiveWindowId(sorted[0].id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    if (activeWindowId === id) {
      const remaining = windows.filter(w => w.id !== id && !w.isMinimized);
      if (remaining.length > 0) {
        const sorted = [...remaining].sort((a, b) => b.zIndex - a.zIndex);
        setActiveWindowId(sorted[0].id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  const toggleMinimizeWindow = (id: string) => {
    const win = windows.find(w => w.id === id);
    if (!win) return;

    if (win.isMinimized) {
      setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w));
      setActiveWindowId(id);
      setNextZIndex(p => p + 1);
    } else if (activeWindowId === id) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  };

  const toggleMaximizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
    focusWindow(id);
  };

  const handleHeaderMouseDown = (e: React.MouseEvent, windowId: string) => {
    focusWindow(windowId);
    const win = windows.find(w => w.id === windowId);
    if (!win || win.isMaximized) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = win.x;
    const startTop = win.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      let newX = startLeft + (moveEvent.clientX - startX);
      let newY = startTop + (moveEvent.clientY - startY);
      if (newY < 0) newY = 0;
      setWindows(prev => prev.map(w => w.id === windowId ? { ...w, x: newX, y: newY } : w));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleDropdownItemClick = (menuName: string, label: string) => {
    setActiveMenu(null);
    if (menuName === 'Cadastro' && label === 'Categorias') {
      openWindow('categorias', 'Cadastro de Categorias', '📁');
    }
    if (menuName === 'Cadastro' && label === 'Produtos') {
      openWindow('produtos', 'Cadastro de Produtos', '🍔');
    }
    if (menuName === 'Configurações' && label === 'Empresa e Sistema...') {
      openWindow('configuracoes', 'Configurações da Empresa e Sistema', '⚙️');
    }
    if (menuName === 'Vendas' && label === 'Mesas') {
      openWindow('mesas', 'Mesas (F3)', '🍽️');
    }
    if (menuName === 'Vendas' && label === 'Comandas') {
      openWindow('comandas', 'Comandas (F11)', '📋');
    }
    if (menuName === 'Vendas' && label === 'Balcão') {
      openWindow('balcao', 'Venda para Balcão (F4)', '🥤');
    }
    if (menuName === 'Vendas' && label === 'Entrega') {
      openWindow('delivery', 'Painel de Delivery (F8)', '🛵');
    }
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
        return renderPlaceholderContent('estoque', 'Movimentação de Estoque');
      case 'delivery':
        return renderPlaceholderContent('delivery', 'Painel de Delivery');
      default:
        return renderPlaceholderContent(id, id.charAt(0).toUpperCase() + id.slice(1));
    }
  };
  
  React.useEffect(() => {
    // Ao entrar no checkout, maximiza a janela
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('maximize-window');
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT');
      if (isInput) return;

      if (e.key === 'F3') {
        e.preventDefault();
        openWindow('mesas', 'Mesas (F3)', '🍽️');
      } else if (e.key === 'F4') {
        e.preventDefault();
        openWindow('balcao', 'Venda para Balcão (F4)', '🥤');
      } else if (e.key === 'F8') {
        e.preventDefault();
        openWindow('delivery', 'Painel de Delivery (F8)', '🛵');
      } else if (e.key === 'F11') {
        e.preventDefault();
        openWindow('comandas', 'Comandas (F11)', '📋');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [windows, nextZIndex]);

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
                  <React.Fragment key={idx}>
                    <button 
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
                    {item.dividerAfter && <div className="dropdown-divider" />}
                  </React.Fragment>
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
            { id: 'Mesas', icon3d: '/icons/3d/mesas.png', mdiId: 'mesas', emoji: '🍽️', title: 'Mesas (F3)' },
            { id: 'Comandas', icon3d: '/icons/3d/comandas.png', mdiId: 'comandas', emoji: '📋', title: 'Comandas (F11)' },
            { id: 'Balcão', icon3d: '/icons/3d/balcao.png', mdiId: 'balcao', emoji: '🥤', title: 'Venda para Balcão (F4)' },
            { id: 'PDV', icon3d: '/icons/3d/pdv.png', mdiId: 'pdv', emoji: '💻', title: 'PDV' }
          ].map(item => (
            <button 
              key={item.id}
              className={`toolbar-btn ${activeToolbarItem === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveToolbarItem(item.id);
                if (item.mdiId !== 'pdv') {
                  openWindow(item.mdiId, item.title, item.emoji);
                }
              }}
            >
              <div className="toolbar-icon-wrapper">
                <img src={item.icon3d} alt={item.id} className="toolbar-icon-3d" />
              </div>
              <span>{item.id}</span>
            </button>
          ))}
          <div className="toolbar-divider"></div>
          {[
            { id: 'Contas', icon3d: '/icons/3d/contas.png', mdiId: 'contas', emoji: '🧾', title: 'Contas a Pagar/Receber' },
            { id: 'Contas+', icon3d: '/icons/3d/contasm.png', mdiId: 'contasm', emoji: '🖥️', title: 'Abertura/Fechamento de Caixa' }
          ].map(item => (
            <button 
              key={item.id}
              className={`toolbar-btn ${activeToolbarItem === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveToolbarItem(item.id);
                openWindow(item.mdiId, item.title, item.emoji);
              }}
            >
              <div className="toolbar-icon-wrapper">
                <img src={item.icon3d} alt={item.id} className="toolbar-icon-3d" />
              </div>
              <span>{item.id}</span>
            </button>
          ))}
          <div className="toolbar-divider"></div>
          {[
            { id: 'Produtos', icon3d: '/icons/3d/produtos.png', mdiId: 'produtos', emoji: '🍔', title: 'Cadastro de Produtos' },
            { id: 'Estoque', icon3d: '/icons/3d/estoque.png', mdiId: 'estoque', emoji: '📦', title: 'Movimentação de Estoque' },
            { id: 'Delivery', icon3d: '/icons/3d/delivery.png', mdiId: 'delivery', emoji: '🛵', title: 'Painel de Delivery (F8)' }
          ].map(item => (
            <button 
              key={item.id}
              className={`toolbar-btn ${activeToolbarItem === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveToolbarItem(item.id);
                openWindow(item.mdiId, item.title, item.emoji);
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
 
      {/* Main Workspace (Suporta MDI) */}
      <div className="checkout-content empty-workspace">
        
        {/* Renderizador de Janelas MDI */}
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
 
      {/* Bottom Status Bar (Atua como Barra de Status e Barra de Janelas) */}
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
    </div>
  );
}
