using NinoPDV.Api.DTOs;
using NinoPDV.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NinoPDV.Api.Services
{
    public interface IAuthService
    {
        Task<LoginResponse> LoginAsync(LoginRequest request);
        Task<IEnumerable<UserListResponse>> GetUsersAsync();
        Task<User> RegisterAsync(RegisterRequest request);
        Task RegisterCloudAsync(RegisterCloudRequest request);
        Task<LoginResponse> VerifyEmailAsync(VerifyEmailRequest request);
        Task ResendCodeAsync(ResendCodeRequest request);
        Task<LoginResponse> OAuthLoginAsync(OAuthLoginRequest request);
    }
}
