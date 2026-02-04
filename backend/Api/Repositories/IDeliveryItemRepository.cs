using Api.Models.DeliveryItem;
using Api.Core.Models;

namespace Api.Repositories
{
    public interface IDeliveryItemRepository : IRepository<DeliveryItem>
    {
        Task<IEnumerable<DeliveryItem>> GetByDeliveryIdAsync(int deliveryId);
    }
}
