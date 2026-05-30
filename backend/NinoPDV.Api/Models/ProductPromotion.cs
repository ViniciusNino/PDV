using System;

namespace NinoPDV.Api.Models
{
    public class ProductPromotion : BaseEntity
    {
        public Guid ProductId { get; set; }
        public Product Product { get; set; } = null!;
        
        public string DayStart { get; set; } = string.Empty;
        public int HourStart { get; set; }
        public string DayEnd { get; set; } = string.Empty;
        public int HourEnd { get; set; }
        public decimal Price { get; set; }
        public bool IsSaleForbidden { get; set; }
    }
}
