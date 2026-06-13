import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useMenuBar } from './MenuBarState';
import { menusData } from '../../TelaCheckoutState';
import './MenuBar.css';

interface MenuBarProps {
  activeMenu: string | null;
  setActiveMenu: (menuName: string | null) => void;
  toggleMenu: (menuName: string) => void;
  handleDropdownItemClick: (menuName: string, label: string) => void;
}

export function MenuBar({
  activeMenu,
  setActiveMenu,
  toggleMenu,
  handleDropdownItemClick
}: MenuBarProps) {
  
  useMenuBar({
    activeMenu,
    toggleMenu,
    onClose: () => setActiveMenu(null)
  });

  return (
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
  );
}
