using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using NinoPDV.Api.DTOs;
using NinoPDV.Api.Models;
using NinoPDV.Api.Repositories;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BC = BCrypt.Net.BCrypt;

namespace NinoPDV.Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;

        public AuthService(IUserRepository userRepository, IConfiguration config, IEmailService emailService)
        {
            _userRepository = userRepository;
            _config = config;
            _emailService = emailService;
        }

        public async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            var user = await _userRepository.GetByUsernameAsync(request.Username);

            if (user == null || !BC.Verify(request.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Usuário ou senha inválidos.");
            }

            if (!user.IsActive)
            {
                throw new InvalidOperationException("Usuário inativo.");
            }

            var token = GenerateJwtToken(user);

            return new LoginResponse(
                Token: token,
                Username: user.Username,
                Name: user.Name,
                Role: user.Role,
                CloudAccountId: user.CloudAccountId
            );
        }

        public async Task<IEnumerable<UserListResponse>> GetUsersAsync()
        {
            var users = await _userRepository.FindAsync(u => u.IsActive);
            return users.Select(u => new UserListResponse(u.Name, u.Username, u.Role));
        }

        public async Task<User> RegisterAsync(RegisterRequest request)
        {
            if (await _userRepository.GetByUsernameAsync(request.Username) != null)
            {
                throw new InvalidOperationException("Este nome de usuário já está em uso.");
            }

            var user = new User
            {
                Name = request.Name,
                Username = request.Username,
                PasswordHash = BC.HashPassword(request.Password),
                Role = request.Role
            };

            await _userRepository.AddAsync(user);

            return user;
        }

        public async Task RegisterCloudAsync(RegisterCloudRequest request)
        {
            if (await _userRepository.GetByEmailAsync(request.Email) != null)
            {
                throw new InvalidOperationException("Este endereço de e-mail já está associado a uma conta.");
            }

            var username = request.Email;
            if (await _userRepository.GetByUsernameAsync(username) != null)
            {
                username = $"{username}_{Guid.NewGuid().ToString().Substring(0, 4)}";
            }

            var random = new Random();
            var code = random.Next(100000, 999999).ToString();

            var user = new User
            {
                Name = request.Name,
                Username = username,
                Email = request.Email,
                Phone = request.Phone,
                Gender = request.Gender,
                PasswordHash = BC.HashPassword(request.Password),
                Role = "Admin",
                IsActive = false,
                IsEmailVerified = false,
                EmailVerificationCode = code,
                EmailVerificationCodeExpires = DateTime.UtcNow.AddMinutes(10)
            };

            await _userRepository.AddAsync(user);
            await _emailService.SendVerificationCodeAsync(request.Email, code);
        }

        public async Task<LoginResponse> VerifyEmailAsync(VerifyEmailRequest request)
        {
            var user = await _userRepository.GetByEmailAsync(request.Email);

            if (user == null)
            {
                throw new KeyNotFoundException("Usuário não encontrado.");
            }

            if (user.IsEmailVerified)
            {
                throw new InvalidOperationException("Este e-mail já foi verificado anteriormente.");
            }

            if (user.EmailVerificationCode != request.Code)
            {
                throw new InvalidOperationException("Código de verificação incorreto.");
            }

            if (user.EmailVerificationCodeExpires < DateTime.UtcNow)
            {
                throw new InvalidOperationException("O código de verificação expirou. Por favor, solicite um novo código.");
            }

            user.IsActive = true;
            user.IsEmailVerified = true;
            user.EmailVerificationCode = null;
            user.EmailVerificationCodeExpires = null;

            await _userRepository.UpdateAsync(user);

            var token = GenerateJwtToken(user);

            return new LoginResponse(
                Token: token,
                Username: user.Username,
                Name: user.Name,
                Role: user.Role,
                CloudAccountId: user.CloudAccountId
            );
        }

        public async Task ResendCodeAsync(ResendCodeRequest request)
        {
            var user = await _userRepository.GetByEmailAsync(request.Email);

            if (user == null)
            {
                throw new KeyNotFoundException("Usuário não encontrado.");
            }

            if (user.IsEmailVerified)
            {
                throw new InvalidOperationException("Este e-mail já está verificado.");
            }

            var random = new Random();
            var code = random.Next(100000, 999999).ToString();

            user.EmailVerificationCode = code;
            user.EmailVerificationCodeExpires = DateTime.UtcNow.AddMinutes(10);

            await _userRepository.UpdateAsync(user);
            await _emailService.SendVerificationCodeAsync(request.Email, code);
        }

        public async Task<LoginResponse> OAuthLoginAsync(OAuthLoginRequest request)
        {
            var user = await _userRepository.GetByOAuthProviderAsync(request.Provider, request.ProviderId);

            if (user == null)
            {
                var username = string.IsNullOrEmpty(request.Email) 
                    ? $"{request.Provider.ToLower()}_{request.ProviderId}" 
                    : request.Email;

                if (await _userRepository.GetByUsernameAsync(username) != null)
                {
                    username = $"{username}_{Guid.NewGuid().ToString().Substring(0, 4)}";
                }

                user = new User
                {
                    Name = request.Name,
                    Username = username,
                    PasswordHash = BC.HashPassword(Guid.NewGuid().ToString()),
                    Role = "Admin",
                    OAuthProvider = request.Provider,
                    ProviderId = request.ProviderId,
                    IsActive = true
                };

                await _userRepository.AddAsync(user);
            }

            if (!user.IsActive)
            {
                throw new InvalidOperationException("Usuário inativo.");
            }

            var token = GenerateJwtToken(user);

            return new LoginResponse(
                Token: token,
                Username: user.Username,
                Name: user.Name,
                Role: user.Role,
                CloudAccountId: user.CloudAccountId
            );
        }

        private string GenerateJwtToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not found")));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("CloudAccountId", user.CloudAccountId ?? "")
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
