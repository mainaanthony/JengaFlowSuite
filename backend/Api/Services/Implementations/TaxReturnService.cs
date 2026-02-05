using Api.Models;
using Api.Repositories;
using Api.Core.Models;
using Api.Enums;
using Microsoft.EntityFrameworkCore;

namespace Api.Services.Implementations
{
    public class TaxReturnService : ITaxReturnService
    {
        private readonly ITaxReturnRepository _repository;

        public TaxReturnService(ITaxReturnRepository repository)
        {
            _repository = repository;
        }

        public async Task<TaxReturn?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<TaxReturn>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public IQueryable<TaxReturn> GetQueryable()
        {
            return _repository.GetQueryable();
        }

        public async Task<TaxReturn> AddAsync(TaxReturn entity, EntityLogInfo logInfo)
        {
            entity.CreatedAt = DateTime.UtcNow;
            entity.CreatedBy = logInfo.ChangedBy;
            // TODO: Add entity logging here
            return await _repository.AddAsync(entity);
        }

        public async Task<TaxReturn> UpdateAsync(TaxReturn entity, EntityLogInfo logInfo, TaxReturn? oldEntity = null)
        {
            var exists = await _repository.ExistsAsync(entity.Id);
            if (!exists)
                throw new KeyNotFoundException($"TaxReturn with id {entity.Id} not found");

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

        public async Task<TaxReturn?> GetByPeriodAsync(string period)
        {
            return await _repository.GetByPeriodAsync(period);
        }

        public async Task<IEnumerable<TaxReturn>> GetByStatusAsync(TaxReturnStatus status)
        {
            return await _repository.GetByStatusAsync(status);
        }
    }
}
