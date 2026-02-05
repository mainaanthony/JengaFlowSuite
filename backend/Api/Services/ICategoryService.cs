using Api.Models;
using Api.Core.Models;

namespace Api.Services
{
    public interface ICategoryService
    {
        Task<Category?> GetByIdAsync(int id);
        Task<IEnumerable<Category>> GetAllAsync();
        IQueryable<Category> GetQueryable();
        Task<Category> AddAsync(Category entity, EntityLogInfo logInfo);
        Task<Category> UpdateAsync(Category entity, EntityLogInfo logInfo, Category? oldEntity = null);
        Task<bool> DeleteAsync(int id, EntityLogInfo logInfo);
        Task<bool> ExistsAsync(int id);
        Task<IEnumerable<Category>> GetActiveAsync();
    }
}
