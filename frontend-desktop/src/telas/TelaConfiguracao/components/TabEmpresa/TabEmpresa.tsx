import { Building2, FileText, Phone, Share2, MoreHorizontal } from 'lucide-react';
import type { CompanyConfig } from '../../TelaConfiguracaoState';
import { SubBasico } from './SubBasico/SubBasico';
import { SubDocumentos } from './SubDocumentos/SubDocumentos';
import { SubContato } from './SubContato/SubContato';
import { SubSocial } from './SubSocial/SubSocial';
import { SubOutros } from './SubOutros/SubOutros';
import { SubEndereco } from './SubEndereco/SubEndereco';
import './TabEmpresa.css';

interface TabEmpresaProps {
  company: CompanyConfig;
  setCompany: React.Dispatch<React.SetStateAction<CompanyConfig>>;
  logoUrl: string | null;
  setLogoUrl: React.Dispatch<React.SetStateAction<string | null>>;
  activeSubTab: string;
  setActiveSubTab: (subTab: string) => void;
  setIsSearchModalOpen: (open: boolean) => void;
}

const SUB_TABS = [
  { key: 'Basico',     icon: <Building2 size={16} />,     label: 'Básico' },
  { key: 'Documentos', icon: <FileText size={16} />,       label: 'Documentos' },
  { key: 'Contato',    icon: <Phone size={16} />,          label: 'Contato' },
  { key: 'Social',     icon: <Share2 size={16} />,         label: 'Social' },
  { key: 'Outros',     icon: <MoreHorizontal size={16} />, label: 'Outros' },
];

export function TabEmpresa({
  company,
  setCompany,
  logoUrl,
  setLogoUrl,
  activeSubTab,
  setActiveSubTab,
  setIsSearchModalOpen
}: TabEmpresaProps) {
  return (
    <>
      {/* Navegação de sub-abas */}
      <div className="subtabs">
        {SUB_TABS.map(({ key, icon, label }) => (
          <button
            key={key}
            type="button"
            className={`subtab-btn ${activeSubTab === key ? 'active' : ''}`}
            onClick={() => setActiveSubTab(key)}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* Conteúdo da sub-aba ativa */}
      {activeSubTab === 'Basico'     && <SubBasico     company={company} setCompany={setCompany} logoUrl={logoUrl} setLogoUrl={setLogoUrl} />}
      {activeSubTab === 'Documentos' && <SubDocumentos company={company} setCompany={setCompany} />}
      {activeSubTab === 'Contato'    && <SubContato    company={company} setCompany={setCompany} />}
      {activeSubTab === 'Social'     && <SubSocial     company={company} setCompany={setCompany} />}
      {activeSubTab === 'Outros'     && <SubOutros     company={company} setCompany={setCompany} setIsSearchModalOpen={setIsSearchModalOpen} />}

      {/* Endereço — sempre visível */}
      <SubEndereco company={company} setCompany={setCompany} />
    </>
  );
}
