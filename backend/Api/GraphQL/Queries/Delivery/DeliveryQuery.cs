using Api.Models;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries
{
    [ExtendObjectType("Query")]
    public static class DeliveryQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<Delivery> GetDeliveries([Service] IDeliveryService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<Delivery?> GetDelivery(int id, [Service] IDeliveryService service)
            => await service.GetByIdAsync(id);

        [UseProjection]
        public static async Task<Delivery?> GetDeliveryByDeliveryNumber(string deliveryNumber, [Service] IDeliveryService service)
            => await service.GetByDeliveryNumberAsync(deliveryNumber);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<Delivery>> GetDeliveriesByDriver(int driverId, [Service] IDeliveryService service)
            => await service.GetByDriverIdAsync(driverId);
    }
}
