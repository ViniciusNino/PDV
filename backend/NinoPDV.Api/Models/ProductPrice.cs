using System;
using NinoPDV.Api.Models.Enums;

namespace NinoPDV.Api.Models
{
    public class ProductPrice : BaseEntity
    {
        public Guid ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public SalesChannel Channel { get; set; }
        public decimal Price { get; set; }
    }
}
