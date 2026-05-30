using System;
using System.Collections.Generic;
using NinoPDV.Api.Models.Enums;

namespace NinoPDV.Api.Models
{
    public class Product : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        
        public ProductType Type { get; set; } = ProductType.Simple;
        public decimal BasePrice { get; set; }
        public decimal CostPrice { get; set; }
        public string Unit { get; set; } = "UN";
        public bool IsFractionable { get; set; } = false;
        public string? ImageBase64 { get; set; }
        
        public string? Barcode { get; set; }
        public string? Code { get; set; }
        public string? Abbreviation { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsVisible { get; set; } = true;
        public string? PrintTarget { get; set; }
        
        // Novos campos de preparo, estoque e promoções
        public int PreparationTime { get; set; }
        public bool ControlStock { get; set; }
        public Guid? StockSectorId { get; set; }
        public StockSector? StockSector { get; set; }
        public decimal MinStock { get; set; }
        public decimal MaxStock { get; set; }
        public decimal StockContent { get; set; }
        public bool IsDivisible { get; set; }
        public bool IsPerishable { get; set; }
        public bool IsAutoWeight { get; set; }
        public ICollection<ProductPromotion> Promotions { get; set; } = new List<ProductPromotion>();
        
        public Guid CategoryId { get; set; }
        public Category Category { get; set; } = null!;

        public ICollection<ProductPrice> Prices { get; set; } = new List<ProductPrice>();
        
        // Se este produto for uma composição, estes são os ingredientes dele
        public ICollection<ProductComposition> Ingredients { get; set; } = new List<ProductComposition>();
        
        // Se este produto for um Combo, estes são os itens dentro dele
        public ICollection<ProductCombo> ComboItems { get; set; } = new List<ProductCombo>();

        // Pacotes (Pizzas, Açaí)
        public ICollection<ModifierGroup> ModifierGroups { get; set; } = new List<ModifierGroup>();
    }
}
