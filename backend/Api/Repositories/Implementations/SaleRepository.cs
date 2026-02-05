using Api.Models;
using Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories.Implementations
{
    public class SaleRepository : Repository<Sale>, ISaleRepository
    {
        public SaleRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<Sale?> GetBySaleNumberAsync(string saleNumber)
        {
            return await _dbSet.FirstOrDefaultAsync(s => s.SaleNumber == saleNumber);
        }

        public async Task<IEnumerable<Sale>> GetByCustomerIdAsync(int customerId)
        {
            return await _dbSet.Where(s => s.CustomerId == customerId).ToListAsync();
        }

        public async Task<IEnumerable<Sale>> GetByBranchIdAsync(int branchId)
        {
            return await _dbSet.Where(s => s.BranchId == branchId).ToListAsync();
        }

        public async Task<IEnumerable<Sale>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _dbSet.Where(s => s.SaleDate >= startDate && s.SaleDate <= endDate).ToListAsync();
        }
    }
}
