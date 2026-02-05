using Api.Models;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries
{
    [QueryType]
    public static class SaleItemQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<SaleItem> GetSaleItems([Service] ISaleItemService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<SaleItem?> GetSaleItem(int id, [Service] ISaleItemService service)
            => await service.GetByIdAsync(id);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<SaleItem>> GetSaleItemsBySale(int saleId, [Service] ISaleItemService service)
            => await service.GetBySaleIdAsync(saleId);
    }
}
