using Api.Models.Branch;
using Api.Core.Models;

namespace Api.Repositories
{
    public interface IBranchRepository : IRepository<Branch>
    {
        Task<Branch?> GetByCodeAsync(string code);
        Task<IEnumerable<Branch>> GetActiveAsync();
    }
}
