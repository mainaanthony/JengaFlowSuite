using Api.Models;
using Api.Repositories;
using Api.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Services.Implementations
{
    public class DriverService : IDriverService
    {
        private readonly IDriverRepository _repository;

        public DriverService(IDriverRepository repository)
        {
            _repository = repository;
        }

        public async Task<Driver?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Driver>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public IQueryable<Driver> GetQueryable()
        {
            return _repository.GetQueryable();
        }

        public async Task<Driver> AddAsync(Driver entity, EntityLogInfo logInfo)
        {
            entity.CreatedAt = DateTime.UtcNow;
            entity.CreatedBy = logInfo.ChangedBy;
            // TODO: Add entity logging here
            return await _repository.AddAsync(entity);
        }

        public async Task<Driver> UpdateAsync(Driver entity, EntityLogInfo logInfo, Driver? oldEntity = null)
        {
            var exists = await _repository.ExistsAsync(entity.Id);
            if (!exists)
                throw new KeyNotFoundException($"Driver with id {entity.Id} not found");

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

        public async Task<IEnumerable<Driver>> GetActiveAsync()
        {
            return await _repository.GetActiveAsync();
        }

        public async Task<IEnumerable<Driver>> GetAvailableAsync()
        {
            return await _repository.FindAsync(d => d.Status == "Available" && d.IsActive);
        }
    }
}
