using Api.Models.Delivery;
using Api.Core.Models;

namespace Api.Repositories
{
    public interface IDeliveryRepository : IRepository<Delivery>
    {
        Task<Delivery?> GetByDeliveryNumberAsync(string deliveryNumber);
        Task<IEnumerable<Delivery>> GetByDriverIdAsync(int driverId);
        Task<IEnumerable<Delivery>> GetScheduledDeliveriesAsync();
    }
}
