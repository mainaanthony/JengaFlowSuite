using Api.Models.Delivery;
using Api.Repositories;
using Api.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Services.Implementations
{
    public class DeliveryService : IDeliveryService
    {
        private readonly IDeliveryRepository _repository;

        public DeliveryService(IDeliveryRepository repository)
        {
            _repository = repository;
        }

        public async Task<Delivery?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Delivery>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public IQueryable<Delivery> GetQueryable()
        {
            return _repository.GetQueryable();
        }

        public async Task<Delivery> AddAsync(Delivery entity, EntityLogInfo logInfo)
        {
            entity.CreatedAt = DateTime.UtcNow;
            entity.CreatedBy = logInfo.ChangedBy;
            // TODO: Add entity logging here
            return await _repository.AddAsync(entity);
        }

        public async Task<Delivery> UpdateAsync(Delivery entity, EntityLogInfo logInfo, Delivery? oldEntity = null)
        {
            var exists = await _repository.ExistsAsync(entity.Id);
            if (!exists)
                throw new KeyNotFoundException($"Delivery with id {entity.Id} not found");

            entity.UpdatedAt = DateTime.UtcNow;
            entity.UpdatedBy = logInfo.ChangedBy;
            // TODO: Add entity logging here with oldEntity comparison
            return await _repository.UpdateAsync(entity);
        }

        public async Task<bool> DeleteAsync(int id, EntityLogInfo logInfo)
        {
            // TODO: Add entity logging here
            return await _repository.DeleteAsync(id);
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _repository.ExistsAsync(id);
        }

        public async Task<Delivery?> GetByDeliveryNumberAsync(string deliveryNumber)
        {
            return await _repository.GetByDeliveryNumberAsync(deliveryNumber);
        }

        public async Task<IEnumerable<Delivery>> GetByDriverIdAsync(int driverId)
        {
            return await _repository.GetByDriverIdAsync(driverId);
        }
    }
}
