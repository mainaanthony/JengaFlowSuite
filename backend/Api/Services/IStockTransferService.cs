using Api.Models.StockTransfer;
using Api.Core.Models;

namespace Api.Services
{
    public interface IStockTransferService
    {
        Task<StockTransfer?> GetByIdAsync(int id);
        Task<IEnumerable<StockTransfer>> GetAllAsync();
        IQueryable<StockTransfer> GetQueryable();
        Task<StockTransfer> AddAsync(StockTransfer entity, EntityLogInfo logInfo);
        Task<StockTransfer> UpdateAsync(StockTransfer entity, EntityLogInfo logInfo, StockTransfer? oldEntity = null);
        Task<bool> DeleteAsync(int id, EntityLogInfo logInfo);
        Task<bool> ExistsAsync(int id);
        Task<StockTransfer?> GetByTransferNumberAsync(string transferNumber);
        Task<IEnumerable<StockTransfer>> GetByBranchIdAsync(int branchId);
    }
}
