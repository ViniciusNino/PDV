using Moq;
using NinoPDV.Api.DTOs;
using NinoPDV.Api.Models;
using NinoPDV.Api.Repositories;
using NinoPDV.Api.Services;
using System.Threading.Tasks;
using Xunit;

namespace NinoPDV.Tests.Services
{
    public class SettingsServiceTests
    {
        private readonly Mock<ICompanyRepository> _companyRepoMock;
        private readonly SettingsService _service;

        public SettingsServiceTests()
        {
            _companyRepoMock = new Mock<ICompanyRepository>();
            _service = new SettingsService(_companyRepoMock.Object);
        }

        [Fact]
        public async Task GetSettingsAsync_WhenNoCompanyExists_ReturnsDefaultPayload()
        {
            // Arrange
            _companyRepoMock.Setup(r => r.GetSettingsAsync()).ReturnsAsync((Company?)null);

            // Act
            var result = await _service.GetSettingsAsync();

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(result.Company);
            Assert.NotNull(result.Print);
            Assert.NotNull(result.System);
            Assert.NotNull(result.Email);

            // Default values assertions
            Assert.Equal("", result.Company.TradingName);
            Assert.False(result.System.AutoLogout);
            Assert.Equal("smtp.gmail.com", result.Email.Server);
            Assert.True(result.Print.PrintCnpj);
        }

        [Fact]
        public async Task GetSettingsAsync_WhenCompanyExists_ReturnsMappedPayload()
        {
            // Arrange
            var company = new Company
            {
                TradingName = "Minha Empresa",
                PrintSetting = new PrintSetting { PrintCnpj = false },
                SystemSetting = new SystemSetting { AutoLogout = true },
                EmailSetting = new EmailSetting { Server = "mail.empresa.com" }
            };

            _companyRepoMock.Setup(r => r.GetSettingsAsync()).ReturnsAsync(company);

            // Act
            var result = await _service.GetSettingsAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Minha Empresa", result.Company.TradingName);
            Assert.False(result.Print.PrintCnpj);
            Assert.True(result.System.AutoLogout);
            Assert.Equal("mail.empresa.com", result.Email.Server);
        }

        [Fact]
        public async Task SaveSettingsAsync_WithNewCompany_CallsAddAsync()
        {
            // Arrange
            _companyRepoMock.Setup(r => r.GetSettingsAsync()).ReturnsAsync((Company?)null);

            var payload = new SettingsPayload(
                new CompanyDTO("Nova", "", "", "", "", "", "", "", "", null, null, 0, "", "", "", "", "", "", "", "", "", ""),
                new PrintSettingDTO(false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),
                new SystemSettingDTO(false, 0, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, "", false, false, "", false, "", ""),
                new EmailSettingDTO("", "", "", "", 0, "")
            );

            // Act
            await _service.SaveSettingsAsync(payload);

            // Assert
            _companyRepoMock.Verify(r => r.AddAsync(It.Is<Company>(c => c.TradingName == "Nova")), Times.Once);
            _companyRepoMock.Verify(r => r.UpdateAsync(It.IsAny<Company>()), Times.Never);
        }

        [Fact]
        public async Task SaveSettingsAsync_WithExistingCompany_CallsUpdateAsync()
        {
            // Arrange
            var existingCompany = new Company { TradingName = "Antiga" };
            _companyRepoMock.Setup(r => r.GetSettingsAsync()).ReturnsAsync(existingCompany);

            var payload = new SettingsPayload(
                new CompanyDTO("Atualizada", "", "", "", "", "", "", "", "", null, null, 0, "", "", "", "", "", "", "", "", "", ""),
                new PrintSettingDTO(false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),
                new SystemSettingDTO(false, 0, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, "", false, false, "", false, "", ""),
                new EmailSettingDTO("", "", "", "", 0, "")
            );

            // Act
            await _service.SaveSettingsAsync(payload);

            // Assert
            _companyRepoMock.Verify(r => r.AddAsync(It.IsAny<Company>()), Times.Never);
            _companyRepoMock.Verify(r => r.UpdateAsync(It.Is<Company>(c => c.TradingName == "Atualizada")), Times.Once);
        }
    }
}
