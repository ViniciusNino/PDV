import { Settings, X, AlertTriangle } from 'lucide-react';
import { useTelaConfiguracao } from './TelaConfiguracaoState';
import { TabEmpresa } from './components/TabEmpresa/TabEmpresa';
import { TabImpressao } from './components/TabImpressao/TabImpressao';
import { TabSistema } from './components/TabSistema/TabSistema';
import { TabEmail } from './components/TabEmail/TabEmail';
import { BuscaClienteModal } from './components/BuscaClienteModal/BuscaClienteModal';
import './TelaConfiguracao.css';

interface TelaConfiguracaoProps {
  isModal?: boolean;
  onClose?: () => void;
  isWindowMode?: boolean;
}

export function TelaConfiguracao({ isModal = false, onClose, isWindowMode = false }: TelaConfiguracaoProps) {
  const {
    activeTab,
    setActiveTab,
    activeSubTab,
    setActiveSubTab,
    logoUrl,
    setLogoUrl,
    isSearchModalOpen,
    setIsSearchModalOpen,
    isLoading,
    error,
    themeMode,
    setThemeMode,
    themePalette,
    setThemePalette,
    company,
    setCompany,
    print,
    setPrint,
    system,
    setSystem,
    email,
    setEmail,
    handleCancel,
    handleSave
  } = useTelaConfiguracao({ isModal, onClose });

  if (isLoading) {
    return (
      <div className="settings-card glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '600px', gap: '1rem' }}>
        <div className="spinner"></div>
        <span style={{ color: '#fff', fontSize: '1.2rem', fontFamily: 'Inter, sans-serif' }}>Carregando configurações...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="settings-card glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '600px', gap: '1.5rem', padding: '2rem', textAlign: 'center' }}>
        <AlertTriangle size={48} color="#ff4a4a" />
        <span style={{ color: '#ff4a4a', fontSize: '1.2rem', fontFamily: 'Inter, sans-serif', fontWeight: 'bold' }}>{error}</span>
        <button className="btn-default" onClick={() => window.location.reload()}>Tentar Novamente</button>
      </div>
    );
  }

  const cardBody = (
    <div className={`settings-card glass-panel ${isModal ? 'settings-modal-card' : 'animate-fade-in'}`}>

      {!isWindowMode && (
        <div className="settings-header">
          <div className="header-info">
            <Settings size={24} />
            <h1>Configurações da Empresa e Sistema</h1>
          </div>
          <button className="btn-close-settings" onClick={handleCancel}>
            <X size={24} />
          </button>
        </div>
      )}

      <div className="tabs-main">
        {['Empresa', 'Impressão', 'Sistema', 'E-mail'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="settings-body" style={{ overflowY: 'auto', maxHeight: '70vh' }}>
        {activeTab === 'Empresa' && (
          <TabEmpresa 
            company={company}
            setCompany={setCompany}
            logoUrl={logoUrl}
            setLogoUrl={setLogoUrl}
            activeSubTab={activeSubTab}
            setActiveSubTab={setActiveSubTab}
            setIsSearchModalOpen={setIsSearchModalOpen}
          />
        )}

        {activeTab === 'Impressão' && (
          <TabImpressao 
            print={print}
            setPrint={setPrint}
          />
        )}

        {activeTab === 'Sistema' && (
          <TabSistema 
            system={system}
            setSystem={setSystem}
            themeMode={themeMode}
            setThemeMode={setThemeMode}
            themePalette={themePalette}
            setThemePalette={setThemePalette}
          />
        )}

        {activeTab === 'E-mail' && (
          <TabEmail 
            email={email}
            setEmail={setEmail}
          />
        )}
      </div>

      <div className="settings-footer">
        <button className="btn-default" onClick={() => handleSave(true)}>Ok</button>
        <button className="btn-default" onClick={() => handleSave(false)}>Aplicar</button>
        <button className="btn-default" onClick={handleCancel}>Cancelar</button>
      </div>

    </div>
  );

  return (
    <>
      {isModal ? (
        <div className="settings-modal-overlay" onClick={handleCancel}>
          <div className="settings-modal-wrapper animate-slide-up" onClick={e => e.stopPropagation()}>
            {cardBody}
          </div>
        </div>
      ) : (
        cardBody
      )}

      {isSearchModalOpen && (
        <BuscaClienteModal 
          onClose={() => setIsSearchModalOpen(false)}
        />
      )}
    </>
  );
}
