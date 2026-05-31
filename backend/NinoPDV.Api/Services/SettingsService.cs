using NinoPDV.Api.DTOs;
using NinoPDV.Api.Models;
using NinoPDV.Api.Repositories;
using System.Linq;
using System.Threading.Tasks;

namespace NinoPDV.Api.Services
{
    public class SettingsService : ISettingsService
    {
        private readonly ICompanyRepository _companyRepository;

        public SettingsService(ICompanyRepository companyRepository)
        {
            _companyRepository = companyRepository;
        }

        public async Task<bool> CheckSettingsAsync()
        {
            var all = await _companyRepository.GetAllAsync();
            return all.Any();
        }

        public async Task<SettingsPayload> GetSettingsAsync()
        {
            var company = await _companyRepository.GetSettingsAsync();

            if (company == null)
            {
                var defaultCompany = new CompanyDTO("", "", "", "", "", "", "", "", "", null, null, 0.00m, "", "", "", "", "", "", "", "", "", "");
                var defaultPrint = new PrintSettingDTO(true, true, true, true, false, true, true, true, true, false, true, false, false, false, true, false, false, true, true, true, true, true, false, true, true, true, false, false, true, true, true, true, true, false, false, false, true, false, false, false, false, true);
                var defaultSystem = new SystemSettingDTO(false, 3, false, false, false, false, true, true, false, false, false, true, false, true, true, false, true, false, false, false, false, false, false, "", false, false, "Identificador", false, "Nenhuma", "Brasil");
                var defaultEmail = new EmailSettingDTO("", "", "", "smtp.gmail.com", 587, "TLS");

                return new SettingsPayload(defaultCompany, defaultPrint, defaultSystem, defaultEmail);
            }

            var companyDTO = new CompanyDTO(
                company.TradingName, company.CompanyName, company.Phone, company.Cellphone, company.Email, company.Slogan, company.Cnpj, company.StateRegistration, company.MunicipalRegistration, company.FoundationDate, company.LogoUrl, company.PurchaseLimit, company.Shareholder, company.Cep, company.State, company.City, company.Neighborhood, company.LocationType, company.Street, company.Number, company.Complement, company.ReferencePoint
            );

            var printDTO = company.PrintSetting != null ? new PrintSettingDTO(
                company.PrintSetting.PrintCnpj, company.PrintSetting.PrintAddress, company.PrintSetting.PrintPhone1, company.PrintSetting.PrintPhone2, company.PrintSetting.PrintAllWaiters, company.PrintSetting.PrintWaitersInReport, company.PrintSetting.PrintCashierAttendant, company.PrintSetting.PrintSlogan, company.PrintSetting.PrintPermanence, company.PrintSetting.PrintCompanyLogo, company.PrintSetting.PrintAccountDivision, company.PrintSetting.PrintCodeInServices, company.PrintSetting.PrintProductDetails, company.PrintSetting.PrintSeparateLocalAndAttendant, company.PrintSetting.Print3DGraphs, company.PrintSetting.PrintProductsOnClosure, company.PrintSetting.PrintServicesInLargeFont, company.PrintSetting.PrintDetailedServices, company.PrintSetting.PrintHighlightedAddress, company.PrintSetting.PrintHighlightedLocal, company.PrintSetting.PrintLocalInServices, company.PrintSetting.PrintClientInServices, company.PrintSetting.PrintCanceledOrdersOnClosure, company.PrintSetting.PrintOrderObservationInServices, company.PrintSetting.PrintObservationsOnOrder, company.PrintSetting.PrintGroupedPackages, company.PrintSetting.PrintServiceSeparatorLine, company.PrintSetting.PrintComandaRemainingBalanceInServices, company.PrintSetting.PrintCashierClosure, company.PrintSetting.PrintAccountReceipt, company.PrintSetting.PrintPrepCancellation, company.PrintSetting.PrintFinancialOperations, company.PrintSetting.PrintPaymentGuide, company.PrintSetting.PrintPanelPassword, company.PrintSetting.PrintComandaPassword, company.PrintSetting.PrintDeliveryAddressInAdvance, company.PrintSetting.PrintAccountOnCloseOrders, company.PrintSetting.PrintDeliveryCouponSecondCopy, company.PrintSetting.PrintCancellationSummary, company.PrintSetting.PrintProductionConference, company.PrintSetting.ShowPrintQuestion, company.PrintSetting.PrintServicesWithoutAsking
            ) : null!;

            var systemDTO = company.SystemSetting != null ? new SystemSettingDTO(
                company.SystemSetting.AutoLogout, company.SystemSetting.AutoLogoutTime, company.SystemSetting.ComandaPrePaga, company.SystemSetting.MostrarProdutosCanceladosNasVendas, company.SystemSetting.LembrarUltimoAtendenteNasVendas, company.SystemSetting.PermitirEstoqueNegativo, company.SystemSetting.ExibirTelaVendaRapidaEmTelaCheia, company.SystemSetting.RealizarBackupAutomaticamente, company.SystemSetting.ComissaoNaVendaBalcao, company.SystemSetting.FazerLogoutNoTabletAposLancadoPedido, company.SystemSetting.AbrirComandaSemSolicitarCliente, company.SystemSetting.ReservarMesasAoJuntar, company.SystemSetting.RedirecionarParaAMesaPrincipal, company.SystemSetting.ObservacaoComoNomeDeComanda, company.SystemSetting.ConfirmarAoLancandoQuantidadesElevadas, company.SystemSetting.MostrarCamposFiscaisETributarios, company.SystemSetting.PesarProdutoAoSelecionarComanda, company.SystemSetting.ObrigarInformarMotivoDeCancelamentos, company.SystemSetting.FazerLogoutAposLancadoPedidoDoDesktop, company.SystemSetting.FilaDePesagemNasComandas, company.SystemSetting.AceitarPedidosDeliveryAutomaticamente, company.SystemSetting.DesativarAvisosDeEstoqueAbaixoDoMinimo, company.SystemSetting.ControlarLoteDoEstoque, company.SystemSetting.DropboxToken, company.SystemSetting.HabilitarUsoDeBalanca, company.SystemSetting.HabilitarIdentificadorDeChamadas, company.SystemSetting.TipoDispositivoIdentificador, company.SystemSetting.HabilitarEventosParaCatraca, company.SystemSetting.TefType, company.SystemSetting.Country
            ) : null!;

            var emailDTO = company.EmailSetting != null ? new EmailSettingDTO(
                company.EmailSetting.Recipient, company.EmailSetting.Username, company.EmailSetting.Password, company.EmailSetting.Server, company.EmailSetting.Port, company.EmailSetting.Encryption
            ) : null!;

            return new SettingsPayload(companyDTO, printDTO, systemDTO, emailDTO);
        }

