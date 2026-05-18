using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NinoPDV.Api.Models;

public class EmailSetting : BaseEntity
{
    public Guid CompanyId { get; set; }
    [ForeignKey(nameof(CompanyId))]
    public virtual Company? Company { get; set; }

    [MaxLength(100)]
    [EmailAddress]
    public string? Recipient { get; set; }

    [MaxLength(100)]
    public string? Username { get; set; }

    [MaxLength(100)]
    public string? Password { get; set; }

    [MaxLength(100)]
    public string? Server { get; set; } = "smtp.gmail.com";

    public int Port { get; set; } = 587;

    [MaxLength(10)]
    public string Encryption { get; set; } = "TLS"; // Nenhum, SSL, TLS
}
