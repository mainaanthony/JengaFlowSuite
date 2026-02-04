using Api.Models.Branch;
using Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories.Implementations
{
    public class BranchRepository : Repository<Branch>, IBranchRepository
    {
        public BranchRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<Branch?> GetByCodeAsync(string code)
        {
            return await _dbSet.FirstOrDefaultAsync(b => b.Code == code);
        }

        public async Task<IEnumerable<Branch>> GetActiveAsync()
        {
            return await _dbSet.Where(b => b.IsActive).ToListAsync();
        }
    }
}
