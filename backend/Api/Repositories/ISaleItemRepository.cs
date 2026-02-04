using Api.Models.SaleItem;
using Api.Core.Models;

namespace Api.Repositories
{
    public interface ISaleItemRepository : IRepository<SaleItem>
    {
        Task<IEnumerable<SaleItem>> GetBySaleIdAsync(int saleId);
    }
}
