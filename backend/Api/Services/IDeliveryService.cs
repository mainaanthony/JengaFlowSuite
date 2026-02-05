using Api.Models;
using Api.Core.Models;

namespace Api.Services
{
    public interface IDeliveryService
    {
        Task<Delivery?> GetByIdAsync(int id);
        Task<IEnumerable<Delivery>> GetAllAsync();
        IQueryable<Delivery> GetQueryable();
        Task<Delivery> AddAsync(Delivery entity, EntityLogInfo logInfo);
        Task<Delivery> UpdateAsync(Delivery entity, EntityLogInfo logInfo, Delivery? oldEntity = null);
        Task<bool> DeleteAsync(int id, EntityLogInfo logInfo);
        Task<bool> ExistsAsync(int id);
        Task<Delivery?> GetByDeliveryNumberAsync(string deliveryNumber);
        Task<IEnumerable<Delivery>> GetByDriverIdAsync(int driverId);
    }
}
