using NinoPDV.Api.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NinoPDV.Api.Repositories
{
    public interface IProductRepository : IRepository<Product>
    {
        Task<IEnumerable<Product>> GetAllWithCategoriesAsync();
        Task<Product?> GetByIdWithDetailsAsync(Guid id);
        Task RemoveModifierGroupsAsync(IEnumerable<ModifierGroup> modifierGroups);
        Task RemoveModifierOptionsAsync(IEnumerable<ModifierOption> modifierOptions);
    }
}
