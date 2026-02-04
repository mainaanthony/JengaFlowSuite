using Api.Models.PurchaseOrderItem;
using Api.Core.Models;

namespace Api.Services
{
    public interface IPurchaseOrderItemService
    {
        Task<PurchaseOrderItem?> GetByIdAsync(int id);
        Task<IEnumerable<PurchaseOrderItem>> GetAllAsync();
        IQueryable<PurchaseOrderItem> GetQueryable();
        Task<PurchaseOrderItem> AddAsync(PurchaseOrderItem entity, EntityLogInfo logInfo);
        Task<PurchaseOrderItem> UpdateAsync(PurchaseOrderItem entity, EntityLogInfo logInfo, PurchaseOrderItem? oldEntity = null);
        Task<bool> DeleteAsync(int id, EntityLogInfo logInfo);
        Task<bool> ExistsAsync(int id);
        Task<IEnumerable<PurchaseOrderItem>> GetByPurchaseOrderIdAsync(int purchaseOrderId);
    }
}
