using Api.Models.TaxReturn;
using Api.Core.Models;
using Api.Enums;

namespace Api.Services
{
    public interface ITaxReturnService
    {
        Task<TaxReturn?> GetByIdAsync(int id);
        Task<IEnumerable<TaxReturn>> GetAllAsync();
        IQueryable<TaxReturn> GetQueryable();
        Task<TaxReturn> AddAsync(TaxReturn entity, EntityLogInfo logInfo);
        Task<TaxReturn> UpdateAsync(TaxReturn entity, EntityLogInfo logInfo, TaxReturn? oldEntity = null);
        Task<bool> DeleteAsync(int id, EntityLogInfo logInfo);
        Task<bool> ExistsAsync(int id);
        Task<TaxReturn?> GetByPeriodAsync(string period);
        Task<IEnumerable<TaxReturn>> GetByStatusAsync(TaxReturnStatus status);
    }
}
