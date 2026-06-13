import { Key, Wrench, FolderOpen } from 'lucide-react';
import type { SystemConfig } from '../../TelaConfiguracaoState';
import { useTabSistema } from './TabSistemaState';
import './TabSistema.css';

interface TabSistemaProps {
  system: SystemConfig;
  setSystem: React.Dispatch<React.SetStateAction<SystemConfig>>;
  themeMode: string;
  setThemeMode: (mode: string) => void;
  themePalette: string;
  setThemePalette: (palette: string) => void;
}

export function TabSistema({
  system,
  setSystem,
  themeMode,
  setThemeMode,
  themePalette,
  setThemePalette
}: TabSistemaProps) {
  useTabSistema();

  return (
    <div className="system-tab-content">
      <div className="section-title-line">
        <span className="section-label">Comportamento</span>
        <div className="title-line"></div>
      </div>
      <div className="system-grid">
        <div className="system-column">
          <div className="checkbox-with-input">
            <label className="custom-checkbox-label">
              <input
                type="checkbox"
                checked={!!system.autoLogout}
                onChange={(e) => setSystem(prev => ({ ...prev, autoLogout: e.target.checked }))}
              />
              <span className="checkbox-text">Fazer logout automaticamente após inatividade</span>
            </label>
            <div className={`inline-input ${!system.autoLogout ? 'disabled' : ''}`}>
              <input
                type="number"
                value={system.autoLogoutTime || 3}
                min={1}
                max={60}
                onChange={(e) => setSystem(prev => ({ ...prev, autoLogoutTime: Math.min(60, Math.max(1, parseInt(e.target.value) || 1)) }))}
                disabled={!system.autoLogout}
              />
              <span>min</span>
            </div>
          </div>
          {[
            'Comanda pré-paga', 'Mostrar produtos cancelados nas vendas', 'Lembrar o último atendente nas vendas',
            'Permitir estoque negativo', 'Exibir a tela de venda rápida em tela cheia', 'Realizar backup automaticamente',
            'Comissão na venda balcão', 'Fazer logout no tablet após lançar pedido', 'Abrir comanda sem solicitar cliente',
            'Reservar mesas ao juntar'
          ].map((item, i) => {
            const key = [
              'comandaPrePaga', 'mostrarProdutosCanceladosNasVendas', 'lembrarUltimoAtendenteNasVendas',
              'permitirEstoqueNegativo', 'exibirTelaVendaRapidaEmTelaCheia', 'realizarBackupAutomaticamente',
              'comissaoNaVendaBalcao', 'fazerLogoutNoTabletAposLancadoPedido', 'abrirComandaSemSolicitarCliente',
              'reservarMesasAoJuntar'
            ][i] as keyof SystemConfig;
            return (
              <label key={i} className="custom-checkbox-label">
                <input
                  type="checkbox"
                  checked={!!system[key]}
                  onChange={(e) => setSystem(prev => ({ ...prev, [key]: e.target.checked } as any))}
                />
                <span className="checkbox-text">{item}</span>
              </label>
            );
          })}
        </div>
        <div className="system-column">
          {[
            'Redirecionar para a mesa principal', 'Observação como nome de comanda', 'Confirmar ao lançar quantidades elevadas',
            'Mostrar campos fiscais e tributários', 'Pesar produto ao selecionar comanda', 'Obrigar informar motivo de cancelamentos',
            'Fazer logout após lançar pedido do desktop', 'Fila de pesagem nas comandas', 'Aceitar pedidos delivery automaticamente',
            'Desativar avisos de estoque abaixo do mínimo', 'Controlar lote do estoque'
          ].map((item, i) => {
            const key = [
              'redirecionarParaAMesaPrincipal', 'observacaoComoNomeDeComanda', 'confirmarAoLancandoQuantidadesElevadas',
              'mostrarCamposFiscaisETributarios', 'pesarProdutoAoSelecionarComanda', 'obrigarInformarMotivoDeCancelamentos',
              'fazerLogoutAposLancadoPedidoDoDesktop', 'filaDePesagemNasComandas', 'aceitarPedidosDeliveryAutomaticamente',
              'desativarAvisosDeEstoqueAbaixoDoMinimo', 'controlarLoteDoEstoque'
            ][i] as keyof SystemConfig;
            return (
              <label key={i} className="custom-checkbox-label">
                <input
                  type="checkbox"
                  checked={!!system[key]}
                  onChange={(e) => setSystem(prev => ({ ...prev, [key]: e.target.checked } as any))}
                />
                <span className="checkbox-text">{item}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="field-group" style={{ marginTop: '1rem' }}>
        <label>Dropbox (Token de acesso):</label>
        <div className="icon-input-wrapper">
          <Key size={18} className="input-icon" />
          <input
            type="text"
            value={system.dropboxToken || ''}
            onChange={e => setSystem(prev => ({ ...prev, dropboxToken: e.target.value }))}
          />
          <Wrench size={18} className="action-icon" />
        </div>
      </div>

      <div className="section-title-line" style={{ marginTop: '1.5rem' }}>
        <span className="section-label">Dispositivos</span>
        <div className="title-line"></div>
      </div>
      <div className="devices-grid">
        <div className="device-item">
          <label className="custom-checkbox-label">
            <input
              type="checkbox"
              checked={!!system.habilitarUsoDeBalanca}
              onChange={e => setSystem(prev => ({ ...prev, habilitarUsoDeBalanca: e.target.checked }))}
            />
            <span className="checkbox-text">Habilitar o uso de balança</span>
          </label>
          <Wrench size={18} className="action-icon-static" />
        </div>
        <div className="device-item tef-item">
          <div className="tef-box">
            <span className="encryption-label">TEF</span>
            <div className="radio-group-horizontal">
              <label className="custom-radio-label">
                <input
                  type="radio"
                  name="tef"
                  checked={system.tefType === 'Nenhuma'}
                  onChange={() => setSystem(prev => ({ ...prev, tefType: 'Nenhuma' }))}
                /> Nenhuma
              </label>
              <label className="custom-radio-label">
                <input
                  type="radio"
                  name="tef"
                  checked={system.tefType === 'Scope'}
                  onChange={() => setSystem(prev => ({ ...prev, tefType: 'Scope' }))}
                /> Scope
              </label>
              <label className="custom-radio-label">
                <input
                  type="radio"
                  name="tef"
                  checked={system.tefType === 'SiTef'}
                  onChange={() => setSystem(prev => ({ ...prev, tefType: 'SiTef' }))}
                /> SiTef
              </label>
            </div>
            <Wrench size={18} className="action-icon-static" style={{ marginLeft: '1rem' }} />
          </div>
          <FolderOpen size={18} className="action-icon-static" style={{ marginLeft: '1rem' }} />
        </div>
        <div className="device-item full-row">
          <label className="custom-checkbox-label">
            <input
              type="checkbox"
              checked={!!system.habilitarIdentificadorDeChamadas}
              onChange={(e) => setSystem(prev => ({ ...prev, habilitarIdentificadorDeChamadas: e.target.checked }))}
            />
            <span className="checkbox-text">Habilitar identificador de chamadas</span>
          </label>
          <label className="custom-checkbox-label" style={{ marginLeft: '2rem' }}>
            <input
              type="checkbox"
              checked={!!system.habilitarEventosParaCatraca}
              onChange={(e) => setSystem(prev => ({ ...prev, habilitarEventosParaCatraca: e.target.checked }))}
            />
            <span className="checkbox-text">Habilitar eventos para catraca</span>
          </label>
        </div>
        <div className="field-group" style={{ width: '200px', marginLeft: '2rem' }}>
          <label>Tipo de dispositivo:</label>
          <select
            disabled={!system.habilitarIdentificadorDeChamadas}
            value={system.tipoDispositivoIdentificador || 'Identificador'}
            onChange={e => setSystem(prev => ({ ...prev, tipoDispositivoIdentificador: e.target.value }))}
          >
            <option>Identificador</option>
            <option>Modem</option>
            <option>Icebox</option>
          </select>
        </div>
      </div>

      <div className="section-title-line" style={{ marginTop: '1.5rem' }}>
        <span className="section-label">Aparência do Sistema</span>
        <div className="title-line"></div>
      </div>
      <div className="form-row-2col" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div className="field-group" style={{ flex: 1 }}>
          <label>Tema de Fundo:</label>
          <select
            value={themeMode}
            onChange={e => setThemeMode(e.target.value)}
          >
            <option value="light">Claro</option>
            <option value="dark">Escuro</option>
          </select>
        </div>
        <div className="field-group" style={{ flex: 1 }}>
          <label>Estilo Visual (Paleta):</label>
          <select
            value={themePalette}
            onChange={e => setThemePalette(e.target.value)}
          >
            <option value="amber">Amber Bistro</option>
            <option value="emerald">Modern Emerald</option>
            <option value="indigo">Indigo Minimalist</option>
            <option value="nordic">Nordic Glacial</option>
          </select>
        </div>
      </div>
    </div>
  );
}
