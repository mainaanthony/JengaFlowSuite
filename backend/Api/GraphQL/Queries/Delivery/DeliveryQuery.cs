using Api.Models.Delivery;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries.Delivery
{
    [QueryType]
    public static class DeliveryQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<Models.Delivery.Delivery> GetDeliveries([Service] IDeliveryService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<Models.Delivery.Delivery?> GetDelivery(int id, [Service] IDeliveryService service)
            => await service.GetByIdAsync(id);

        [UseProjection]
        public static async Task<Models.Delivery.Delivery?> GetDeliveryByDeliveryNumber(string deliveryNumber, [Service] IDeliveryService service)
            => await service.GetByDeliveryNumberAsync(deliveryNumber);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<Models.Delivery.Delivery>> GetDeliveriesByDriver(int driverId, [Service] IDeliveryService service)
            => await service.GetByDriverIdAsync(driverId);
    }
}
