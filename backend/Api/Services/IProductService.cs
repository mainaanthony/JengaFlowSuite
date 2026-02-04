using Api.Models.Product;
using Api.Core.Models;

namespace Api.Services
{
    public interface IProductService
    {
        Task<Product?> GetByIdAsync(int id);
        Task<IEnumerable<Product>> GetAllAsync();
        IQueryable<Product> GetQueryable();
        Task<Product> AddAsync(Product entity, EntityLogInfo logInfo);
        Task<Product> UpdateAsync(Product entity, EntityLogInfo logInfo, Product? oldEntity = null);
        Task<bool> DeleteAsync(int id, EntityLogInfo logInfo);
        Task<bool> ExistsAsync(int id);
        Task<Product?> GetBySKUAsync(string sku);
        Task<IEnumerable<Product>> GetActiveAsync();
    }
}
