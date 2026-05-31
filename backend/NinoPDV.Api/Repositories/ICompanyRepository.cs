using NinoPDV.Api.Models;
using System.Threading.Tasks;

namespace NinoPDV.Api.Repositories
{
    public interface ICompanyRepository : IRepository<Company>
    {
        Task<Company?> GetSettingsAsync();
    }
}
