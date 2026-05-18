using System;

namespace NinoPDV.Api.DTOs;

public record CompanyDTO(
    string TradingName,
    string CompanyName,
    string Phone,
    string? Cellphone,
    string? Email,
    string? Slogan,
    string? Cnpj,
    string? StateRegistration,
    string? MunicipalRegistration,
    DateTime? FoundationDate,
    string? LogoUrl,
    decimal PurchaseLimit,
    string? Shareholder,
    
    // Endereço
    string Cep,
    string State,
    string City,
    string Neighborhood,
    string? LocationType,
    string Street,
    string Number,
    string? Complement,
    string? ReferencePoint
);

public record PrintSettingDTO(
    bool PrintCnpj,
    bool PrintAddress,
    bool PrintPhone1,
    bool PrintPhone2,
    bool PrintAllWaiters,
    bool PrintWaitersInReport,
    bool PrintCashierAttendant,
    bool PrintSlogan,
    bool PrintPermanence,
    bool PrintCompanyLogo,
    bool PrintAccountDivision,
    bool PrintCodeInServices,
    bool PrintProductDetails,
    bool PrintSeparateLocalAndAttendant,
    bool Print3DGraphs,
    bool PrintProductsOnClosure,
    bool PrintServicesInLargeFont,
    bool PrintDetailedServices,
    bool PrintHighlightedAddress,
    bool PrintHighlightedLocal,
    bool PrintLocalInServices,
    bool PrintClientInServices,
    bool PrintCanceledOrdersOnClosure,
    
    // Observações
    bool PrintOrderObservationInServices,
    bool PrintObservationsOnOrder,
    bool PrintGroupedPackages,
    bool PrintServiceSeparatorLine,
    bool PrintComandaRemainingBalanceInServices,
    
    // Guias
    bool PrintCashierClosure,
    bool PrintAccountReceipt,
    bool PrintPrepCancellation,
    bool PrintFinancialOperations,
    bool PrintPaymentGuide,
    bool PrintPanelPassword,
    bool PrintComandaPassword,
    bool PrintDeliveryAddressInAdvance,
    bool PrintAccountOnCloseOrders,
    bool PrintDeliveryCouponSecondCopy,
    bool PrintCancellationSummary,
    bool PrintProductionConference,
    
    // Comportamento
    bool ShowPrintQuestion,
    bool PrintServicesWithoutAsking
);

public record SystemSettingDTO(
    bool AutoLogout,
    int AutoLogoutTime,
    bool ComandaPrePaga,
    bool MostrarProdutosCanceladosNasVendas,
    bool LembrarUltimoAtendenteNasVendas,
    bool PermitirEstoqueNegativo,
    bool ExibirTelaVendaRapidaEmTelaCheia,
    bool RealizarBackupAutomaticamente,
    bool ComissaoNaVendaBalcao,
    bool FazerLogoutNoTabletAposLancadoPedido,
    bool AbrirComandaSemSolicitarCliente,
    bool ReservarMesasAoJuntar,
    bool RedirecionarParaAMesaPrincipal,
    bool ObservacaoComoNomeDeComanda,
    bool ConfirmarAoLancandoQuantidadesElevadas,
    bool MostrarCamposFiscaisETributarios,
    bool PesarProdutoAoSelecionarComanda,
    bool ObrigarInformarMotivoDeCancelamentos,
    bool FazerLogoutAposLancadoPedidoDoDesktop,
    bool FilaDePesagemNasComandas,
    bool AceitarPedidosDeliveryAutomaticamente,
    bool DesativarAvisosDeEstoqueAbaixoDoMinimo,
    bool ControlarLoteDoEstoque,
    
    string? DropboxToken,
    
    // Dispositivos
    bool HabilitarUsoDeBalanca,
    bool HabilitarIdentificadorDeChamadas,
    string TipoDispositivoIdentificador,
    bool HabilitarEventosParaCatraca,
    string TefType,
    
    // Região
    string Country
);

public record EmailSettingDTO(
    string? Recipient,
    string? Username,
    string? Password,
    string? Server,
    int Port,
    string Encryption
);

public record SettingsPayload(
    CompanyDTO Company,
    PrintSettingDTO Print,
    SystemSettingDTO System,
    EmailSettingDTO Email
);