        public async Task SaveSettingsAsync(SettingsPayload payload)
        {
            var company = await _companyRepository.GetSettingsAsync();
            bool isNew = company == null;

            if (isNew)
            {
                company = new Company();
            }

            company!.TradingName = payload.Company.TradingName;
            company.CompanyName = payload.Company.CompanyName;
            company.Phone = payload.Company.Phone;
            company.Cellphone = payload.Company.Cellphone;
            company.Email = payload.Company.Email;
            company.Slogan = payload.Company.Slogan;
            company.Cnpj = payload.Company.Cnpj;
            company.StateRegistration = payload.Company.StateRegistration;
            company.MunicipalRegistration = payload.Company.MunicipalRegistration;
            company.FoundationDate = payload.Company.FoundationDate;
            company.LogoUrl = payload.Company.LogoUrl;
            company.PurchaseLimit = payload.Company.PurchaseLimit;
            company.Shareholder = payload.Company.Shareholder;
            
            company.Cep = payload.Company.Cep;
            company.State = payload.Company.State;
            company.City = payload.Company.City;
            company.Neighborhood = payload.Company.Neighborhood;
            company.LocationType = payload.Company.LocationType;
            company.Street = payload.Company.Street;
            company.Number = payload.Company.Number;
            company.Complement = payload.Company.Complement;
            company.ReferencePoint = payload.Company.ReferencePoint;

            if (company.PrintSetting == null) company.PrintSetting = new PrintSetting();
            company.PrintSetting.PrintCnpj = payload.Print.PrintCnpj;
            company.PrintSetting.PrintAddress = payload.Print.PrintAddress;
            company.PrintSetting.PrintPhone1 = payload.Print.PrintPhone1;
            company.PrintSetting.PrintPhone2 = payload.Print.PrintPhone2;
            company.PrintSetting.PrintAllWaiters = payload.Print.PrintAllWaiters;
            company.PrintSetting.PrintWaitersInReport = payload.Print.PrintWaitersInReport;
            company.PrintSetting.PrintCashierAttendant = payload.Print.PrintCashierAttendant;
            company.PrintSetting.PrintSlogan = payload.Print.PrintSlogan;
            company.PrintSetting.PrintPermanence = payload.Print.PrintPermanence;
            company.PrintSetting.PrintCompanyLogo = payload.Print.PrintCompanyLogo;
            company.PrintSetting.PrintAccountDivision = payload.Print.PrintAccountDivision;
            company.PrintSetting.PrintCodeInServices = payload.Print.PrintCodeInServices;
            company.PrintSetting.PrintProductDetails = payload.Print.PrintProductDetails;
            company.PrintSetting.PrintSeparateLocalAndAttendant = payload.Print.PrintSeparateLocalAndAttendant;
            company.PrintSetting.Print3DGraphs = payload.Print.Print3DGraphs;
            company.PrintSetting.PrintProductsOnClosure = payload.Print.PrintProductsOnClosure;
            company.PrintSetting.PrintServicesInLargeFont = payload.Print.PrintServicesInLargeFont;
            company.PrintSetting.PrintDetailedServices = payload.Print.PrintDetailedServices;
            company.PrintSetting.PrintHighlightedAddress = payload.Print.PrintHighlightedAddress;
            company.PrintSetting.PrintHighlightedLocal = payload.Print.PrintHighlightedLocal;
            company.PrintSetting.PrintLocalInServices = payload.Print.PrintLocalInServices;
            company.PrintSetting.PrintClientInServices = payload.Print.PrintClientInServices;
            company.PrintSetting.PrintCanceledOrdersOnClosure = payload.Print.PrintCanceledOrdersOnClosure;
            company.PrintSetting.PrintOrderObservationInServices = payload.Print.PrintOrderObservationInServices;
            company.PrintSetting.PrintObservationsOnOrder = payload.Print.PrintObservationsOnOrder;
            company.PrintSetting.PrintGroupedPackages = payload.Print.PrintGroupedPackages;
            company.PrintSetting.PrintServiceSeparatorLine = payload.Print.PrintServiceSeparatorLine;
            company.PrintSetting.PrintComandaRemainingBalanceInServices = payload.Print.PrintComandaRemainingBalanceInServices;
            company.PrintSetting.PrintCashierClosure = payload.Print.PrintCashierClosure;
            company.PrintSetting.PrintAccountReceipt = payload.Print.PrintAccountReceipt;
            company.PrintSetting.PrintPrepCancellation = payload.Print.PrintPrepCancellation;
            company.PrintSetting.PrintFinancialOperations = payload.Print.PrintFinancialOperations;
            company.PrintSetting.PrintPaymentGuide = payload.Print.PrintPaymentGuide;
            company.PrintSetting.PrintPanelPassword = payload.Print.PrintPanelPassword;
            company.PrintSetting.PrintComandaPassword = payload.Print.PrintComandaPassword;
            company.PrintSetting.PrintDeliveryAddressInAdvance = payload.Print.PrintDeliveryAddressInAdvance;
            company.PrintSetting.PrintAccountOnCloseOrders = payload.Print.PrintAccountOnCloseOrders;
            company.PrintSetting.PrintDeliveryCouponSecondCopy = payload.Print.PrintDeliveryCouponSecondCopy;
            company.PrintSetting.PrintCancellationSummary = payload.Print.PrintCancellationSummary;
            company.PrintSetting.PrintProductionConference = payload.Print.PrintProductionConference;
            company.PrintSetting.ShowPrintQuestion = payload.Print.ShowPrintQuestion;
            company.PrintSetting.PrintServicesWithoutAsking = payload.Print.PrintServicesWithoutAsking;

            if (company.SystemSetting == null) company.SystemSetting = new SystemSetting();
            company.SystemSetting.AutoLogout = payload.System.AutoLogout;
            company.SystemSetting.AutoLogoutTime = payload.System.AutoLogoutTime;
            company.SystemSetting.ComandaPrePaga = payload.System.ComandaPrePaga;
            company.SystemSetting.MostrarProdutosCanceladosNasVendas = payload.System.MostrarProdutosCanceladosNasVendas;
            company.SystemSetting.LembrarUltimoAtendenteNasVendas = payload.System.LembrarUltimoAtendenteNasVendas;
            company.SystemSetting.PermitirEstoqueNegativo = payload.System.PermitirEstoqueNegativo;
            company.SystemSetting.ExibirTelaVendaRapidaEmTelaCheia = payload.System.ExibirTelaVendaRapidaEmTelaCheia;
            company.SystemSetting.RealizarBackupAutomaticamente = payload.System.RealizarBackupAutomaticamente;
            company.SystemSetting.ComissaoNaVendaBalcao = payload.System.ComissaoNaVendaBalcao;
            company.SystemSetting.FazerLogoutNoTabletAposLancadoPedido = payload.System.FazerLogoutNoTabletAposLancadoPedido;
            company.SystemSetting.AbrirComandaSemSolicitarCliente = payload.System.AbrirComandaSemSolicitarCliente;
            company.SystemSetting.ReservarMesasAoJuntar = payload.System.ReservarMesasAoJuntar;
            company.SystemSetting.RedirecionarParaAMesaPrincipal = payload.System.RedirecionarParaAMesaPrincipal;
            company.SystemSetting.ObservacaoComoNomeDeComanda = payload.System.ObservacaoComoNomeDeComanda;
            company.SystemSetting.ConfirmarAoLancandoQuantidadesElevadas = payload.System.ConfirmarAoLancandoQuantidadesElevadas;
            company.SystemSetting.MostrarCamposFiscaisETributarios = payload.System.MostrarCamposFiscaisETributarios;
            company.SystemSetting.PesarProdutoAoSelecionarComanda = payload.System.PesarProdutoAoSelecionarComanda;
            company.SystemSetting.ObrigarInformarMotivoDeCancelamentos = payload.System.ObrigarInformarMotivoDeCancelamentos;
            company.SystemSetting.FazerLogoutAposLancadoPedidoDoDesktop = payload.System.FazerLogoutAposLancadoPedidoDoDesktop;
            company.SystemSetting.FilaDePesagemNasComandas = payload.System.FilaDePesagemNasComandas;
            company.SystemSetting.AceitarPedidosDeliveryAutomaticamente = payload.System.AceitarPedidosDeliveryAutomaticamente;
            company.SystemSetting.DesativarAvisosDeEstoqueAbaixoDoMinimo = payload.System.DesativarAvisosDeEstoqueAbaixoDoMinimo;
            company.SystemSetting.ControlarLoteDoEstoque = payload.System.ControlarLoteDoEstoque;
            company.SystemSetting.DropboxToken = payload.System.DropboxToken;
            company.SystemSetting.HabilitarUsoDeBalanca = payload.System.HabilitarUsoDeBalanca;
            company.SystemSetting.HabilitarIdentificadorDeChamadas = payload.System.HabilitarIdentificadorDeChamadas;
            company.SystemSetting.TipoDispositivoIdentificador = payload.System.TipoDispositivoIdentificador;
            company.SystemSetting.HabilitarEventosParaCatraca = payload.System.HabilitarEventosParaCatraca;
            company.SystemSetting.TefType = payload.System.TefType;
            company.SystemSetting.Country = payload.System.Country;

            if (company.EmailSetting == null) company.EmailSetting = new EmailSetting();
            company.EmailSetting.Recipient = payload.Email.Recipient;
            company.EmailSetting.Username = payload.Email.Username;
            company.EmailSetting.Password = payload.Email.Password;
            company.EmailSetting.Server = payload.Email.Server;
            company.EmailSetting.Port = payload.Email.Port;
            company.EmailSetting.Encryption = payload.Email.Encryption;

            if (isNew)
            {
                await _companyRepository.AddAsync(company);
            }
            else
            {
                await _companyRepository.UpdateAsync(company);
            }
        }
    }
}
