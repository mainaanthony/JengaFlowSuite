using Api.Models.PurchaseOrder;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries.PurchaseOrder
{
    [QueryType]
    public static class PurchaseOrderQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<Models.PurchaseOrder.PurchaseOrder> GetPurchaseOrders([Service] IPurchaseOrderService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<Models.PurchaseOrder.PurchaseOrder?> GetPurchaseOrder(int id, [Service] IPurchaseOrderService service)
            => await service.GetByIdAsync(id);

        [UseProjection]
        public static async Task<Models.PurchaseOrder.PurchaseOrder?> GetPurchaseOrderByPONumber(string poNumber, [Service] IPurchaseOrderService service)
            => await service.GetByPONumberAsync(poNumber);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<Models.PurchaseOrder.PurchaseOrder>> GetPurchaseOrdersBySupplier(int supplierId, [Service] IPurchaseOrderService service)
            => await service.GetBySupplierIdAsync(supplierId);
    }
}
