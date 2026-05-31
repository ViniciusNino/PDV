using NinoPDV.Api.DTOs;
using NinoPDV.Api.Models;
using NinoPDV.Api.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NinoPDV.Api.Services
{
    public class StockSectorService : IStockSectorService
    {
        private readonly IStockSectorRepository _stockSectorRepository;
        private readonly IProductRepository _productRepository;

        public StockSectorService(IStockSectorRepository stockSectorRepository, IProductRepository productRepository)
        {
            _stockSectorRepository = stockSectorRepository;
            _productRepository = productRepository;
        }

        public async Task<IEnumerable<StockSector>> GetStockSectorsAsync()
        {
            var sectors = await _stockSectorRepository.GetAllAsync();
            return sectors.OrderBy(s => s.Name);
        }

        public async Task<StockSector> CreateStockSectorAsync(StockSectorDTO request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                throw new ArgumentException("O nome do setor de estoque é obrigatório.");

            var trimmedName = request.Name.Trim();
            if (trimmedName.Length < 2 || trimmedName.Length > 50)
                throw new ArgumentException("O nome do setor deve ter entre 2 e 50 caracteres.");

            if (request.Description != null && request.Description.Length > 200)
                throw new ArgumentException("A descrição do setor não pode ultrapassar 200 caracteres.");

            var nameLower = trimmedName.ToLower();
            var existing = await _stockSectorRepository.FindAsync(s => s.Name.ToLower() == nameLower);
            if (existing.Any())
                throw new ArgumentException("Já existe um setor de estoque com este nome.");

            var sector = new StockSector
            {
                Name = trimmedName,
                Description = request.Description?.Trim()
            };

            await _stockSectorRepository.AddAsync(sector);
            return sector;
        }

        public async Task<StockSector> UpdateStockSectorAsync(Guid id, StockSectorDTO request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                throw new ArgumentException("O nome do setor de estoque é obrigatório.");

            var trimmedName = request.Name.Trim();
            if (trimmedName.Length < 2 || trimmedName.Length > 50)
                throw new ArgumentException("O nome do setor deve ter entre 2 e 50 caracteres.");

            if (request.Description != null && request.Description.Length > 200)
                throw new ArgumentException("A descrição do setor não pode ultrapassar 200 caracteres.");

            var sector = await _stockSectorRepository.GetByIdAsync(id);
            if (sector == null)
                throw new KeyNotFoundException("Setor de estoque não encontrado.");

            var nameLower = trimmedName.ToLower();
            var existing = await _stockSectorRepository.FindAsync(s => s.Id != id && s.Name.ToLower() == nameLower);
            if (existing.Any())
                throw new ArgumentException("Já existe outro setor de estoque com este nome.");

            sector.Name = trimmedName;
            sector.Description = request.Description?.Trim();
            sector.UpdatedAt = DateTime.UtcNow;

            await _stockSectorRepository.UpdateAsync(sector);
            return sector;
        }

        public async Task DeleteStockSectorAsync(Guid id)
        {
            var sector = await _stockSectorRepository.GetByIdAsync(id);
            if (sector == null)
                throw new KeyNotFoundException("Setor de estoque não encontrado.");

            var hasProducts = await _productRepository.FindAsync(p => p.StockSectorId == id);
            if (hasProducts.Any())
                throw new InvalidOperationException("Não é possível excluir este setor pois existem produtos associados a ele.");

            await _stockSectorRepository.DeleteAsync(sector);
        }
    }
}
