import { User, FileText, Phone, Share2, MoreHorizontal } from 'lucide-react';
import { SubBasicoCliente } from './subtabs/SubBasicoCliente/SubBasicoCliente';
import { SubDocumentosCliente } from './subtabs/SubDocumentosCliente/SubDocumentosCliente';
import { SubContatoCliente } from './subtabs/SubContatoCliente/SubContatoCliente';
import { SubSocialCliente } from './subtabs/SubSocialCliente/SubSocialCliente';
import { SubOutrosCliente } from './subtabs/SubOutrosCliente/SubOutrosCliente';
import { SubEnderecoCliente } from './subtabs/SubEnderecoCliente/SubEnderecoCliente';
import './FormularioCliente.css';

interface FormularioClienteProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  logoUrl: string | null;
  setLogoUrl: React.Dispatch<React.SetStateAction<string | null>>;
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
  showEndereco: boolean;
  setShowEndereco: (show: boolean) => void;
  selectedId: string | null;
  onNovo: () => void;
  onSalvar: () => void;
  onCancelar: () => void;
  onExcluir: () => void;
  setIsLocalizacoesOpen: (open: boolean) => void;
}

const SUB_TABS = [
  { key: 'Basico',     icon: <User size={14} />,           label: 'Básico' },
  { key: 'Documentos', icon: <FileText size={14} />,       label: 'Documentos' },
  { key: 'Contato',    icon: <Phone size={14} />,          label: 'Contato' },
  { key: 'Social',     icon: <Share2 size={14} />,         label: 'Social' },
  { key: 'Outros',     icon: <MoreHorizontal size={14} />, label: 'Outros' },
];

export function FormularioCliente({
  formData,
  setFormData,
  logoUrl,
  setLogoUrl,
  activeSubTab,
  setActiveSubTab,
  showEndereco,
  setShowEndereco,
  selectedId,
  onNovo,
  onSalvar,
  onCancelar,
  onExcluir,
  setIsLocalizacoesOpen
}: FormularioClienteProps) {
  return (
    <div className="cliente-form-wrapper">
      {/* Abas Superiores */}
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

      {/* Conteúdo da Aba Selecionada */}
      <div className="cliente-form-content">
        {activeSubTab === 'Basico' && (
          <SubBasicoCliente
            formData={formData}
            setFormData={setFormData}
            logoUrl={logoUrl}
            setLogoUrl={setLogoUrl}
          />
        )}
        {activeSubTab === 'Documentos' && (
          <SubDocumentosCliente
            formData={formData}
            setFormData={setFormData}
          />
        )}
        {activeSubTab === 'Contato' && (
          <SubContatoCliente
            formData={formData}
            setFormData={setFormData}
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
          />
        )}

        {/* Endereço Principal e Ações CRUD (sempre visíveis na parte inferior) */}
        <SubEnderecoCliente
          formData={formData}
          setFormData={setFormData}
          showEndereco={showEndereco}
          setShowEndereco={setShowEndereco}
          selectedId={selectedId}
          onNovo={onNovo}
          onSalvar={onSalvar}
          onCancelar={onCancelar}
          onExcluir={onExcluir}
          setIsLocalizacoesOpen={setIsLocalizacoesOpen}
        />
      </div>
    </div>
  );
}
