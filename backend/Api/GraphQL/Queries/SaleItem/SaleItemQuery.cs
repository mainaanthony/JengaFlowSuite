using Api.Models.SaleItem;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries.SaleItem
{
    [QueryType]
    public static class SaleItemQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<Models.SaleItem.SaleItem> GetSaleItems([Service] ISaleItemService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<Models.SaleItem.SaleItem?> GetSaleItem(int id, [Service] ISaleItemService service)
            => await service.GetByIdAsync(id);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<Models.SaleItem.SaleItem>> GetSaleItemsBySale(int saleId, [Service] ISaleItemService service)
            => await service.GetBySaleIdAsync(saleId);
    }
}
