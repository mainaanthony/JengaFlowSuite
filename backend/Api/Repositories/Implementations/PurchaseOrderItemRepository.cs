using Api.Models.PurchaseOrderItem;
using Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories.Implementations
{
    public class PurchaseOrderItemRepository : Repository<PurchaseOrderItem>, IPurchaseOrderItemRepository
    {
        public PurchaseOrderItemRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<PurchaseOrderItem>> GetByPurchaseOrderIdAsync(int purchaseOrderId)
        {
            return await _dbSet.Where(poi => poi.PurchaseOrderId == purchaseOrderId).ToListAsync();
        }
    }
}
