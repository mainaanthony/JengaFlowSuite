using Api.Models.Supplier;
using Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories.Implementations
{
    public class SupplierRepository : Repository<Supplier>, ISupplierRepository
    {
        public SupplierRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Supplier>> GetActiveAsync()
        {
            return await _dbSet.Where(s => s.IsActive).ToListAsync();
        }

        public async Task<IEnumerable<Supplier>> GetByCategoryAsync(string category)
        {
            return await _dbSet.Where(s => s.Category == category).ToListAsync();
        }
    }
}
