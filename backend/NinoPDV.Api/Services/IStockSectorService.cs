using NinoPDV.Api.DTOs;
using NinoPDV.Api.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NinoPDV.Api.Services
{
    public interface IStockSectorService
    {
        Task<IEnumerable<StockSector>> GetStockSectorsAsync();
        Task<StockSector> CreateStockSectorAsync(StockSectorDTO request);
        Task<StockSector> UpdateStockSectorAsync(Guid id, StockSectorDTO request);
        Task DeleteStockSectorAsync(Guid id);
    }
}
