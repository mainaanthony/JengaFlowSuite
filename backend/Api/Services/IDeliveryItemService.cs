using Api.Models.DeliveryItem;
using Api.Core.Models;

namespace Api.Services
{
    public interface IDeliveryItemService
    {
        Task<DeliveryItem?> GetByIdAsync(int id);
        Task<IEnumerable<DeliveryItem>> GetAllAsync();
        IQueryable<DeliveryItem> GetQueryable();
        Task<DeliveryItem> AddAsync(DeliveryItem entity, EntityLogInfo logInfo);
        Task<DeliveryItem> UpdateAsync(DeliveryItem entity, EntityLogInfo logInfo, DeliveryItem? oldEntity = null);
        Task<bool> DeleteAsync(int id, EntityLogInfo logInfo);
        Task<bool> ExistsAsync(int id);
        Task<IEnumerable<DeliveryItem>> GetByDeliveryIdAsync(int deliveryId);
    }
}
