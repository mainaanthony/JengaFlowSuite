using Api.Models;
using Api.Data;
using Api.Enums;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories.Implementations
{
    public class PurchaseOrderRepository : Repository<PurchaseOrder>, IPurchaseOrderRepository
    {
        public PurchaseOrderRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<PurchaseOrder?> GetByPONumberAsync(string poNumber)
        {
            return await _dbSet.FirstOrDefaultAsync(po => po.PONumber == poNumber);
        }

        public async Task<IEnumerable<PurchaseOrder>> GetBySupplierIdAsync(int supplierId)
        {
            return await _dbSet.Where(po => po.SupplierId == supplierId).ToListAsync();
        }

        public async Task<IEnumerable<PurchaseOrder>> GetPendingOrdersAsync()
        {
            return await _dbSet.Where(po => po.Status == OrderStatus.Pending).ToListAsync();
        }
    }
}
