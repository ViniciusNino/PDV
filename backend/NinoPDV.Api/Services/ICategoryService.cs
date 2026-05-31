using NinoPDV.Api.DTOs;
using NinoPDV.Api.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NinoPDV.Api.Services
{
    public interface ICategoryService
    {
        Task<IEnumerable<Category>> GetCategoriesAsync();
        Task<Category> CreateCategoryAsync(CategoryRequest request);
        Task<Category> UpdateCategoryAsync(Guid id, CategoryRequest request);
        Task DeleteCategoryAsync(Guid id);
        Task ReorderCategoriesAsync(ReorderCategoriesRequest request);
    }
}
