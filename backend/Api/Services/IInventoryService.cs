using Api.Models.Inventory;
using Api.Core.Models;

namespace Api.Services
{
    public interface IInventoryService
    {
        Task<Inventory?> GetByIdAsync(int id);
        Task<IEnumerable<Inventory>> GetAllAsync();
        IQueryable<Inventory> GetQueryable();
        Task<Inventory> AddAsync(Inventory entity, EntityLogInfo logInfo);
        Task<Inventory> UpdateAsync(Inventory entity, EntityLogInfo logInfo, Inventory? oldEntity = null);
        Task<bool> DeleteAsync(int id, EntityLogInfo logInfo);
        Task<bool> ExistsAsync(int id);
        Task<Inventory?> GetByProductAndBranchAsync(int productId, int branchId);
        Task<IEnumerable<Inventory>> GetLowStockAsync();
    }
}
