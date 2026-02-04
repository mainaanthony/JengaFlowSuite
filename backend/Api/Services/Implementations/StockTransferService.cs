using Api.Models.StockTransfer;
using Api.Repositories;
using Api.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Services.Implementations
{
    public class StockTransferService : IStockTransferService
    {
        private readonly IStockTransferRepository _repository;

        public StockTransferService(IStockTransferRepository repository)
        {
            _repository = repository;
        }

        public async Task<StockTransfer?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<StockTransfer>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public IQueryable<StockTransfer> GetQueryable()
        {
            return _repository.GetQueryable();
        }

        public async Task<StockTransfer> AddAsync(StockTransfer entity, EntityLogInfo logInfo)
        {
            entity.CreatedAt = DateTime.UtcNow;
            entity.CreatedBy = logInfo.ChangedBy;
            // TODO: Add entity logging here
            return await _repository.AddAsync(entity);
        }

        public async Task<StockTransfer> UpdateAsync(StockTransfer entity, EntityLogInfo logInfo, StockTransfer? oldEntity = null)
        {
            var exists = await _repository.ExistsAsync(entity.Id);
            if (!exists)
                throw new KeyNotFoundException($"StockTransfer with id {entity.Id} not found");

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

        public async Task<StockTransfer?> GetByTransferNumberAsync(string transferNumber)
        {
            return await _repository.GetByTransferNumberAsync(transferNumber);
        }

        public async Task<IEnumerable<StockTransfer>> GetByBranchIdAsync(int branchId)
        {
            return await _repository.GetByBranchIdAsync(branchId);
        }
    }
}
