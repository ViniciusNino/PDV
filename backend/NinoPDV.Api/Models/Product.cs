namespace NinoPDV.Api.Models
{
    public class Product : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? Barcode { get; set; }
        public bool IsActive { get; set; } = true;
        
        public Guid CategoryId { get; set; }
        public Category Category { get; set; } = null!;
    }
}
