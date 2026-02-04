using Api.Models.Inventory;
using Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories.Implementations
{
    public class InventoryRepository : Repository<Inventory>, IInventoryRepository
    {
        public InventoryRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<Inventory?> GetByProductAndBranchAsync(int productId, int branchId)
        {
            return await _dbSet.FirstOrDefaultAsync(i => i.ProductId == productId && i.BranchId == branchId);
        }

        public async Task<IEnumerable<Inventory>> GetByBranchAsync(int branchId)
        {
            return await _dbSet.Where(i => i.BranchId == branchId).ToListAsync();
        }

        public async Task<IEnumerable<Inventory>> GetByProductAsync(int productId)
        {
            return await _dbSet.Where(i => i.ProductId == productId).ToListAsync();
        }

        public async Task<IEnumerable<Inventory>> GetLowStockAsync(int branchId)
        {
            return await _dbSet.Where(i => i.BranchId == branchId && i.Quantity <= i.ReorderLevel).ToListAsync();
        }
    }
}
