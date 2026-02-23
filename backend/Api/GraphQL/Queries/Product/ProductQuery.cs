using Api.Models;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries
{
    [ExtendObjectType("Query")]
    public static class ProductQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<Product> GetProducts([Service] IProductService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<Product?> GetProduct(int id, [Service] IProductService service)
            => await service.GetByIdAsync(id);

        [UseProjection]
        public static async Task<Product?> GetProductBySKU(string sku, [Service] IProductService service)
            => await service.GetBySKUAsync(sku);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<Product>> GetActiveProducts([Service] IProductService service)
            => await service.GetActiveAsync();
    }
}
