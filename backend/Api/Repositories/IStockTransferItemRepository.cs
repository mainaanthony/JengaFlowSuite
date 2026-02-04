using Api.Models.StockTransferItem;
using Api.Core.Models;

namespace Api.Repositories
{
    public interface IStockTransferItemRepository : IRepository<StockTransferItem>
    {
        Task<IEnumerable<StockTransferItem>> GetByStockTransferIdAsync(int stockTransferId);
    }
}
