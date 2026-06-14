import { useState } from 'react';
import { Building2, FileText, Phone, Share2, MoreHorizontal } from 'lucide-react';
import type { CompanyConfig } from '../../../TelaConfiguracao/TelaConfiguracaoState';
import { SubBasicoCliente } from '../../../TelaClientes/components/FormularioCliente/subtabs/SubBasicoCliente/SubBasicoCliente';
import { SubDocumentosCliente } from '../../../TelaClientes/components/FormularioCliente/subtabs/SubDocumentosCliente/SubDocumentosCliente';
import { SubContatoCliente } from '../../../TelaClientes/components/FormularioCliente/subtabs/SubContatoCliente/SubContatoCliente';
import { SubSocialCliente } from '../../../TelaClientes/components/FormularioCliente/subtabs/SubSocialCliente/SubSocialCliente';
import { SubOutrosCliente } from '../../../TelaClientes/components/FormularioCliente/subtabs/SubOutrosCliente/SubOutrosCliente';
import { SubEnderecoCliente } from '../../../TelaClientes/components/FormularioCliente/subtabs/SubEnderecoCliente/SubEnderecoCliente';
import '../../../TelaClientes/components/FormularioCliente/FormularioCliente.css';
import './FormularioFornecedor.css';

interface FormularioFornecedorProps {
  formData: CompanyConfig;
  setFormData: React.Dispatch<React.SetStateAction<CompanyConfig>>;
  logoUrl: string | null;
  setLogoUrl: React.Dispatch<React.SetStateAction<string | null>>;
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
  setIsSearchModalOpen: (open: boolean) => void;
  onNovo: () => void;
  onSalvar: () => void;
  onCancelar: () => void;
  selectedId: string | null;
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
  onNovo,
  onSalvar,
  onCancelar,
  selectedId
}: FormularioFornecedorProps) {
  const [showEndereco, setShowEndereco] = useState(true);

  return (
    <div className="cliente-form-wrapper">
      {/* Sub-abas */}
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

      {/* Conteúdo da sub-aba */}
      <div className="cliente-form-content">
        {activeSubTab === 'Basico' && (
          <SubBasicoCliente
            formData={formData}
            setFormData={setFormData}
            logoUrl={logoUrl}
            setLogoUrl={setLogoUrl}
            entityType="fornecedor"
          />
        )}
        {activeSubTab === 'Documentos' && (
          <SubDocumentosCliente
            formData={formData}
            setFormData={setFormData}
            entityType="fornecedor"
          />
        )}
        {activeSubTab === 'Contato' && (
          <SubContatoCliente
            formData={formData}
            setFormData={setFormData}
            entityType="fornecedor"
          />
        )}
        {activeSubTab === 'Social' && (
          <SubSocialCliente
            formData={formData}
            setFormData={setFormData}
          />
        )}
        {activeSubTab === 'Outros' && (
          <SubOutrosCliente
            formData={formData}
            setFormData={setFormData}
            entityType="fornecedor"
            setIsSearchModalOpen={setIsSearchModalOpen}
          />
        )}

        {/* Endereço e botões CRUD integrados como na TelaClientes */}
        <SubEnderecoCliente
          formData={formData}
          setFormData={setFormData}
          showEndereco={showEndereco}
          setShowEndereco={setShowEndereco}
          selectedId={selectedId}
          onNovo={onNovo}
          onSalvar={onSalvar}
          onCancelar={onCancelar}
          onExcluir={() => {}}
          entityType="fornecedor"
        />
      </div>
    </div>
  );
}
