using NinoPDV.Api.Data;
using NinoPDV.Api.Models;

namespace NinoPDV.Api.Repositories
{
    public class CategoryRepository : Repository<Category>, ICategoryRepository
    {
        public CategoryRepository(AppDbContext context) : base(context) { }
    }
}
