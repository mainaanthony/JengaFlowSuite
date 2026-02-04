using Api.Models.PurchaseOrder;
using Api.Core.Models;

namespace Api.Repositories
{
    public interface IPurchaseOrderRepository : IRepository<PurchaseOrder>
    {
        Task<PurchaseOrder?> GetByPONumberAsync(string poNumber);
        Task<IEnumerable<PurchaseOrder>> GetBySupplierIdAsync(int supplierId);
        Task<IEnumerable<PurchaseOrder>> GetPendingOrdersAsync();
    }
}
