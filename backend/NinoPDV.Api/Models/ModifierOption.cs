using System;

namespace NinoPDV.Api.Models
{
    public class ModifierOption : BaseEntity
    {
        public Guid ModifierGroupId { get; set; }
        public ModifierGroup ModifierGroup { get; set; } = null!;

        // Opcionalmente, pode ser apenas um nome avulso, mas o ideal é linkar a um produto do sistema para baixa de estoque
        public Guid? ProductId { get; set; }
        public Product? Product { get; set; }

        public string Name { get; set; } = string.Empty; // Se não houver ProductId, usa este nome
        
        // Preço adicional que esta opção cobra
        public decimal AdditionalPrice { get; set; }
        
        // Quantidade máxima que o cliente pode selecionar da mesma opção (Ex: 2x bacon)
        public int MaxQuantity { get; set; } = 1;

        public int Sequence { get; set; }
    }
}
