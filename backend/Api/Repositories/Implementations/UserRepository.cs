using Api.Models;
using Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories.Implementations
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<IEnumerable<User>> GetActiveAsync()
        {
            return await _dbSet.Where(u => u.IsActive).ToListAsync();
        }

        public async Task<IEnumerable<User>> GetByBranchAsync(int branchId)
        {
            return await _dbSet.Where(u => u.BranchId == branchId).ToListAsync();
        }

        public async Task<IEnumerable<User>> GetByRoleAsync(int roleId)
        {
            return await _dbSet.Where(u => u.RoleId == roleId).ToListAsync();
        }
    }
}
