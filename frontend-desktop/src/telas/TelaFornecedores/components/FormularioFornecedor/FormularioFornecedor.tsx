import { Building2, FileText, Phone, Share2, MoreHorizontal } from 'lucide-react';
import type { CompanyConfig } from '../../../TelaConfiguracao/TelaConfiguracaoState';
import { SubBasico } from '../../../TelaConfiguracao/components/TabEmpresa/SubBasico/SubBasico';
import { SubDocumentos } from '../../../TelaConfiguracao/components/TabEmpresa/SubDocumentos/SubDocumentos';
import { SubContato } from '../../../TelaConfiguracao/components/TabEmpresa/SubContato/SubContato';
import { SubSocial } from '../../../TelaConfiguracao/components/TabEmpresa/SubSocial/SubSocial';
import { SubOutros } from '../../../TelaConfiguracao/components/TabEmpresa/SubOutros/SubOutros';
import { SubEndereco } from '../../../TelaConfiguracao/components/TabEmpresa/SubEndereco/SubEndereco';
import { useFormularioFornecedor } from './FormularioFornecedorState';
import './FormularioFornecedor.css';

interface FormularioFornecedorProps {
  formData: CompanyConfig;
  setFormData: React.Dispatch<React.SetStateAction<CompanyConfig>>;
  logoUrl: string | null;
  setLogoUrl: React.Dispatch<React.SetStateAction<string | null>>;
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
  setIsSearchModalOpen: (open: boolean) => void;
  setError: (msg: string) => void;
}

const SUB_TABS = [
  { key: 'Basico',     icon: <Building2 size={14} />,     label: 'Básico' },
  { key: 'Documentos', icon: <FileText size={14} />,       label: 'Documentos' },
  { key: 'Contato',    icon: <Phone size={14} />,          label: 'Contato' },
  { key: 'Social',     icon: <Share2 size={14} />,         label: 'Social' },
  { key: 'Outros',     icon: <MoreHorizontal size={14} />, label: 'Outros' },
];

export function FormularioFornecedor({
  formData,
  setFormData,
  logoUrl,
  setLogoUrl,
  activeSubTab,
  setActiveSubTab,
  setIsSearchModalOpen,
  setError,
}: FormularioFornecedorProps) {

  return (
    <div className="fornec-form-wrapper">
      {/* Sub-abas */}
      <div className="fornec-subtabs">
        {SUB_TABS.map(({ key, icon, label }) => (
          <button
            key={key}
            type="button"
            className={`fornec-subtab-btn ${activeSubTab === key ? 'active' : ''}`}
            onClick={() => setActiveSubTab(key)}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* Conteúdo da sub-aba */}
      <div className="fornec-form-content">
        {activeSubTab === 'Basico' && (
          <SubBasico
            company={formData}
            setCompany={setFormData}
            logoUrl={logoUrl}
            setLogoUrl={setLogoUrl}
          />
        )}
        {activeSubTab === 'Documentos' && (
          <SubDocumentos company={formData} setCompany={setFormData} />
        )}
        {activeSubTab === 'Contato' && (
          <SubContato company={formData} setCompany={setFormData} />
        )}
        {activeSubTab === 'Social' && (
          <SubSocial company={formData} setCompany={setFormData} />
        )}
        {activeSubTab === 'Outros' && (
          <SubOutros
            company={formData}
            setCompany={setFormData}
            setIsSearchModalOpen={setIsSearchModalOpen}
          />
        )}

        {/* Endereço: sempre visível na parte inferior, igual à TabEmpresa */}
        <SubEndereco company={formData} setCompany={setFormData} />
      </div>
    </div>
  );
}
