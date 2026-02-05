using Api.Models;
using Api.Core.Models;

namespace Api.Services
{
    public interface IRoleService
    {
        Task<Role?> GetByIdAsync(int id);
        Task<IEnumerable<Role>> GetAllAsync();
        IQueryable<Role> GetQueryable();
        Task<Role> AddAsync(Role entity, EntityLogInfo logInfo);
        Task<Role> UpdateAsync(Role entity, EntityLogInfo logInfo, Role? oldEntity = null);
        Task<bool> DeleteAsync(int id, EntityLogInfo logInfo);
        Task<bool> ExistsAsync(int id);
        Task<Role?> GetByNameAsync(string name);
    }
}
