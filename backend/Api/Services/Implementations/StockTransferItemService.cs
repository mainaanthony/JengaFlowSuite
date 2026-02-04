using Api.Models.StockTransferItem;
using Api.Repositories;
using Api.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Services.Implementations
{
    public class StockTransferItemService : IStockTransferItemService
    {
        private readonly IStockTransferItemRepository _repository;

        public StockTransferItemService(IStockTransferItemRepository repository)
        {
            _repository = repository;
        }

        public async Task<StockTransferItem?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<StockTransferItem>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public IQueryable<StockTransferItem> GetQueryable()
        {
            return _repository.GetQueryable();
        }

        public async Task<StockTransferItem> AddAsync(StockTransferItem entity, EntityLogInfo logInfo)
        {
            entity.CreatedAt = DateTime.UtcNow;
            // TODO: Add entity logging here
            return await _repository.AddAsync(entity);
        }

        public async Task<StockTransferItem> UpdateAsync(StockTransferItem entity, EntityLogInfo logInfo, StockTransferItem? oldEntity = null)
        {
            var exists = await _repository.ExistsAsync(entity.Id);
            if (!exists)
                throw new KeyNotFoundException($"StockTransferItem with id {entity.Id} not found");

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

        public async Task<IEnumerable<StockTransferItem>> GetByStockTransferIdAsync(int stockTransferId)
        {
            return await _repository.GetByStockTransferIdAsync(stockTransferId);
        }
    }
}
