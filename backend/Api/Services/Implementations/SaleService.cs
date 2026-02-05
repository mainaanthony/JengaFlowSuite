using Api.Models;
using Api.Repositories;
using Api.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Services.Implementations
{
    public class SaleService : ISaleService
    {
        private readonly ISaleRepository _repository;

        public SaleService(ISaleRepository repository)
        {
            _repository = repository;
        }

        public async Task<Sale?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Sale>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public IQueryable<Sale> GetQueryable()
        {
            return _repository.GetQueryable();
        }

        public async Task<Sale> AddAsync(Sale entity, EntityLogInfo logInfo)
        {
            entity.CreatedAt = DateTime.UtcNow;
            entity.CreatedBy = logInfo.ChangedBy;
            // TODO: Add entity logging here
            return await _repository.AddAsync(entity);
        }

        public async Task<Sale> UpdateAsync(Sale entity, EntityLogInfo logInfo, Sale? oldEntity = null)
        {
            var exists = await _repository.ExistsAsync(entity.Id);
            if (!exists)
                throw new KeyNotFoundException($"Sale with id {entity.Id} not found");

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

        public async Task<Sale?> GetBySaleNumberAsync(string saleNumber)
        {
            return await _repository.GetBySaleNumberAsync(saleNumber);
        }

        public async Task<IEnumerable<Sale>> GetByCustomerIdAsync(int customerId)
        {
            return await _repository.GetByCustomerIdAsync(customerId);
        }

        public async Task<IEnumerable<Sale>> GetByBranchIdAsync(int branchId)
        {
            return await _repository.GetByBranchIdAsync(branchId);
        }
    }
}
