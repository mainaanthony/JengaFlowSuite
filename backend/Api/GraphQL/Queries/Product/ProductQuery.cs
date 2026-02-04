using Api.Models.Product;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries.Product
{
    [QueryType]
    public static class ProductQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<Models.Product.Product> GetProducts([Service] IProductService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<Models.Product.Product?> GetProduct(int id, [Service] IProductService service)
            => await service.GetByIdAsync(id);

        [UseProjection]
        public static async Task<Models.Product.Product?> GetProductBySKU(string sku, [Service] IProductService service)
            => await service.GetBySKUAsync(sku);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<Models.Product.Product>> GetActiveProducts([Service] IProductService service)
            => await service.GetActiveAsync();
    }
}
