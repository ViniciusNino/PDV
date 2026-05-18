using System.ComponentModel.DataAnnotations;

namespace NinoPDV.Api.Models;

public class User : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = "Admin"; // Admin, Manager, Cashier

    public bool IsActive { get; set; } = true;

    // Campos para a segunda etapa (Conta/Nuvem)
    public string? CloudAccountId { get; set; }
    public string? CloudUserToken { get; set; }

    [MaxLength(100)]
    [EmailAddress]
    public string? Email { get; set; }

    [MaxLength(20)]
    public string? Phone { get; set; }

    [MaxLength(10)]
    public string? Gender { get; set; }

    public bool IsEmailVerified { get; set; } = false;

    [MaxLength(6)]
    public string? EmailVerificationCode { get; set; }

    public DateTime? EmailVerificationCodeExpires { get; set; }

    // Etapa 1: Autenticação Social / OAuth
    [MaxLength(50)]
    public string? OAuthProvider { get; set; } // e.g., "Facebook", "Google"
    
    [MaxLength(255)]
    public string? ProviderId { get; set; }
}
