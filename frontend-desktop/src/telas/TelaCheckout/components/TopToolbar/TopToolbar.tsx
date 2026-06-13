import { 
  toolbarGroup1, 
  toolbarGroup2, 
  toolbarGroup3
} from './TopToolbarState';
import type { ToolbarItem } from './TopToolbarState';
import './TopToolbar.css';

interface TopToolbarProps {
  activeToolbarItem: string;
  setActiveToolbarItem: (item: string) => void;
  openWindow: (id: string, title: string, icon: string) => void;
}

export function TopToolbar({
  activeToolbarItem,
  setActiveToolbarItem,
  openWindow
}: TopToolbarProps) {
  
  const handleItemClick = (item: ToolbarItem) => {
    setActiveToolbarItem(item.id);
    if (item.mdiId !== 'pdv') {
      openWindow(item.mdiId, item.title, item.emoji);
    }
  };

  return (
    <header className="checkout-topbar">
      <div className="toolbar-menu">
        {toolbarGroup1.map(item => (
          <button 
            key={item.id}
            className={`toolbar-btn ${activeToolbarItem === item.id ? 'active' : ''}`}
            onClick={() => handleItemClick(item)}
          >
            <div className="toolbar-icon-wrapper">
              <img src={item.icon3d} alt={item.id} className="toolbar-icon-3d" />
            </div>
            <span>{item.id}</span>
          </button>
        ))}
        
        <div className="toolbar-divider"></div>
        
        {toolbarGroup2.map(item => (
          <button 
            key={item.id}
            className={`toolbar-btn ${activeToolbarItem === item.id ? 'active' : ''}`}
            onClick={() => handleItemClick(item)}
          >
            <div className="toolbar-icon-wrapper">
              <img src={item.icon3d} alt={item.id} className="toolbar-icon-3d" />
            </div>
            <span>{item.id}</span>
          </button>
        ))}
        
        <div className="toolbar-divider"></div>
        
        {toolbarGroup3.map(item => (
          <button 
            key={item.id}
            className={`toolbar-btn ${activeToolbarItem === item.id ? 'active' : ''}`}
            onClick={() => handleItemClick(item)}
          >
            <div className="toolbar-icon-wrapper">
              <img src={item.icon3d} alt={item.id} className="toolbar-icon-3d" />
            </div>
            <span>{item.id}</span>
          </button>
        ))}
      </div>
    </header>
  );
}
