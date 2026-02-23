using Api.Models;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries
{
    [ExtendObjectType("Query")]
    public static class PurchaseOrderQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<PurchaseOrder> GetPurchaseOrders([Service] IPurchaseOrderService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<PurchaseOrder?> GetPurchaseOrder(int id, [Service] IPurchaseOrderService service)
            => await service.GetByIdAsync(id);

        [UseProjection]
        public static async Task<PurchaseOrder?> GetPurchaseOrderByPONumber(string poNumber, [Service] IPurchaseOrderService service)
            => await service.GetByPONumberAsync(poNumber);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<PurchaseOrder>> GetPurchaseOrdersBySupplier(int supplierId, [Service] IPurchaseOrderService service)
            => await service.GetBySupplierIdAsync(supplierId);
    }
}
