using Api.Models;
using Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories.Implementations
{
    public class StockTransferItemRepository : Repository<StockTransferItem>, IStockTransferItemRepository
    {
        public StockTransferItemRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<StockTransferItem>> GetByStockTransferIdAsync(int stockTransferId)
        {
            return await _dbSet.Where(sti => sti.StockTransferId == stockTransferId).ToListAsync();
        }
    }
}
