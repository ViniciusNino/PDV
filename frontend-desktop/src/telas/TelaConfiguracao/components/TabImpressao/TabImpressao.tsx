import { useTabImpressao } from './TabImpressaoState';
import './TabImpressao.css';

interface TabImpressaoProps {
  print: Record<string, boolean>;
  setPrint: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export function TabImpressao({ print, setPrint }: TabImpressaoProps) {
  useTabImpressao();

  return (
    <div className="print-tab-content">
      <div className="print-column">
        <div className="section-title-line">
          <span className="section-label">Aparência</span>
          <div className="title-line"></div>
        </div>
        <div className="checkbox-list">
          {[
            'Imprimir o CNPJ', 'Imprimir o endereço', 'Imprimir o telefone 1', 'Imprimir o telefone 2',
            'Imprimir todos os garçons', 'Imprimir garçons no relatório', 'Imprimir o(a) atendente de caixa',
            'Imprimir slogan', 'Imprimir permanência', 'Imprimir logo da empresa', 'Imprimir divisão da conta',
            'Imprimir o código nos serviços', 'Imprimir os detalhes do produto', 'Imprimir local e atendente separados',
            'Imprimir gráficos em 3D', 'Imprimir produtos no fechamento', 'Imprimir serviços em letra grande',
            'Imprimir serviços detalhadamente', 'Imprimir endereço destacado', 'Imprimir local destacado',
            'Imprimir local nos serviços', 'Imprimir cliente nos serviços', 'Imprimir pedidos cancelados no fechamento'
          ].map((item, i) => {
            const key = [
              'printCnpj', 'printAddress', 'printPhone1', 'printPhone2',
              'printAllWaiters', 'printWaitersInReport', 'printCashierAttendant',
              'printSlogan', 'printPermanence', 'printCompanyLogo', 'printAccountDivision',
              'printCodeInServices', 'printProductDetails', 'printSeparateLocalAndAttendant',
              'print3DGraphs', 'printProductsOnClosure', 'printServicesInLargeFont',
              'printDetailedServices', 'printHighlightedAddress', 'printHighlightedLocal',
              'printLocalInServices', 'printClientInServices', 'printCanceledOrdersOnClosure'
            ][i];
            return (
              <label key={i} className="custom-checkbox-label">
                <input
                  type="checkbox"
                  checked={!!print[key]}
                  onChange={(e) => setPrint(prev => ({ ...prev, [key]: e.target.checked }))}
                />
                <span className="checkbox-text">{item}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="column-divider"></div>

      <div className="print-column">
        <div className="checkbox-list" style={{ marginTop: '1.5rem' }}>
          {[
            'Imprimir observação do pedido nos serviços', 'Imprimir observações no pedido', 'Imprimir pacotes agrupados',
            'Imprimir linha separadora de serviços', 'Imprimir saldo restante da comanda nos serviços'
          ].map((item, i) => {
            const key = [
              'printOrderObservationInServices', 'printObservationsOnOrder', 'printGroupedPackages',
              'printServiceSeparatorLine', 'printComandaRemainingBalanceInServices'
            ][i];
            return (
              <label key={i} className="custom-checkbox-label">
                <input
                  type="checkbox"
                  checked={!!print[key]}
                  onChange={(e) => setPrint(prev => ({ ...prev, [key]: e.target.checked }))}
                />
                <span className="checkbox-text">{item}</span>
              </label>
            );
          })}
        </div>

        <div className="section-title-line" style={{ marginTop: '1rem' }}>
          <span className="section-label">Guias</span>
          <div className="title-line"></div>
        </div>
        <div className="checkbox-list">
          {[
            'Imprimir fechamento de caixa', 'Imprimir comprovante de contas', 'Imprimir cancelamento de preparo',
            'Imprimir operações financeiras', 'Imprimir guia de pagamento', 'Imprimir senha para painéis',
            'Imprimir senha nas comandas', 'Imprimir endereço de entrega antecipadamente', 'Imprimir conta ao fechar pedidos',
            'Imprimir 2ª via do cupom de entrega', 'Imprimir resumo de cancelamento', 'Imprimir conferência de produção'
          ].map((item, i) => {
            const key = [
              'printCashierClosure', 'printAccountReceipt', 'printPrepCancellation',
              'printFinancialOperations', 'printPaymentGuide', 'printPanelPassword',
              'printComandaPassword', 'printDeliveryAddressInAdvance', 'printAccountOnCloseOrders',
              'printDeliveryCouponSecondCopy', 'printCancellationSummary', 'printProductionConference'
            ][i];
            return (
              <label key={i} className="custom-checkbox-label">
                <input
                  type="checkbox"
                  checked={!!print[key]}
                  onChange={(e) => setPrint(prev => ({ ...prev, [key]: e.target.checked }))}
                />
                <span className="checkbox-text">{item}</span>
              </label>
            );
          })}
        </div>

        <div className="section-title-line" style={{ marginTop: '1rem' }}>
          <span className="section-label">Comportamento</span>
          <div className="title-line"></div>
        </div>
        <div className="checkbox-list">
          <label className="custom-checkbox-label">
            <input
              type="checkbox"
              checked={!!print.showPrintQuestion}
              onChange={(e) => setPrint(prev => ({ ...prev, showPrintQuestion: e.target.checked }))}
            />
            <span className="checkbox-text">Exibir pergunta de impressão</span>
          </label>
          <label className="custom-checkbox-label">
            <input
              type="checkbox"
              checked={!!print.printServicesWithoutAsking}
              onChange={(e) => setPrint(prev => ({ ...prev, printServicesWithoutAsking: e.target.checked }))}
            />
            <span className="checkbox-text">Imprimir serviços sem perguntar</span>
          </label>
        </div>
      </div>
    </div>
  );
}
