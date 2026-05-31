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
    public class CategoryServiceTests
    {
        private readonly Mock<ICategoryRepository> _categoryRepositoryMock;
        private readonly Mock<IProductRepository> _productRepositoryMock;
        private readonly CategoryService _categoryService;

        public CategoryServiceTests()
        {
            _categoryRepositoryMock = new Mock<ICategoryRepository>();
            _productRepositoryMock = new Mock<IProductRepository>();
            _categoryService = new CategoryService(_categoryRepositoryMock.Object, _productRepositoryMock.Object);
        }

        [Fact]
        public async Task CreateCategoryAsync_WithValidData_ReturnsCategory()
        {
            // Arrange
            var request = new CategoryRequest(
                Name: "Lanches",
                Description: "Categoria de Lanches",
                ParentCategoryId: null,
                ImageBase64: null
            );

            _categoryRepositoryMock.Setup(repo => repo.FindAsync(It.IsAny<Expression<Func<Category, bool>>>()))
                .ReturnsAsync(new List<Category>());

            _categoryRepositoryMock.Setup(repo => repo.AddAsync(It.IsAny<Category>()))
                .ReturnsAsync(new Category { Id = Guid.NewGuid(), Name = request.Name });

            // Act
            var result = await _categoryService.CreateCategoryAsync(request);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(request.Name, result.Name);
            _categoryRepositoryMock.Verify(repo => repo.AddAsync(It.IsAny<Category>()), Times.Once);
        }

        [Fact]
        public async Task CreateCategoryAsync_WithExistingName_ThrowsArgumentException()
        {
            // Arrange
            var request = new CategoryRequest(
                Name: "Lanches",
                Description: null,
                ParentCategoryId: null,
                ImageBase64: null
            );

            _categoryRepositoryMock.Setup(repo => repo.FindAsync(It.IsAny<Expression<Func<Category, bool>>>()))
                .ReturnsAsync(new List<Category> { new Category { Name = "Lanches" } });

            // Act & Assert
            var ex = await Assert.ThrowsAsync<ArgumentException>(() => _categoryService.CreateCategoryAsync(request));
            Assert.Equal("Já existe uma categoria com este nome.", ex.Message);
        }

        [Fact]
        public async Task DeleteCategoryAsync_WithProductsAssociated_ThrowsInvalidOperationException()
        {
            // Arrange
            var categoryId = Guid.NewGuid();
            var category = new Category { Id = categoryId };

            _categoryRepositoryMock.Setup(repo => repo.GetByIdAsync(categoryId))
                .ReturnsAsync(category);

            _productRepositoryMock.Setup(repo => repo.FindAsync(It.IsAny<Expression<Func<Product, bool>>>()))
                .ReturnsAsync(new List<Product> { new Product { Id = Guid.NewGuid(), CategoryId = categoryId } });

            // Act & Assert
            var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _categoryService.DeleteCategoryAsync(categoryId));
            Assert.Equal("Não é possível excluir esta categoria pois ela possui produtos associados.", ex.Message);
        }
    }
}
