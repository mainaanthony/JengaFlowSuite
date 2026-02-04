using Api.Models.PurchaseOrderItem;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries.PurchaseOrderItem
{
    [QueryType]
    public static class PurchaseOrderItemQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<Models.PurchaseOrderItem.PurchaseOrderItem> GetPurchaseOrderItems([Service] IPurchaseOrderItemService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<Models.PurchaseOrderItem.PurchaseOrderItem?> GetPurchaseOrderItem(int id, [Service] IPurchaseOrderItemService service)
            => await service.GetByIdAsync(id);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<Models.PurchaseOrderItem.PurchaseOrderItem>> GetPurchaseOrderItemsByPurchaseOrder(int purchaseOrderId, [Service] IPurchaseOrderItemService service)
            => await service.GetByPurchaseOrderIdAsync(purchaseOrderId);
    }
}
