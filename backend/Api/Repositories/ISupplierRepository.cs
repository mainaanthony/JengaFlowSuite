using Api.Models;
using Api.Core.Models;

namespace Api.Repositories
{
    public interface ISupplierRepository : IRepository<Supplier>
    {
        Task<IEnumerable<Supplier>> GetActiveAsync();
        Task<IEnumerable<Supplier>> GetByCategoryAsync(string category);
    }
}
