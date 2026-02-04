using Api.Models.Role;
using Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories.Implementations
{
    public class RoleRepository : Repository<Role>, IRoleRepository
    {
        public RoleRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<Role?> GetByNameAsync(string name)
        {
            return await _dbSet.FirstOrDefaultAsync(r => r.Name == name);
        }

        public async Task<IEnumerable<Role>> GetActiveAsync()
        {
            return await _dbSet.ToListAsync();
        }
    }
}
