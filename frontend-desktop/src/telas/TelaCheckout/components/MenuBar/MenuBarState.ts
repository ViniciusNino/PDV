import { useEffect } from 'react';

interface UseMenuBarProps {
  activeMenu: string | null;
  toggleMenu: (menuName: string) => void;
  onClose: () => void;
}

export function useMenuBar({ activeMenu, toggleMenu, onClose }: UseMenuBarProps) {
  
  // Escuta cliques globais para fechar o menu aberto
  useEffect(() => {
    if (!activeMenu) return;

    const handleGlobalClick = () => {
      onClose();
    };

    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [activeMenu, onClose]);

  // Exemplo de atalhos locais Alt para menus (Alt+A para Arquivo, Alt+C para Cadastro, etc.)
  useEffect(() => {
    const handleMnemonicKeys = (e: KeyboardEvent) => {
      if (e.altKey) {
        const key = e.key.toLowerCase();
        if (key === 'a') {
          e.preventDefault();
          toggleMenu('Arquivo');
        } else if (key === 'f') {
          e.preventDefault();
          toggleMenu('Financeiro');
        } else if (key === 'c') {
          e.preventDefault();
          toggleMenu('Cadastro');
        }
      }
    };

    window.addEventListener('keydown', handleMnemonicKeys);
    return () => {
      window.removeEventListener('keydown', handleMnemonicKeys);
    };
  }, [toggleMenu]);

  return {};
}
