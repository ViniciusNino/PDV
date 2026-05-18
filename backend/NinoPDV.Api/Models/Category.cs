using System.Text.Json.Serialization;

namespace NinoPDV.Api.Models
{
    public class Category : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int Sequence { get; set; } = 0;

        // Imagem em formato Base64 para envio na nuvem sem depender do sistema de arquivos
        public string? ImageBase64 { get; set; }

        // Subcategorias (Hierarquia)
        public Guid? ParentCategoryId { get; set; }
        
        [JsonIgnore]
        public virtual Category? ParentCategory { get; set; }

        [JsonIgnore]
        public virtual ICollection<Category> SubCategories { get; set; } = new List<Category>();

        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
