using Api.Models;
using Api.Core.Models;

namespace Api.Services
{
    public interface ISaleItemService
    {
        Task<SaleItem?> GetByIdAsync(int id);
        Task<IEnumerable<SaleItem>> GetAllAsync();
        IQueryable<SaleItem> GetQueryable();
        Task<SaleItem> AddAsync(SaleItem entity, EntityLogInfo logInfo);
        Task<SaleItem> UpdateAsync(SaleItem entity, EntityLogInfo logInfo, SaleItem? oldEntity = null);
        Task<bool> DeleteAsync(int id, EntityLogInfo logInfo);
        Task<bool> ExistsAsync(int id);
        Task<IEnumerable<SaleItem>> GetBySaleIdAsync(int saleId);
    }
}
