using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NinoPDV.Api.Models;

public class PrintSetting : BaseEntity
{
    public Guid CompanyId { get; set; }
    [ForeignKey(nameof(CompanyId))]
    public virtual Company? Company { get; set; }

    // Aparência
    public bool PrintCnpj { get; set; } = true;
    public bool PrintAddress { get; set; } = true;
    public bool PrintPhone1 { get; set; } = true;
    public bool PrintPhone2 { get; set; } = true;
    public bool PrintAllWaiters { get; set; } = false;
    public bool PrintWaitersInReport { get; set; } = true;
    public bool PrintCashierAttendant { get; set; } = true;
    public bool PrintSlogan { get; set; } = true;
    public bool PrintPermanence { get; set; } = true;
    public bool PrintCompanyLogo { get; set; } = false;
    public bool PrintAccountDivision { get; set; } = true;
    public bool PrintCodeInServices { get; set; } = false;
    public bool PrintProductDetails { get; set; } = false;
    public bool PrintSeparateLocalAndAttendant { get; set; } = false;
    public bool Print3DGraphs { get; set; } = true;
    public bool PrintProductsOnClosure { get; set; } = false;
    public bool PrintServicesInLargeFont { get; set; } = false;
    public bool PrintDetailedServices { get; set; } = true;
    public bool PrintHighlightedAddress { get; set; } = true;
    public bool PrintHighlightedLocal { get; set; } = true;
    public bool PrintLocalInServices { get; set; } = true;
    public bool PrintClientInServices { get; set; } = true;
    public bool PrintCanceledOrdersOnClosure { get; set; } = false;

    // Observações
    public bool PrintOrderObservationInServices { get; set; } = true;
    public bool PrintObservationsOnOrder { get; set; } = true;
    public bool PrintGroupedPackages { get; set; } = true;
    public bool PrintServiceSeparatorLine { get; set; } = false;
    public bool PrintComandaRemainingBalanceInServices { get; set; } = false;

    // Guias
    public bool PrintCashierClosure { get; set; } = true;
    public bool PrintAccountReceipt { get; set; } = true;
    public bool PrintPrepCancellation { get; set; } = true;
    public bool PrintFinancialOperations { get; set; } = true;
    public bool PrintPaymentGuide { get; set; } = true;
    public bool PrintPanelPassword { get; set; } = false;
    public bool PrintComandaPassword { get; set; } = false;
    public bool PrintDeliveryAddressInAdvance { get; set; } = false;
    public bool PrintAccountOnCloseOrders { get; set; } = true;
    public bool PrintDeliveryCouponSecondCopy { get; set; } = false;
    public bool PrintCancellationSummary { get; set; } = false;
    public bool PrintProductionConference { get; set; } = false;

    // Comportamento
    public bool ShowPrintQuestion { get; set; } = false;
    public bool PrintServicesWithoutAsking { get; set; } = true;
}
