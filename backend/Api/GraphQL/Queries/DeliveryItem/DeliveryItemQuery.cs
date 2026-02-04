using Api.Models.DeliveryItem;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries.DeliveryItem
{
    [QueryType]
    public static class DeliveryItemQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<Models.DeliveryItem.DeliveryItem> GetDeliveryItems([Service] IDeliveryItemService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<Models.DeliveryItem.DeliveryItem?> GetDeliveryItem(int id, [Service] IDeliveryItemService service)
            => await service.GetByIdAsync(id);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<Models.DeliveryItem.DeliveryItem>> GetDeliveryItemsByDelivery(int deliveryId, [Service] IDeliveryItemService service)
            => await service.GetByDeliveryIdAsync(deliveryId);
    }
}
