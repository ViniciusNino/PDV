import React, { useState, useEffect, useCallback } from 'react';

export const menusData: Record<string, { label: string; shortcut?: string; icon: string | null; hasSub?: boolean; dividerAfter?: boolean }[]> = {
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
    { label: 'Gerenciamento local', icon: '⚙️' }
  ],
  Vendas: [
    { label: 'Mesas', icon: '🍽️' },
    { label: 'Comandas', icon: '📋' },
    { label: 'Balcão', icon: '🥤' },
    { label: 'Entrega', icon: '🛵', dividerAfter: true },
    { label: 'Configurar terminal...', icon: '🖥️' }
  ],
  Relatórios: [
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

export interface MdiWindowInfo {
  id: string;
  title: string;
  icon: string;
  isMinimized: boolean;
  isMaximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

export interface SupportChatMessage {
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export function useTelaCheckout() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeToolbarItem, setActiveToolbarItem] = useState<string>('PDV');

  // Estados MDI para controle de janelas flutuantes
  const [windows, setWindows] = useState<MdiWindowInfo[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState<number>(100);

  // Estados para as funções interativas do rodapé
  const [caixaAtivo, setCaixaAtivo] = useState<string>('Caixa 1');
  const [usuarioAtivo, setUsuarioAtivo] = useState<string>('Admin');
  const [balancaHabilitada, setBalancaHabilitada] = useState<boolean>(false);
  const [identificadorHabilitado, setIdentificadorHabilitado] = useState<boolean>(false);
  const [impressoraAtiva, setImpressoraAtiva] = useState<string>('Térmica 80mm');

  // Estados de popovers e modais
  const [activePopover, setActivePopover] = useState<'impressora' | 'caixa' | null>(null);
  const [balancaModalOpen, setBalancaModalOpen] = useState<boolean>(false);
  const [identificadorModalOpen, setIdentificadorModalOpen] = useState<boolean>(false);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);

  // Estados para o login simulado
  const [selectedLoginUser, setSelectedLoginUser] = useState<string>('Admin');
  const [loginPassword, setLoginPassword] = useState<string>('');

  // Estados para o servidor simulado
  const [sincronizacaoIniciada, setSincronizacaoIniciada] = useState<boolean>(false);
  const [servidorAba, setServidorAba] = useState<'principal' | 'tarefas' | 'registros'>('principal');
  const [conectandoServidor, setConectandoServidor] = useState<boolean>(false);
  const [progressoConexao, setProgressoConexao] = useState<number>(0);

  // Estados para o chat de suporte simulado
  const [suporteInput, setSuporteInput] = useState<string>('');
  const [suporteChat, setSuporteChat] = useState<SupportChatMessage[]>([
    { sender: 'bot', text: 'Olá! Sou o assistente virtual do NinoPDV. Como posso te ajudar hoje?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);

  const handleSendSuporteMessage = useCallback(() => {
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
  }, [suporteInput]);

  const handleIniciarSincronizacao = useCallback(() => {
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
  }, []);

  const toggleMenu = useCallback((menuName: string) => {
    setActiveMenu(prev => prev === menuName ? null : menuName);
  }, []);

  const handleClickOutside = useCallback(() => {
    setActiveMenu(null);
  }, []);

  const focusWindow = useCallback((id: string) => {
    setActiveWindowId(id);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: nextZIndex } : w));
    setNextZIndex(p => p + 1);
  }, [nextZIndex]);

  const openWindow = useCallback((id: string, title: string, icon: string) => {
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
    } else if (id === 'estoque') {
      width = 950;
      height = 700;
    }

    const newWin: MdiWindowInfo = {
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
  }, [windows, nextZIndex]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    setActiveWindowId(prevId => {
      if (prevId === id) {
        const remaining = windows.filter(w => w.id !== id && !w.isMinimized);
        if (remaining.length > 0) {
          const sorted = [...remaining].sort((a, b) => b.zIndex - a.zIndex);
          return sorted[0].id;
        }
        return null;
      }
      return prevId;
    });
  }, [windows]);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    setActiveWindowId(prevId => {
      if (prevId === id) {
        const remaining = windows.filter(w => w.id !== id && !w.isMinimized);
        if (remaining.length > 0) {
          const sorted = [...remaining].sort((a, b) => b.zIndex - a.zIndex);
          return sorted[0].id;
        }
        return null;
      }
      return prevId;
    });
  }, [windows]);

  const toggleMinimizeWindow = useCallback((id: string) => {
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
  }, [windows, activeWindowId, nextZIndex, minimizeWindow, focusWindow]);

  const toggleMaximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
    focusWindow(id);
  }, [focusWindow]);

  const handleHeaderMouseDown = useCallback((e: React.MouseEvent, windowId: string) => {
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
  }, [windows, focusWindow]);

  const handleDropdownItemClick = useCallback((menuName: string, label: string) => {
    setActiveMenu(null);
    if (menuName === 'Cadastro' && label === 'Categorias') {
      openWindow('categorias', 'Cadastro de Categorias', '📁');
    }
    if (menuName === 'Cadastro' && label === 'Produtos') {
      openWindow('produtos', 'Cadastro de Produtos', '🍔');
    }
    if (menuName === 'Cadastro' && label === 'Estoque...') {
      openWindow('estoque', 'Controle de Estoque', '📦');
    }
    if (menuName === 'Cadastro' && label === 'Fornecedores') {
      openWindow('fornecedores', 'Cadastro de Fornecedores', '🚚');
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
  }, [openWindow]);

  // Teclas de atalho globais
  useEffect(() => {
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
  }, [openWindow]);

  return {
    activeMenu,
    setActiveMenu,
    activeToolbarItem,
    setActiveToolbarItem,
    windows,
    activeWindowId,
    caixaAtivo,
    setCaixaAtivo,
    usuarioAtivo,
    setUsuarioAtivo,
    balancaHabilitada,
    setBalancaHabilitada,
    identificadorHabilitado,
    setIdentificadorHabilitado,
    impressoraAtiva,
    setImpressoraAtiva,
    activePopover,
    setActivePopover,
    balancaModalOpen,
    setBalancaModalOpen,
    identificadorModalOpen,
    setIdentificadorModalOpen,
    loginModalOpen,
    setLoginModalOpen,
    selectedLoginUser,
    setSelectedLoginUser,
    loginPassword,
    setLoginPassword,
    sincronizacaoIniciada,
    setSincronizacaoIniciada,
    servidorAba,
    setServidorAba,
    conectandoServidor,
    progressoConexao,
    suporteInput,
    setSuporteInput,
    suporteChat,
    
    // Ações
    handleSendSuporteMessage,
    handleIniciarSincronizacao,
    toggleMenu,
    handleClickOutside,
    focusWindow,
    openWindow,
    closeWindow,
    minimizeWindow,
    toggleMinimizeWindow,
    toggleMaximizeWindow,
    handleHeaderMouseDown,
    handleDropdownItemClick
  };
}
