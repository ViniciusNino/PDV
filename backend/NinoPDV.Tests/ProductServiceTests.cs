using Moq;
using NinoPDV.Api.DTOs;
using NinoPDV.Api.Models;
using NinoPDV.Api.Repositories;
using NinoPDV.Api.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace NinoPDV.Tests.Services
{
    public class ProductServiceTests
    {
        private readonly Mock<IProductRepository> _productRepoMock;
        private readonly Mock<ICategoryRepository> _categoryRepoMock;
        private readonly ProductService _service;

        public ProductServiceTests()
        {
            _productRepoMock = new Mock<IProductRepository>();
            _categoryRepoMock = new Mock<ICategoryRepository>();
            _service = new ProductService(_productRepoMock.Object, _categoryRepoMock.Object);
        }

        [Fact]
        public async Task GetProductsAsync_ReturnsMappedDtos()
        {
            // Arrange
            var products = new List<Product>
            {
                new Product { Id = Guid.NewGuid(), Name = "Produto A", Category = new Category { Name = "Categoria A" } },
                new Product { Id = Guid.NewGuid(), Name = "Produto B", Category = new Category { Name = "Categoria B" } }
            };

            _productRepoMock.Setup(r => r.GetAllWithCategoriesAsync()).ReturnsAsync(products);

            // Act
            var result = await _service.GetProductsAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, System.Linq.Enumerable.Count(result));
        }

        [Fact]
        public async Task CreateProductAsync_WithInvalidCategory_ThrowsArgumentException()
        {
            // Arrange
            var request = new ProductRequestDTO { Name = "Novo Produto", CategoryId = Guid.NewGuid() };

            _categoryRepoMock.Setup(r => r.GetByIdAsync(request.CategoryId)).ReturnsAsync((Category?)null);

            // Act & Assert
            var ex = await Assert.ThrowsAsync<ArgumentException>(() => _service.CreateProductAsync(request));
            Assert.Equal("Categoria inválida.", ex.Message);
        }

        [Fact]
        public async Task DeleteProductAsync_ExistingProduct_CallsDeleteAsync()
        {
            // Arrange
            var productId = Guid.NewGuid();
            var product = new Product { Id = productId };

            _productRepoMock.Setup(r => r.GetByIdAsync(productId)).ReturnsAsync(product);

            // Act
            await _service.DeleteProductAsync(productId);

            // Assert
            _productRepoMock.Verify(r => r.DeleteAsync(product), Times.Once);
        }

        [Fact]
        public async Task DeleteProductAsync_NonExistingProduct_ThrowsKeyNotFoundException()
        {
            // Arrange
            var productId = Guid.NewGuid();
            _productRepoMock.Setup(r => r.GetByIdAsync(productId)).ReturnsAsync((Product?)null);

            // Act & Assert
            var ex = await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.DeleteProductAsync(productId));
            Assert.Equal("Product not found", ex.Message);
        }
        
        [Fact]
        public async Task DeleteProductAsync_DbException_ThrowsInvalidOperationException()
        {
            // Arrange
            var productId = Guid.NewGuid();
            var product = new Product { Id = productId };

            _productRepoMock.Setup(r => r.GetByIdAsync(productId)).ReturnsAsync(product);
            _productRepoMock.Setup(r => r.DeleteAsync(product)).ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _service.DeleteProductAsync(productId));
            Assert.Equal("Não é possível excluir este produto, pois ele está associado a outras tabelas.", ex.Message);
        }
    }
}
