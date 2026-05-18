using System;
using System.Collections.Generic;
using NinoPDV.Api.Models.Enums;

namespace NinoPDV.Api.Models
{
    public class ModifierGroup : BaseEntity
    {
        public Guid ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public string Name { get; set; } = string.Empty; // Ex: "Tamanho", "Sabores", "Bordas"
        
        public int MinSelections { get; set; }
        public int MaxSelections { get; set; }
        
        public PricingRule PriceRule { get; set; } = PricingRule.HighestPrice;

        // Para ordenar visualmente as etapas
        public int Sequence { get; set; }

        public ICollection<ModifierOption> Options { get; set; } = new List<ModifierOption>();
    }
}
