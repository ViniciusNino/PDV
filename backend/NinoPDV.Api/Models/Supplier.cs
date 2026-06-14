using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NinoPDV.Api.Models;

public class Supplier : BaseEntity
{
    [Required]
    [MaxLength(150)]
    public string TradingName { get; set; } = string.Empty; // Fantasia

    [Required]
    [MaxLength(150)]
    public string CompanyName { get; set; } = string.Empty; // Razão Social

    [Required]
    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;

    public string? LogoUrl { get; set; }

    [MaxLength(20)]
    public string? Cnpj { get; set; }

    [MaxLength(30)]
    public string? StateRegistration { get; set; } // IE

    [MaxLength(30)]
    public string? MunicipalRegistration { get; set; } // IM

    public DateTime? FoundationDate { get; set; }

    [MaxLength(100)]
    [EmailAddress]
    public string? Email { get; set; }

    [MaxLength(20)]
    public string? Cellphone { get; set; }

    [MaxLength(200)]
    public string? Slogan { get; set; }

    [MaxLength(200)]
    public string? Facebook { get; set; }

    [MaxLength(200)]
    public string? Twitter { get; set; }

    [MaxLength(200)]
    public string? Linkedin { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal PurchaseLimit { get; set; } = 0.00m;

    [MaxLength(100)]
    public string? Shareholder { get; set; }

    // Endereço
    [Required]
    [MaxLength(10)]
    public string Cep { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string State { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string City { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Neighborhood { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? LocationType { get; set; } = "Casa";

    [Required]
    [MaxLength(200)]
    public string Street { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Number { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Complement { get; set; }

    [MaxLength(200)]
    public string? ReferencePoint { get; set; }

    [MaxLength(100)]
    public string? Building { get; set; }

    [MaxLength(20)]
    public string? ApartmentNumber { get; set; }

    [MaxLength(20)]
    public string? Block { get; set; }

    [MaxLength(20)]
    public string? Floor { get; set; }

    // Login e Senha adicionais habilitados
    [MaxLength(100)]
    public string? Login { get; set; }

    [MaxLength(100)]
    public string? Password { get; set; }
}
