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
        public int MaxQuantity { get; set; } = 1;
        public int Sequence { get; set; }
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
        
        public List<ModifierOptionDTO> Options { get; set; } = new();
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
        
        [Required]
        public Guid CategoryId { get; set; }

        public List<ProductPriceDTO> Prices { get; set; } = new();
        public List<ProductCompositionDTO> Ingredients { get; set; } = new();
        public List<ProductComboDTO> ComboItems { get; set; } = new();
        public List<ModifierGroupDTO> ModifierGroups { get; set; } = new();
    }
    
    public class ProductResponseDTO : ProductRequestDTO
    {
        public Guid Id { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
