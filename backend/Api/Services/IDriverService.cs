using Api.Models;
using Api.Core.Models;

namespace Api.Services
{
    public interface IDriverService
    {
        Task<Driver?> GetByIdAsync(int id);
        Task<IEnumerable<Driver>> GetAllAsync();
        IQueryable<Driver> GetQueryable();
        Task<Driver> AddAsync(Driver entity, EntityLogInfo logInfo);
        Task<Driver> UpdateAsync(Driver entity, EntityLogInfo logInfo, Driver? oldEntity = null);
        Task<bool> DeleteAsync(int id, EntityLogInfo logInfo);
        Task<bool> ExistsAsync(int id);
        Task<IEnumerable<Driver>> GetActiveAsync();
        Task<IEnumerable<Driver>> GetAvailableAsync();
    }
}
