using Api.Models;
using Api.Repositories;
using Api.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Services.Implementations
{
    public class PurchaseOrderItemService : IPurchaseOrderItemService
    {
        private readonly IPurchaseOrderItemRepository _repository;

        public PurchaseOrderItemService(IPurchaseOrderItemRepository repository)
        {
            _repository = repository;
        }

        public async Task<PurchaseOrderItem?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<PurchaseOrderItem>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public IQueryable<PurchaseOrderItem> GetQueryable()
        {
            return _repository.GetQueryable();
        }

        public async Task<PurchaseOrderItem> AddAsync(PurchaseOrderItem entity, EntityLogInfo logInfo)
        {
            entity.CreatedAt = DateTime.UtcNow;
            // TODO: Add entity logging here
            return await _repository.AddAsync(entity);
        }

        public async Task<PurchaseOrderItem> UpdateAsync(PurchaseOrderItem entity, EntityLogInfo logInfo, PurchaseOrderItem? oldEntity = null)
        {
            var exists = await _repository.ExistsAsync(entity.Id);
            if (!exists)
                throw new KeyNotFoundException($"PurchaseOrderItem with id {entity.Id} not found");

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

        public async Task<IEnumerable<PurchaseOrderItem>> GetByPurchaseOrderIdAsync(int purchaseOrderId)
        {
            return await _repository.GetByPurchaseOrderIdAsync(purchaseOrderId);
        }
    }
}
