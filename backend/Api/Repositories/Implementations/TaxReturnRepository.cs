using Api.Models;
using Api.Data;
using Api.Enums;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories.Implementations
{
    public class TaxReturnRepository : Repository<TaxReturn>, ITaxReturnRepository
    {
        public TaxReturnRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<TaxReturn?> GetByPeriodAsync(string period)
        {
            return await _dbSet.FirstOrDefaultAsync(tr => tr.Period == period);
        }

        public async Task<IEnumerable<TaxReturn>> GetByStatusAsync(TaxReturnStatus status)
        {
            return await _dbSet.Where(tr => tr.Status == status).ToListAsync();
        }

        public async Task<IEnumerable<TaxReturn>> GetByTaxTypeAsync(TaxType taxType)
        {
            return await _dbSet.Where(tr => tr.TaxType == taxType).ToListAsync();
        }
    }
}
