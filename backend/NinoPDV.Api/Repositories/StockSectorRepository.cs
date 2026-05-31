using NinoPDV.Api.Data;
using NinoPDV.Api.Models;

namespace NinoPDV.Api.Repositories
{
    public class StockSectorRepository : Repository<StockSector>, IStockSectorRepository
    {
        public StockSectorRepository(AppDbContext context) : base(context) { }
    }
}
