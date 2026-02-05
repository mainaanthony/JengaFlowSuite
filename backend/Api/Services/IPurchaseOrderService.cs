using Api.Models;
using Api.Core.Models;

namespace Api.Services
{
    public interface IPurchaseOrderService
    {
        Task<PurchaseOrder?> GetByIdAsync(int id);
        Task<IEnumerable<PurchaseOrder>> GetAllAsync();
        IQueryable<PurchaseOrder> GetQueryable();
        Task<PurchaseOrder> AddAsync(PurchaseOrder entity, EntityLogInfo logInfo);
        Task<PurchaseOrder> UpdateAsync(PurchaseOrder entity, EntityLogInfo logInfo, PurchaseOrder? oldEntity = null);
        Task<bool> DeleteAsync(int id, EntityLogInfo logInfo);
        Task<bool> ExistsAsync(int id);
        Task<PurchaseOrder?> GetByPONumberAsync(string poNumber);
        Task<IEnumerable<PurchaseOrder>> GetBySupplierIdAsync(int supplierId);
    }
}
