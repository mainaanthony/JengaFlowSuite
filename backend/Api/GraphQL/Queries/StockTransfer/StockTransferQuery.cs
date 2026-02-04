using Api.Models.StockTransfer;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries.StockTransfer
{
    [QueryType]
    public static class StockTransferQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<Models.StockTransfer.StockTransfer> GetStockTransfers([Service] IStockTransferService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<Models.StockTransfer.StockTransfer?> GetStockTransfer(int id, [Service] IStockTransferService service)
            => await service.GetByIdAsync(id);

        [UseProjection]
        public static async Task<Models.StockTransfer.StockTransfer?> GetStockTransferByTransferNumber(string transferNumber, [Service] IStockTransferService service)
            => await service.GetByTransferNumberAsync(transferNumber);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<Models.StockTransfer.StockTransfer>> GetStockTransfersByBranch(int branchId, [Service] IStockTransferService service)
            => await service.GetByBranchIdAsync(branchId);
    }
}
