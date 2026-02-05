using Api.Models;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries
{
    [QueryType]
    public static class InventoryQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<Inventory> GetInventories([Service] IInventoryService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<Inventory?> GetInventory(int id, [Service] IInventoryService service)
            => await service.GetByIdAsync(id);

        [UseProjection]
        public static async Task<Inventory?> GetInventoryByProductAndBranch(
            int productId,
            int branchId,
            [Service] IInventoryService service)
            => await service.GetByProductAndBranchAsync(productId, branchId);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<Inventory>> GetLowStockItems([Service] IInventoryService service)
            => await service.GetLowStockAsync();
    }
}
