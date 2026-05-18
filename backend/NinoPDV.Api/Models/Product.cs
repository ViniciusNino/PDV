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
        public bool IsActive { get; set; } = true;
        
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
