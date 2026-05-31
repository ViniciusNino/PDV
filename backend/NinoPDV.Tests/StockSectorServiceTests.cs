using Moq;
using NinoPDV.Api.DTOs;
using NinoPDV.Api.Models;
using NinoPDV.Api.Repositories;
using NinoPDV.Api.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Xunit;

namespace NinoPDV.Tests.Services
{
    public class StockSectorServiceTests
    {
        private readonly Mock<IStockSectorRepository> _stockSectorRepoMock;
        private readonly Mock<IProductRepository> _productRepoMock;
        private readonly StockSectorService _service;

        public StockSectorServiceTests()
        {
            _stockSectorRepoMock = new Mock<IStockSectorRepository>();
            _productRepoMock = new Mock<IProductRepository>();
            _service = new StockSectorService(_stockSectorRepoMock.Object, _productRepoMock.Object);
        }

        [Fact]
        public async Task CreateStockSectorAsync_ValidData_ReturnsStockSector()
        {
            // Arrange
            var dto = new StockSectorDTO { Name = "Estoque Principal", Description = "Descrição" };
            _stockSectorRepoMock.Setup(r => r.FindAsync(It.IsAny<Expression<Func<StockSector, bool>>>()))
                .ReturnsAsync(new List<StockSector>());
            
            _stockSectorRepoMock.Setup(r => r.AddAsync(It.IsAny<StockSector>()))
                .ReturnsAsync(new StockSector { Id = Guid.NewGuid(), Name = dto.Name });

            // Act
            var result = await _service.CreateStockSectorAsync(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(dto.Name, result.Name);
            _stockSectorRepoMock.Verify(r => r.AddAsync(It.IsAny<StockSector>()), Times.Once);
        }

        [Fact]
        public async Task CreateStockSectorAsync_ExistingName_ThrowsArgumentException()
        {
            // Arrange
            var dto = new StockSectorDTO { Name = "Estoque Principal" };
            _stockSectorRepoMock.Setup(r => r.FindAsync(It.IsAny<Expression<Func<StockSector, bool>>>()))
                .ReturnsAsync(new List<StockSector> { new StockSector { Name = "Estoque Principal" } });

            // Act & Assert
            var ex = await Assert.ThrowsAsync<ArgumentException>(() => _service.CreateStockSectorAsync(dto));
            Assert.Equal("Já existe um setor de estoque com este nome.", ex.Message);
        }

        [Fact]
        public async Task CreateStockSectorAsync_ShortName_ThrowsArgumentException()
        {
            // Arrange
            var dto = new StockSectorDTO { Name = "A" };

            // Act & Assert
            var ex = await Assert.ThrowsAsync<ArgumentException>(() => _service.CreateStockSectorAsync(dto));
            Assert.Equal("O nome do setor deve ter entre 2 e 50 caracteres.", ex.Message);
        }

        [Fact]
        public async Task DeleteStockSectorAsync_WithProducts_ThrowsInvalidOperationException()
        {
            // Arrange
            var id = Guid.NewGuid();
            _stockSectorRepoMock.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(new StockSector { Id = id });
            _productRepoMock.Setup(r => r.FindAsync(It.IsAny<Expression<Func<Product, bool>>>()))
                .ReturnsAsync(new List<Product> { new Product { Id = Guid.NewGuid() } });

            // Act & Assert
            var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _service.DeleteStockSectorAsync(id));
            Assert.Equal("Não é possível excluir este setor pois existem produtos associados a ele.", ex.Message);
        }
    }
}
