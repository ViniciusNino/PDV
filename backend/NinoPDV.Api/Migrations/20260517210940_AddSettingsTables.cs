using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NinoPDV.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddSettingsTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Companies",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TradingName = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    CompanyName = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Phone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    Cellphone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    Email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Slogan = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Cnpj = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    StateRegistration = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    MunicipalRegistration = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    FoundationDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LogoUrl = table.Column<string>(type: "text", nullable: true),
                    PurchaseLimit = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    Shareholder = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Cep = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    State = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    City = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Neighborhood = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    LocationType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Street = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Number = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    Complement = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ReferencePoint = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsSynced = table.Column<bool>(type: "boolean", nullable: false),
                    Version = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Companies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EmailSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CompanyId = table.Column<Guid>(type: "uuid", nullable: false),
                    Recipient = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Username = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Password = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Server = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Port = table.Column<int>(type: "integer", nullable: false),
                    Encryption = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsSynced = table.Column<bool>(type: "boolean", nullable: false),
                    Version = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailSettings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EmailSettings_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PrintSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CompanyId = table.Column<Guid>(type: "uuid", nullable: false),
                    PrintCnpj = table.Column<bool>(type: "boolean", nullable: false),
                    PrintAddress = table.Column<bool>(type: "boolean", nullable: false),
                    PrintPhone1 = table.Column<bool>(type: "boolean", nullable: false),
                    PrintPhone2 = table.Column<bool>(type: "boolean", nullable: false),
                    PrintAllWaiters = table.Column<bool>(type: "boolean", nullable: false),
                    PrintWaitersInReport = table.Column<bool>(type: "boolean", nullable: false),
                    PrintCashierAttendant = table.Column<bool>(type: "boolean", nullable: false),
                    PrintSlogan = table.Column<bool>(type: "boolean", nullable: false),
                    PrintPermanence = table.Column<bool>(type: "boolean", nullable: false),
                    PrintCompanyLogo = table.Column<bool>(type: "boolean", nullable: false),
                    PrintAccountDivision = table.Column<bool>(type: "boolean", nullable: false),
                    PrintCodeInServices = table.Column<bool>(type: "boolean", nullable: false),
                    PrintProductDetails = table.Column<bool>(type: "boolean", nullable: false),
                    PrintSeparateLocalAndAttendant = table.Column<bool>(type: "boolean", nullable: false),
                    Print3DGraphs = table.Column<bool>(type: "boolean", nullable: false),
                    PrintProductsOnClosure = table.Column<bool>(type: "boolean", nullable: false),
                    PrintServicesInLargeFont = table.Column<bool>(type: "boolean", nullable: false),
                    PrintDetailedServices = table.Column<bool>(type: "boolean", nullable: false),
                    PrintHighlightedAddress = table.Column<bool>(type: "boolean", nullable: false),
                    PrintHighlightedLocal = table.Column<bool>(type: "boolean", nullable: false),
                    PrintLocalInServices = table.Column<bool>(type: "boolean", nullable: false),
                    PrintClientInServices = table.Column<bool>(type: "boolean", nullable: false),
                    PrintCanceledOrdersOnClosure = table.Column<bool>(type: "boolean", nullable: false),
                    PrintOrderObservationInServices = table.Column<bool>(type: "boolean", nullable: false),
                    PrintObservationsOnOrder = table.Column<bool>(type: "boolean", nullable: false),
                    PrintGroupedPackages = table.Column<bool>(type: "boolean", nullable: false),
                    PrintServiceSeparatorLine = table.Column<bool>(type: "boolean", nullable: false),
                    PrintComandaRemainingBalanceInServices = table.Column<bool>(type: "boolean", nullable: false),
                    PrintCashierClosure = table.Column<bool>(type: "boolean", nullable: false),
                    PrintAccountReceipt = table.Column<bool>(type: "boolean", nullable: false),
                    PrintPrepCancellation = table.Column<bool>(type: "boolean", nullable: false),
                    PrintFinancialOperations = table.Column<bool>(type: "boolean", nullable: false),
                    PrintPaymentGuide = table.Column<bool>(type: "boolean", nullable: false),
                    PrintPanelPassword = table.Column<bool>(type: "boolean", nullable: false),
                    PrintComandaPassword = table.Column<bool>(type: "boolean", nullable: false),
                    PrintDeliveryAddressInAdvance = table.Column<bool>(type: "boolean", nullable: false),
                    PrintAccountOnCloseOrders = table.Column<bool>(type: "boolean", nullable: false),
                    PrintDeliveryCouponSecondCopy = table.Column<bool>(type: "boolean", nullable: false),
                    PrintCancellationSummary = table.Column<bool>(type: "boolean", nullable: false),
                    PrintProductionConference = table.Column<bool>(type: "boolean", nullable: false),
                    ShowPrintQuestion = table.Column<bool>(type: "boolean", nullable: false),
                    PrintServicesWithoutAsking = table.Column<bool>(type: "boolean", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsSynced = table.Column<bool>(type: "boolean", nullable: false),
                    Version = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrintSettings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PrintSettings_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SystemSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CompanyId = table.Column<Guid>(type: "uuid", nullable: false),
                    AutoLogout = table.Column<bool>(type: "boolean", nullable: false),
                    AutoLogoutTime = table.Column<int>(type: "integer", nullable: false),
                    ComandaPrePaga = table.Column<bool>(type: "boolean", nullable: false),
                    MostrarProdutosCanceladosNasVendas = table.Column<bool>(type: "boolean", nullable: false),
                    LembrarUltimoAtendenteNasVendas = table.Column<bool>(type: "boolean", nullable: false),
                    PermitirEstoqueNegativo = table.Column<bool>(type: "boolean", nullable: false),
                    ExibirTelaVendaRapidaEmTelaCheia = table.Column<bool>(type: "boolean", nullable: false),
                    RealizarBackupAutomaticamente = table.Column<bool>(type: "boolean", nullable: false),
                    ComissaoNaVendaBalcao = table.Column<bool>(type: "boolean", nullable: false),
                    FazerLogoutNoTabletAposLancadoPedido = table.Column<bool>(type: "boolean", nullable: false),
                    AbrirComandaSemSolicitarCliente = table.Column<bool>(type: "boolean", nullable: false),
                    ReservarMesasAoJuntar = table.Column<bool>(type: "boolean", nullable: false),
                    RedirecionarParaAMesaPrincipal = table.Column<bool>(type: "boolean", nullable: false),
                    ObservacaoComoNomeDeComanda = table.Column<bool>(type: "boolean", nullable: false),
                    ConfirmarAoLancandoQuantidadesElevadas = table.Column<bool>(type: "boolean", nullable: false),
                    MostrarCamposFiscaisETributarios = table.Column<bool>(type: "boolean", nullable: false),
                    PesarProdutoAoSelecionarComanda = table.Column<bool>(type: "boolean", nullable: false),
                    ObrigarInformarMotivoDeCancelamentos = table.Column<bool>(type: "boolean", nullable: false),
                    FazerLogoutAposLancadoPedidoDoDesktop = table.Column<bool>(type: "boolean", nullable: false),
                    FilaDePesagemNasComandas = table.Column<bool>(type: "boolean", nullable: false),
                    AceitarPedidosDeliveryAutomaticamente = table.Column<bool>(type: "boolean", nullable: false),
                    DesativarAvisosDeEstoqueAbaixoDoMinimo = table.Column<bool>(type: "boolean", nullable: false),
                    ControlarLoteDoEstoque = table.Column<bool>(type: "boolean", nullable: false),
                    DropboxToken = table.Column<string>(type: "text", nullable: true),
                    HabilitarUsoDeBalanca = table.Column<bool>(type: "boolean", nullable: false),
                    HabilitarIdentificadorDeChamadas = table.Column<bool>(type: "boolean", nullable: false),
                    TipoDispositivoIdentificador = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    HabilitarEventosParaCatraca = table.Column<bool>(type: "boolean", nullable: false),
                    TefType = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Country = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsSynced = table.Column<bool>(type: "boolean", nullable: false),
                    Version = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SystemSettings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SystemSettings_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EmailSettings_CompanyId",
                table: "EmailSettings",
                column: "CompanyId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PrintSettings_CompanyId",
                table: "PrintSettings",
                column: "CompanyId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SystemSettings_CompanyId",
                table: "SystemSettings",
                column: "CompanyId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EmailSettings");

            migrationBuilder.DropTable(
                name: "PrintSettings");

            migrationBuilder.DropTable(
                name: "SystemSettings");

            migrationBuilder.DropTable(
                name: "Companies");
        }
    }
}
