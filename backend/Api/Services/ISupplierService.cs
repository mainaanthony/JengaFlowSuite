using Api.Models.Supplier;
using Api.Core.Models;

namespace Api.Services
{
    public interface ISupplierService
    {
        Task<Supplier?> GetByIdAsync(int id);
        Task<IEnumerable<Supplier>> GetAllAsync();
        IQueryable<Supplier> GetQueryable();
        Task<Supplier> AddAsync(Supplier entity, EntityLogInfo logInfo);
        Task<Supplier> UpdateAsync(Supplier entity, EntityLogInfo logInfo, Supplier? oldEntity = null);
        Task<bool> DeleteAsync(int id, EntityLogInfo logInfo);
        Task<bool> ExistsAsync(int id);
        Task<Supplier?> GetByEmailAsync(string email);
        Task<IEnumerable<Supplier>> GetActiveAsync();
    }
}
