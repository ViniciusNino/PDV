using System;

namespace NinoPDV.Api.Models
{
    public class ProductCombo : BaseEntity
    {
        public Guid ParentComboId { get; set; }
        public Product ParentCombo { get; set; } = null!;

        public Guid ChildProductId { get; set; }
        public Product ChildProduct { get; set; } = null!;

        public decimal Quantity { get; set; }
        
        // Preço fixo ou desconto aplicado a este item específico dentro do combo
        public decimal? FixedPrice { get; set; }
    }
}
