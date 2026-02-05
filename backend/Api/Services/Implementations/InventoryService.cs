using Api.Models;
using Api.Repositories;
using Api.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Services.Implementations
{
    public class InventoryService : IInventoryService
    {
        private readonly IInventoryRepository _repository;

        public InventoryService(IInventoryRepository repository)
        {
            _repository = repository;
        }

        public async Task<Inventory?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Inventory>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public IQueryable<Inventory> GetQueryable()
        {
            return _repository.GetQueryable();
        }

        public async Task<Inventory> AddAsync(Inventory entity, EntityLogInfo logInfo)
        {
            entity.CreatedAt = DateTime.UtcNow;
            entity.CreatedBy = logInfo.ChangedBy;
            // TODO: Add entity logging here
            return await _repository.AddAsync(entity);
        }

        public async Task<Inventory> UpdateAsync(Inventory entity, EntityLogInfo logInfo, Inventory? oldEntity = null)
        {
            var exists = await _repository.ExistsAsync(entity.Id);
            if (!exists)
                throw new KeyNotFoundException($"Inventory with id {entity.Id} not found");

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

        public async Task<Inventory?> GetByProductAndBranchAsync(int productId, int branchId)
        {
            return await _repository.GetByProductAndBranchAsync(productId, branchId);
        }

        public async Task<IEnumerable<Inventory>> GetLowStockAsync()
        {
            return await _repository.FindAsync(i => i.Quantity <= i.ReorderLevel);
        }
    }
}
