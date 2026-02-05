using Api.Models;
using Api.Core.Models;

namespace Api.Repositories
{
    public interface IStockTransferRepository : IRepository<StockTransfer>
    {
        Task<StockTransfer?> GetByTransferNumberAsync(string transferNumber);
        Task<IEnumerable<StockTransfer>> GetByBranchIdAsync(int branchId);
        Task<IEnumerable<StockTransfer>> GetPendingTransfersAsync();
    }
}
