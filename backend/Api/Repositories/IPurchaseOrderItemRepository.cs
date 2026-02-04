using Api.Models.PurchaseOrderItem;
using Api.Core.Models;

namespace Api.Repositories
{
    public interface IPurchaseOrderItemRepository : IRepository<PurchaseOrderItem>
    {
        Task<IEnumerable<PurchaseOrderItem>> GetByPurchaseOrderIdAsync(int purchaseOrderId);
    }
}
