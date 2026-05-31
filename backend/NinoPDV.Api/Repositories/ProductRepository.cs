using Microsoft.EntityFrameworkCore;
using NinoPDV.Api.Data;
using NinoPDV.Api.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NinoPDV.Api.Repositories
{
    public class ProductRepository : Repository<Product>, IProductRepository
    {
        public ProductRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Product>> GetAllWithCategoriesAsync()
        {
            return await _dbSet
                .Include(p => p.Category)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Product?> GetByIdWithDetailsAsync(Guid id)
        {
            return await _dbSet
                .Include(p => p.Category)
                .Include(p => p.Prices)
                .Include(p => p.Ingredients)
                .Include(p => p.ComboItems)
                .Include(p => p.Promotions)
                .Include(p => p.ModifierGroups)
                    .ThenInclude(mg => mg.Options)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public Task RemoveModifierGroupsAsync(IEnumerable<ModifierGroup> modifierGroups)
        {
            _context.ModifierGroups.RemoveRange(modifierGroups);
            return Task.CompletedTask;
        }

        public Task RemoveModifierOptionsAsync(IEnumerable<ModifierOption> modifierOptions)
        {
            _context.ModifierOptions.RemoveRange(modifierOptions);
            return Task.CompletedTask;
        }
    }
}
