using Api.Models.Supplier;
using Api.Repositories;
using Api.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Services.Implementations
{
    public class SupplierService : ISupplierService
    {
        private readonly ISupplierRepository _repository;

        public SupplierService(ISupplierRepository repository)
        {
            _repository = repository;
        }

        public async Task<Supplier?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Supplier>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public IQueryable<Supplier> GetQueryable()
        {
            return _repository.GetQueryable();
        }

        public async Task<Supplier> AddAsync(Supplier entity, EntityLogInfo logInfo)
        {
            entity.CreatedAt = DateTime.UtcNow;
            entity.CreatedBy = logInfo.ChangedBy;
            // TODO: Add entity logging here
            return await _repository.AddAsync(entity);
        }

        public async Task<Supplier> UpdateAsync(Supplier entity, EntityLogInfo logInfo, Supplier? oldEntity = null)
        {
            var exists = await _repository.ExistsAsync(entity.Id);
            if (!exists)
                throw new KeyNotFoundException($"Supplier with id {entity.Id} not found");

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

        public async Task<Supplier?> GetByEmailAsync(string email)
        {
            var suppliers = await _repository.FindAsync(s => s.Email == email);
            return suppliers.FirstOrDefault();
        }

        public async Task<IEnumerable<Supplier>> GetActiveAsync()
        {
            return await _repository.GetActiveAsync();
        }
    }
}
