using Api.Models.StockTransferItem;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries.StockTransferItem
{
    [QueryType]
    public static class StockTransferItemQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<Models.StockTransferItem.StockTransferItem> GetStockTransferItems([Service] IStockTransferItemService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<Models.StockTransferItem.StockTransferItem?> GetStockTransferItem(int id, [Service] IStockTransferItemService service)
            => await service.GetByIdAsync(id);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<Models.StockTransferItem.StockTransferItem>> GetStockTransferItemsByStockTransfer(int stockTransferId, [Service] IStockTransferItemService service)
            => await service.GetByStockTransferIdAsync(stockTransferId);
    }
}
