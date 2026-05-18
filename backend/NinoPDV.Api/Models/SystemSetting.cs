using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NinoPDV.Api.Models;

public class SystemSetting : BaseEntity
{
    public Guid CompanyId { get; set; }
    [ForeignKey(nameof(CompanyId))]
    public virtual Company? Company { get; set; }

    // Comportamento
    public bool AutoLogout { get; set; } = false;
    public int AutoLogoutTime { get; set; } = 3; // minutos
    public bool ComandaPrePaga { get; set; } = false;
    public bool MostrarProdutosCanceladosNasVendas { get; set; } = false;
    public bool LembrarUltimoAtendenteNasVendas { get; set; } = false;
    public bool PermitirEstoqueNegativo { get; set; } = false;
    public bool ExibirTelaVendaRapidaEmTelaCheia { get; set; } = true;
    public bool RealizarBackupAutomaticamente { get; set; } = true;
    public bool ComissaoNaVendaBalcao { get; set; } = false;
    public bool FazerLogoutNoTabletAposLancadoPedido { get; set; } = false;
    public bool AbrirComandaSemSolicitarCliente { get; set; } = false;
    public bool ReservarMesasAoJuntar { get; set; } = true;
    public bool RedirecionarParaAMesaPrincipal { get; set; } = false;
    public bool ObservacaoComoNomeDeComanda { get; set; } = true;
    public bool ConfirmarAoLancandoQuantidadesElevadas { get; set; } = true;
    public bool MostrarCamposFiscaisETributarios { get; set; } = false;
    public bool PesarProdutoAoSelecionarComanda { get; set; } = true;
    public bool ObrigarInformarMotivoDeCancelamentos { get; set; } = false;
    public bool FazerLogoutAposLancadoPedidoDoDesktop { get; set; } = false;
    public bool FilaDePesagemNasComandas { get; set; } = false;
    public bool AceitarPedidosDeliveryAutomaticamente { get; set; } = false;
    public bool DesativarAvisosDeEstoqueAbaixoDoMinimo { get; set; } = false;
    public bool ControlarLoteDoEstoque { get; set; } = false;

    public string? DropboxToken { get; set; }

    // Dispositivos
    public bool HabilitarUsoDeBalanca { get; set; } = false;
    public bool HabilitarIdentificadorDeChamadas { get; set; } = false;
    [MaxLength(50)]
    public string TipoDispositivoIdentificador { get; set; } = "Identificador"; // Identificador, Modem, Icebox
    public bool HabilitarEventosParaCatraca { get; set; } = false;

    [MaxLength(20)]
    public string TefType { get; set; } = "Nenhuma"; // Nenhuma, Scope, SiTef

    // Região
    [MaxLength(50)]
    public string Country { get; set; } = "Brasil";
}
