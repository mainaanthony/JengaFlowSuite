using Api.Models;
using Api.Core.Models;

namespace Api.Services
{
    public interface IBranchService
    {
        Task<Branch?> GetByIdAsync(int id);
        Task<IEnumerable<Branch>> GetAllAsync();
        IQueryable<Branch> GetQueryable();
        Task<Branch> AddAsync(Branch entity, EntityLogInfo logInfo);
        Task<Branch> UpdateAsync(Branch entity, EntityLogInfo logInfo, Branch? oldEntity = null);
        Task<bool> DeleteAsync(int id, EntityLogInfo logInfo);
        Task<bool> ExistsAsync(int id);
        Task<Branch?> GetByCodeAsync(string code);
        Task<IEnumerable<Branch>> GetActiveAsync();
    }
}
