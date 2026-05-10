namespace NinoPDV.Api.Models
{
    public class Sale : BaseEntity
    {
        public decimal TotalAmount { get; set; }
        public decimal Discount { get; set; }
        public DateTime SaleDate { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Completed"; // Completed, Cancelled, Pending
        public string PaymentMethod { get; set; } = "Cash"; // Cash, CreditCard, DebitCard, Pix
        
        public ICollection<SaleItem> Items { get; set; } = new List<SaleItem>();
    }
}
