using Api.Models.Role;
using Api.Core.Models;

namespace Api.Repositories
{
    public interface IRoleRepository : IRepository<Role>
    {
        Task<Role?> GetByNameAsync(string name);
        Task<IEnumerable<Role>> GetActiveAsync(); // Returns all roles since Role doesn't have IsActive
    }
}
