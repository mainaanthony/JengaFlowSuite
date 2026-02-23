using Api.Models;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries
{
    [ExtendObjectType("Query")]
    public static class DeliveryItemQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<DeliveryItem> GetDeliveryItems([Service] IDeliveryItemService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<DeliveryItem?> GetDeliveryItem(int id, [Service] IDeliveryItemService service)
            => await service.GetByIdAsync(id);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<DeliveryItem>> GetDeliveryItemsByDelivery(int deliveryId, [Service] IDeliveryItemService service)
            => await service.GetByDeliveryIdAsync(deliveryId);
    }
}
