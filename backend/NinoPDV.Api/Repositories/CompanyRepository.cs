using Microsoft.EntityFrameworkCore;
using NinoPDV.Api.Data;
using NinoPDV.Api.Models;
using System.Threading.Tasks;

namespace NinoPDV.Api.Repositories
{
    public class CompanyRepository : Repository<Company>, ICompanyRepository
    {
        public CompanyRepository(AppDbContext context) : base(context) { }

        public async Task<Company?> GetSettingsAsync()
        {
            return await _dbSet
                .Include(c => c.PrintSetting)
                .Include(c => c.SystemSetting)
                .Include(c => c.EmailSetting)
                .FirstOrDefaultAsync();
        }
    }
}
