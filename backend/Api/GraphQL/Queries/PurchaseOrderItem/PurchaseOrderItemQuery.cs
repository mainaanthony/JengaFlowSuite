using Api.Models;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries
{
    [QueryType]
    public static class PurchaseOrderItemQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<PurchaseOrderItem> GetPurchaseOrderItems([Service] IPurchaseOrderItemService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<PurchaseOrderItem?> GetPurchaseOrderItem(int id, [Service] IPurchaseOrderItemService service)
            => await service.GetByIdAsync(id);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<PurchaseOrderItem>> GetPurchaseOrderItemsByPurchaseOrder(int purchaseOrderId, [Service] IPurchaseOrderItemService service)
            => await service.GetByPurchaseOrderIdAsync(purchaseOrderId);
    }
}
