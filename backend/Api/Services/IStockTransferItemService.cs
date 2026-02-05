using Api.Models;
using Api.Core.Models;

namespace Api.Services
{
    public interface IStockTransferItemService
    {
        Task<StockTransferItem?> GetByIdAsync(int id);
        Task<IEnumerable<StockTransferItem>> GetAllAsync();
        IQueryable<StockTransferItem> GetQueryable();
        Task<StockTransferItem> AddAsync(StockTransferItem entity, EntityLogInfo logInfo);
        Task<StockTransferItem> UpdateAsync(StockTransferItem entity, EntityLogInfo logInfo, StockTransferItem? oldEntity = null);
        Task<bool> DeleteAsync(int id, EntityLogInfo logInfo);
        Task<bool> ExistsAsync(int id);
        Task<IEnumerable<StockTransferItem>> GetByStockTransferIdAsync(int stockTransferId);
    }
}
