using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using NinoPDV.Api.Models.Enums;

namespace NinoPDV.Api.DTOs
{
    public class ProductPriceDTO
    {
        public SalesChannel Channel { get; set; }
        public decimal Price { get; set; }
        public bool IsVisible { get; set; } = true;
    }

    public class ProductCompositionDTO
    {
        public Guid IngredientProductId { get; set; }
        public decimal Quantity { get; set; }
        public CompositionType Type { get; set; } = CompositionType.Fundamental;
        public decimal AdditionalPrice { get; set; } = 0;
        public bool IsActive { get; set; } = true;
    }

    public class ProductComboDTO
    {
        public Guid ChildProductId { get; set; }
        public decimal Quantity { get; set; }
        public decimal? FixedPrice { get; set; }
    }

    public class ModifierOptionDTO
    {
        public Guid? Id { get; set; } // If editing
        public Guid? ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal AdditionalPrice { get; set; }
        public decimal BasePrice { get; set; }
        public decimal TotalPrice { get; set; }
        public int MinQuantity { get; set; }
        public int MaxQuantity { get; set; } = 1;
        public int Sequence { get; set; }
        public bool IsPreSelected { get; set; }
        public bool IsVisible { get; set; }
        public string Abbreviation { get; set; } = string.Empty;
        public Guid? ParentOptionId { get; set; }
    }

    public class ModifierGroupDTO
    {
        public Guid? Id { get; set; } // If editing
        [Required]
        public string Name { get; set; } = string.Empty;
        public int MinSelections { get; set; }
        public int MaxSelections { get; set; }
        public PricingRule PriceRule { get; set; }
        public int Sequence { get; set; }
        public bool IsPropType { get; set; }
        public bool CanBeFractioned { get; set; }
        
        public List<ModifierOptionDTO> Options { get; set; } = new();
    }

    public class StockSectorDTO
    {
        public Guid? Id { get; set; }
        [Required]
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class ProductPromotionDTO
    {
        public Guid? Id { get; set; }
        public string DayStart { get; set; } = string.Empty;
        public int HourStart { get; set; }
        public string DayEnd { get; set; } = string.Empty;
        public int HourEnd { get; set; }
        public decimal Price { get; set; }
        public bool IsSaleForbidden { get; set; }
    }

    public class ProductRequestDTO
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        
        [Required]
        public ProductType Type { get; set; }
        public decimal BasePrice { get; set; }
        public decimal CostPrice { get; set; }
        public string Unit { get; set; } = "UN";
        public bool IsFractionable { get; set; }
        public string? ImageBase64 { get; set; }
        public string? Barcode { get; set; }
        public string? Code { get; set; }
        public string? Abbreviation { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsVisible { get; set; } = true;
        public string? PrintTarget { get; set; }
        
        // Novos campos de preparo, estoque e promoções no DTO
        public int PreparationTime { get; set; }
        public bool ControlStock { get; set; }
        public Guid? StockSectorId { get; set; }
        public decimal MinStock { get; set; }
        public decimal MaxStock { get; set; }
        public decimal StockContent { get; set; }
        public bool IsDivisible { get; set; }
        public bool IsPerishable { get; set; }
        public bool IsAutoWeight { get; set; }
        
        [Required]
        public Guid CategoryId { get; set; }

        public List<ProductPriceDTO> Prices { get; set; } = new();
        public List<ProductCompositionDTO> Ingredients { get; set; } = new();
        public List<ProductComboDTO> ComboItems { get; set; } = new();
        public List<ModifierGroupDTO> ModifierGroups { get; set; } = new();
        public List<ProductPromotionDTO> Promotions { get; set; } = new();
    }
    
    public class ProductResponseDTO : ProductRequestDTO
    {
        public Guid Id { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
