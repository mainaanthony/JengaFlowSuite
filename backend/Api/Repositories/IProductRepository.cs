using Api.Models.Product;
using Api.Core.Models;

namespace Api.Repositories
{
    public interface IProductRepository : IRepository<Product>
    {
        Task<Product?> GetBySKUAsync(string sku);
        Task<IEnumerable<Product>> GetActivProductsAsync();
        Task<IEnumerable<Product>> GetByCategoryAsync(int categoryId);
    }
}
