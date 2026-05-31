using NinoPDV.Api.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NinoPDV.Api.Services
{
    public interface IProductService
    {
        Task<IEnumerable<ProductResponseDTO>> GetProductsAsync();
        Task<ProductResponseDTO?> GetProductAsync(Guid id);
        Task<ProductResponseDTO> CreateProductAsync(ProductRequestDTO request);
        Task UpdateProductAsync(Guid id, ProductRequestDTO request);
        Task DeleteProductAsync(Guid id);
    }
}
