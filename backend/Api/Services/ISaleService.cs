using Api.Models.Sale;
using Api.Core.Models;

namespace Api.Services
{
    public interface ISaleService
    {
        Task<Sale?> GetByIdAsync(int id);
        Task<IEnumerable<Sale>> GetAllAsync();
        IQueryable<Sale> GetQueryable();
        Task<Sale> AddAsync(Sale entity, EntityLogInfo logInfo);
        Task<Sale> UpdateAsync(Sale entity, EntityLogInfo logInfo, Sale? oldEntity = null);
        Task<bool> DeleteAsync(int id, EntityLogInfo logInfo);
        Task<bool> ExistsAsync(int id);
        Task<Sale?> GetBySaleNumberAsync(string saleNumber);
        Task<IEnumerable<Sale>> GetByCustomerIdAsync(int customerId);
        Task<IEnumerable<Sale>> GetByBranchIdAsync(int branchId);
    }
}
