using Api.Models;
using Api.Core.Models;

namespace Api.Repositories
{
    public interface ISaleRepository : IRepository<Sale>
    {
        Task<Sale?> GetBySaleNumberAsync(string saleNumber);
        Task<IEnumerable<Sale>> GetByCustomerIdAsync(int customerId);
        Task<IEnumerable<Sale>> GetByBranchIdAsync(int branchId);
        Task<IEnumerable<Sale>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
    }
}
