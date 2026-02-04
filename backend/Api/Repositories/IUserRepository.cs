using Api.Models.User;
using Api.Core.Models;

namespace Api.Repositories
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetByUsernameAsync(string username);
        Task<User?> GetByEmailAsync(string email);
        Task<IEnumerable<User>> GetActiveAsync();
        Task<IEnumerable<User>> GetByBranchAsync(int branchId);
        Task<IEnumerable<User>> GetByRoleAsync(int roleId);
    }
}
