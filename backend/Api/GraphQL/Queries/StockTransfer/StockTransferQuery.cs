using Api.Models;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries
{
    [ExtendObjectType("Query")]
    public static class StockTransferQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<StockTransfer> GetStockTransfers([Service] IStockTransferService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<StockTransfer?> GetStockTransfer(int id, [Service] IStockTransferService service)
            => await service.GetByIdAsync(id);

        [UseProjection]
        public static async Task<StockTransfer?> GetStockTransferByTransferNumber(string transferNumber, [Service] IStockTransferService service)
            => await service.GetByTransferNumberAsync(transferNumber);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<StockTransfer>> GetStockTransfersByBranch(int branchId, [Service] IStockTransferService service)
            => await service.GetByBranchIdAsync(branchId);
    }
}
