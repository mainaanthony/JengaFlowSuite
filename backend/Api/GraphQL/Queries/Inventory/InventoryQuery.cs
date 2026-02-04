using Api.Models.Inventory;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries.Inventory
{
    [QueryType]
    public static class InventoryQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<Models.Inventory.Inventory> GetInventories([Service] IInventoryService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<Models.Inventory.Inventory?> GetInventory(int id, [Service] IInventoryService service)
            => await service.GetByIdAsync(id);

        [UseProjection]
        public static async Task<Models.Inventory.Inventory?> GetInventoryByProductAndBranch(
            int productId,
            int branchId,
            [Service] IInventoryService service)
            => await service.GetByProductAndBranchAsync(productId, branchId);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<Models.Inventory.Inventory>> GetLowStockItems([Service] IInventoryService service)
            => await service.GetLowStockAsync();
    }
}
