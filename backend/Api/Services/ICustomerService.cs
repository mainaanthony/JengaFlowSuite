using Api.Models;
using Api.Core.Models;

namespace Api.Services
{
    public interface ICustomerService
    {
        Task<Customer?> GetByIdAsync(int id);
        Task<IEnumerable<Customer>> GetAllAsync();
        IQueryable<Customer> GetQueryable();
        Task<Customer> AddAsync(Customer entity, EntityLogInfo logInfo);
        Task<Customer> UpdateAsync(Customer entity, EntityLogInfo logInfo, Customer? oldEntity = null);
        Task<bool> DeleteAsync(int id, EntityLogInfo logInfo);
        Task<bool> ExistsAsync(int id);
        Task<Customer?> GetByEmailAsync(string email);
        Task<IEnumerable<Customer>> GetActiveAsync();
    }
}
