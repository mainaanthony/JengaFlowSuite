using Api.Models.SaleItem;
using Api.Repositories;
using Api.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Services.Implementations
{
    public class SaleItemService : ISaleItemService
    {
        private readonly ISaleItemRepository _repository;

        public SaleItemService(ISaleItemRepository repository)
        {
            _repository = repository;
        }

        public async Task<SaleItem?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<SaleItem>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public IQueryable<SaleItem> GetQueryable()
        {
            return _repository.GetQueryable();
        }

        public async Task<SaleItem> AddAsync(SaleItem entity, EntityLogInfo logInfo)
        {
            entity.CreatedAt = DateTime.UtcNow;
            // TODO: Add entity logging here
            return await _repository.AddAsync(entity);
        }

        public async Task<SaleItem> UpdateAsync(SaleItem entity, EntityLogInfo logInfo, SaleItem? oldEntity = null)
        {
            var exists = await _repository.ExistsAsync(entity.Id);
            if (!exists)
                throw new KeyNotFoundException($"SaleItem with id {entity.Id} not found");

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

        public async Task<IEnumerable<SaleItem>> GetBySaleIdAsync(int saleId)
        {
            return await _repository.GetBySaleIdAsync(saleId);
        }
    }
}
