using System;

namespace NinoPDV.Api.Models
{
    public class ProductComposition : BaseEntity
    {
        // O produto final que está sendo vendido
        public Guid ParentProductId { get; set; }
        public Product ParentProduct { get; set; } = null!;

        // O ingrediente que compõe o produto final
        public Guid IngredientProductId { get; set; }
        public Product IngredientProduct { get; set; } = null!;

        // A quantidade do ingrediente consumida
        public decimal Quantity { get; set; }

        // Novos campos para suportar Composição, Opcional e Adicional
        public Enums.CompositionType Type { get; set; } = Enums.CompositionType.Fundamental;
        public decimal AdditionalPrice { get; set; } = 0;
        public bool IsActive { get; set; } = true;
    }
}
