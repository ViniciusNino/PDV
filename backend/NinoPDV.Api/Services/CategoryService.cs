using NinoPDV.Api.DTOs;
using NinoPDV.Api.Models;
using NinoPDV.Api.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NinoPDV.Api.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IProductRepository _productRepository;

        public CategoryService(ICategoryRepository categoryRepository, IProductRepository productRepository)
        {
            _categoryRepository = categoryRepository;
            _productRepository = productRepository;
        }

        public async Task<IEnumerable<Category>> GetCategoriesAsync()
        {
            var categories = await _categoryRepository.GetAllAsync();
            return categories.OrderBy(c => c.Sequence);
        }

        public async Task<Category> CreateCategoryAsync(CategoryRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                throw new ArgumentException("O nome da categoria é obrigatório.");

            var trimmedName = request.Name.Trim();
            if (trimmedName.Length < 2 || trimmedName.Length > 50)
                throw new ArgumentException("O nome da categoria deve ter entre 2 e 50 caracteres.");

            if (request.Description != null && request.Description.Length > 200)
                throw new ArgumentException("A descrição da categoria não pode ultrapassar 200 caracteres.");

            var nameLower = trimmedName.ToLower();
            var existingCategories = await _categoryRepository.FindAsync(c => c.Name.ToLower() == nameLower);
            if (existingCategories.Any())
                throw new ArgumentException("Já existe uma categoria com este nome.");

            var sameParent = await _categoryRepository.FindAsync(c => c.ParentCategoryId == request.ParentCategoryId);
            var maxSeq = sameParent.Any() ? sameParent.Max(c => c.Sequence) : -1;

            if (request.ParentCategoryId.HasValue)
            {
                var parent = await _categoryRepository.GetByIdAsync(request.ParentCategoryId.Value);
                if (parent == null)
                    throw new ArgumentException("A categoria principal informada não existe.");
            }

            var category = new Category
            {
                Name = trimmedName,
                Description = request.Description?.Trim(),
                Sequence = maxSeq + 1,
                ParentCategoryId = request.ParentCategoryId,
                ImageBase64 = request.ImageBase64
            };

            await _categoryRepository.AddAsync(category);

            return category;
        }

        public async Task<Category> UpdateCategoryAsync(Guid id, CategoryRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                throw new ArgumentException("O nome da categoria é obrigatório.");

            var trimmedName = request.Name.Trim();
            if (trimmedName.Length < 2 || trimmedName.Length > 50)
                throw new ArgumentException("O nome da categoria deve ter entre 2 e 50 caracteres.");

            if (request.Description != null && request.Description.Length > 200)
                throw new ArgumentException("A descrição da categoria não pode ultrapassar 200 caracteres.");

            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null)
                throw new KeyNotFoundException("Categoria não encontrada.");

            var nameLower = trimmedName.ToLower();
            var existingCategories = await _categoryRepository.FindAsync(c => c.Id != id && c.Name.ToLower() == nameLower);
            if (existingCategories.Any())
                throw new ArgumentException("Já existe outra categoria com este nome.");

            if (request.ParentCategoryId.HasValue)
            {
                if (request.ParentCategoryId.Value == id)
                    throw new ArgumentException("Uma categoria não pode ser subcategoria dela mesma.");

                var parent = await _categoryRepository.GetByIdAsync(request.ParentCategoryId.Value);
                if (parent == null)
                    throw new ArgumentException("A categoria principal informada não existe.");
            }

            category.Name = trimmedName;
            category.Description = request.Description?.Trim();
            category.ParentCategoryId = request.ParentCategoryId;
            category.ImageBase64 = request.ImageBase64;
            category.UpdatedAt = DateTime.UtcNow;

            await _categoryRepository.UpdateAsync(category);

            return category;
        }

        public async Task DeleteCategoryAsync(Guid id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null)
                throw new KeyNotFoundException("Categoria não encontrada.");

            var products = await _productRepository.FindAsync(p => p.CategoryId == id);
            if (products.Any())
                throw new InvalidOperationException("Não é possível excluir esta categoria pois ela possui produtos associados.");

            await _categoryRepository.DeleteAsync(category);
        }

        public async Task ReorderCategoriesAsync(ReorderCategoriesRequest request)
        {
            if (request.Items == null || request.Items.Count == 0)
                throw new ArgumentException("Lista de itens de ordenação inválida.");

            foreach (var item in request.Items)
            {
                var category = await _categoryRepository.GetByIdAsync(item.Id);
                if (category != null)
                {
                    category.Sequence = item.Sequence;
                    category.UpdatedAt = DateTime.UtcNow;
                    await _categoryRepository.UpdateAsync(category);
                }
            }
        }
    }
}
