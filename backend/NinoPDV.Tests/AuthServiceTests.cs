using Microsoft.Extensions.Configuration;
using Moq;
using NinoPDV.Api.DTOs;
using NinoPDV.Api.Models;
using NinoPDV.Api.Repositories;
using NinoPDV.Api.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using BC = BCrypt.Net.BCrypt;

namespace NinoPDV.Tests.Services
{
    public class AuthServiceTests
    {
        private readonly Mock<IUserRepository> _userRepoMock;
        private readonly Mock<IEmailService> _emailServiceMock;
        private readonly Mock<IConfiguration> _configMock;
        private readonly AuthService _service;

        public AuthServiceTests()
        {
            _userRepoMock = new Mock<IUserRepository>();
            _emailServiceMock = new Mock<IEmailService>();
            _configMock = new Mock<IConfiguration>();

            _configMock.Setup(c => c["Jwt:Key"]).Returns("chave_super_secreta_com_mais_de_32_caracteres");
            _configMock.Setup(c => c["Jwt:Issuer"]).Returns("issuer_teste");
            _configMock.Setup(c => c["Jwt:Audience"]).Returns("audience_teste");

            _service = new AuthService(_userRepoMock.Object, _configMock.Object, _emailServiceMock.Object);
        }

        [Fact]
        public async Task LoginAsync_InvalidUsername_ThrowsUnauthorizedAccessException()
        {
            // Arrange
            var request = new LoginRequest("admin", "12345");
            _userRepoMock.Setup(r => r.GetByUsernameAsync("admin")).ReturnsAsync((User?)null);

            // Act & Assert
            var ex = await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _service.LoginAsync(request));
            Assert.Equal("Usuário ou senha inválidos.", ex.Message);
        }

        [Fact]
        public async Task LoginAsync_InvalidPassword_ThrowsUnauthorizedAccessException()
        {
            // Arrange
            var request = new LoginRequest("admin", "senha_errada");
            var user = new User
            {
                Username = "admin",
                PasswordHash = BC.HashPassword("senha_correta")
            };
            _userRepoMock.Setup(r => r.GetByUsernameAsync("admin")).ReturnsAsync(user);

            // Act & Assert
            var ex = await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _service.LoginAsync(request));
            Assert.Equal("Usuário ou senha inválidos.", ex.Message);
        }

        [Fact]
        public async Task LoginAsync_InactiveUser_ThrowsInvalidOperationException()
        {
            // Arrange
            var request = new LoginRequest("admin", "12345");
            var user = new User
            {
                Username = "admin",
                PasswordHash = BC.HashPassword("12345"),
                IsActive = false
            };
            _userRepoMock.Setup(r => r.GetByUsernameAsync("admin")).ReturnsAsync(user);

            // Act & Assert
            var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _service.LoginAsync(request));
            Assert.Equal("Usuário inativo.", ex.Message);
        }

        [Fact]
        public async Task LoginAsync_ValidCredentials_ReturnsToken()
        {
            // Arrange
            var request = new LoginRequest("admin", "12345");
            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = "admin",
                Name = "Administrador",
                Role = "Admin",
                PasswordHash = BC.HashPassword("12345"),
                IsActive = true
            };
            _userRepoMock.Setup(r => r.GetByUsernameAsync("admin")).ReturnsAsync(user);

            // Act
            var result = await _service.LoginAsync(request);

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(result.Token);
            Assert.Equal("admin", result.Username);
            Assert.Equal("Administrador", result.Name);
            Assert.Equal("Admin", result.Role);
        }

        [Fact]
        public async Task RegisterAsync_ExistingUsername_ThrowsInvalidOperationException()
        {
            // Arrange
            var request = new RegisterRequest("Novo", "admin", "123", "Admin");
            _userRepoMock.Setup(r => r.GetByUsernameAsync("admin")).ReturnsAsync(new User());

            // Act & Assert
            var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _service.RegisterAsync(request));
            Assert.Equal("Este nome de usuário já está em uso.", ex.Message);
        }

        [Fact]
        public async Task VerifyEmailAsync_InvalidCode_ThrowsInvalidOperationException()
        {
            // Arrange
            var request = new VerifyEmailRequest("teste@teste.com", "111111");
            var user = new User
            {
                Email = "teste@teste.com",
                IsEmailVerified = false,
                EmailVerificationCode = "999999",
                EmailVerificationCodeExpires = DateTime.UtcNow.AddMinutes(5)
            };
            _userRepoMock.Setup(r => r.GetByEmailAsync("teste@teste.com")).ReturnsAsync(user);

            // Act & Assert
            var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _service.VerifyEmailAsync(request));
            Assert.Equal("Código de verificação incorreto.", ex.Message);
        }
    }
}
