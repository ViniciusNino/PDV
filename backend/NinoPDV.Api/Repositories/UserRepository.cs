using Microsoft.EntityFrameworkCore;
using NinoPDV.Api.Data;
using NinoPDV.Api.Models;
using System.Threading.Tasks;

namespace NinoPDV.Api.Repositories
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context) { }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Username.ToLower() == username.ToLower());
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Email != null && u.Email.ToLower() == email.ToLower());
        }

        public async Task<User?> GetByOAuthProviderAsync(string provider, string providerId)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.OAuthProvider == provider && u.ProviderId == providerId);
        }
    }
}
