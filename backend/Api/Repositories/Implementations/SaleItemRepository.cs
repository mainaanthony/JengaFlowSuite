using Api.Models;
using Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories.Implementations
{
    public class SaleItemRepository : Repository<SaleItem>, ISaleItemRepository
    {
        public SaleItemRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<SaleItem>> GetBySaleIdAsync(int saleId)
        {
            return await _dbSet.Where(si => si.SaleId == saleId).ToListAsync();
        }
    }
}
