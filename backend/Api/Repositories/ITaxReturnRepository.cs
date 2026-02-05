using Api.Models;
using Api.Core.Models;
using Api.Enums;

namespace Api.Repositories
{
    public interface ITaxReturnRepository : IRepository<TaxReturn>
    {
        Task<TaxReturn?> GetByPeriodAsync(string period);
        Task<IEnumerable<TaxReturn>> GetByStatusAsync(TaxReturnStatus status);
        Task<IEnumerable<TaxReturn>> GetByTaxTypeAsync(TaxType taxType);
    }
}
