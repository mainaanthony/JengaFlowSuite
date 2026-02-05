using Api.Models;
using Api.Repositories;
using Api.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Services.Implementations
{
    public class DeliveryItemService : IDeliveryItemService
    {
        private readonly IDeliveryItemRepository _repository;

        public DeliveryItemService(IDeliveryItemRepository repository)
        {
            _repository = repository;
        }

        public async Task<DeliveryItem?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<DeliveryItem>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public IQueryable<DeliveryItem> GetQueryable()
        {
            return _repository.GetQueryable();
        }

        public async Task<DeliveryItem> AddAsync(DeliveryItem entity, EntityLogInfo logInfo)
        {
            entity.CreatedAt = DateTime.UtcNow;
            // TODO: Add entity logging here
            return await _repository.AddAsync(entity);
        }

        public async Task<DeliveryItem> UpdateAsync(DeliveryItem entity, EntityLogInfo logInfo, DeliveryItem? oldEntity = null)
        {
            var exists = await _repository.ExistsAsync(entity.Id);
            if (!exists)
                throw new KeyNotFoundException($"DeliveryItem with id {entity.Id} not found");

            entity.UpdatedAt = DateTime.UtcNow;
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

        public async Task<IEnumerable<DeliveryItem>> GetByDeliveryIdAsync(int deliveryId)
        {
            return await _repository.GetByDeliveryIdAsync(deliveryId);
        }
    }
}
