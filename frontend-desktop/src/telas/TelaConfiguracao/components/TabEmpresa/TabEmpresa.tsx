import { useState } from 'react';
import { Building2, FileText, Phone, Share2, MoreHorizontal } from 'lucide-react';
import type { CompanyConfig } from '../../TelaConfiguracaoState';
import { SubBasicoCliente } from '../../../TelaClientes/components/FormularioCliente/subtabs/SubBasicoCliente/SubBasicoCliente';
import { SubDocumentosCliente } from '../../../TelaClientes/components/FormularioCliente/subtabs/SubDocumentosCliente/SubDocumentosCliente';
import { SubContatoCliente } from '../../../TelaClientes/components/FormularioCliente/subtabs/SubContatoCliente/SubContatoCliente';
import { SubSocialCliente } from '../../../TelaClientes/components/FormularioCliente/subtabs/SubSocialCliente/SubSocialCliente';
import { SubOutrosCliente } from '../../../TelaClientes/components/FormularioCliente/subtabs/SubOutrosCliente/SubOutrosCliente';
import { SubEnderecoCliente } from '../../../TelaClientes/components/FormularioCliente/subtabs/SubEnderecoCliente/SubEnderecoCliente';
import '../../../TelaClientes/components/FormularioCliente/FormularioCliente.css';
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
  const [showEndereco, setShowEndereco] = useState(true);

  return (
    <>
      {/* Navegação de sub-abas */}
      <div className="cliente-subtabs">
        {SUB_TABS.map(({ key, icon, label }) => (
          <button
            key={key}
            type="button"
            className={`cliente-subtab-btn ${activeSubTab === key ? 'active' : ''}`}
            onClick={() => setActiveSubTab(key)}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* Conteúdo da sub-aba ativa */}
      {activeSubTab === 'Basico' && (
        <SubBasicoCliente
          formData={company}
          setFormData={setCompany}
          logoUrl={logoUrl}
          setLogoUrl={setLogoUrl}
          entityType="fornecedor"
        />
      )}
      {activeSubTab === 'Documentos' && (
        <SubDocumentosCliente
          formData={company}
          setFormData={setCompany}
          entityType="fornecedor"
        />
      )}
      {activeSubTab === 'Contato' && (
        <SubContatoCliente
          formData={company}
          setFormData={setCompany}
          entityType="fornecedor"
        />
      )}
      {activeSubTab === 'Social' && (
        <SubSocialCliente
          formData={company}
          setFormData={setCompany}
        />
      )}
      {activeSubTab === 'Outros' && (
        <SubOutrosCliente
          formData={company}
          setFormData={setCompany}
          entityType="fornecedor"
          setIsSearchModalOpen={setIsSearchModalOpen}
        />
      )}

      {/* Endereço — sempre visível, sem os botões de ação duplicados */}
      <SubEnderecoCliente
        formData={company}
        setFormData={setCompany}
        showEndereco={showEndereco}
        setShowEndereco={setShowEndereco}
        selectedId={null}
        showActions={false}
        entityType="fornecedor"
      />
    </>
  );
}
