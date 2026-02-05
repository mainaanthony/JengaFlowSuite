using Api.Models;
using Api.Core.Models;

namespace Api.Repositories
{
    public interface IInventoryRepository : IRepository<Inventory>
    {
        Task<Inventory?> GetByProductAndBranchAsync(int productId, int branchId);
        Task<IEnumerable<Inventory>> GetByBranchAsync(int branchId);
        Task<IEnumerable<Inventory>> GetByProductAsync(int productId);
        Task<IEnumerable<Inventory>> GetLowStockAsync(int branchId);
    }
}
