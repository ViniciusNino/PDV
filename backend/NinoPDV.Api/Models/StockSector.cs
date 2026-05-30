using System;

namespace NinoPDV.Api.Models
{
    public class StockSector : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}
