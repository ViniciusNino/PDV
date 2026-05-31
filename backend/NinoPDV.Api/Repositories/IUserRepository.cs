using NinoPDV.Api.Models;
using System.Threading.Tasks;

namespace NinoPDV.Api.Repositories
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetByUsernameAsync(string username);
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByOAuthProviderAsync(string provider, string providerId);
    }
}
