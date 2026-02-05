using Api.Models;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries
{
    [QueryType]
    public static class StockTransferItemQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<StockTransferItem> GetStockTransferItems([Service] IStockTransferItemService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<StockTransferItem?> GetStockTransferItem(int id, [Service] IStockTransferItemService service)
            => await service.GetByIdAsync(id);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<StockTransferItem>> GetStockTransferItemsByStockTransfer(int stockTransferId, [Service] IStockTransferItemService service)
            => await service.GetByStockTransferIdAsync(stockTransferId);
    }
}
