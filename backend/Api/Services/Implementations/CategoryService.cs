using Api.Models;
using Api.Repositories;
using Api.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Services.Implementations
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _repository;

        public CategoryService(ICategoryRepository repository)
        {
            _repository = repository;
        }

        public async Task<Category?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Category>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public IQueryable<Category> GetQueryable()
        {
            return _repository.GetQueryable();
        }

        public async Task<Category> AddAsync(Category entity, EntityLogInfo logInfo)
        {
            entity.CreatedAt = DateTime.UtcNow;
            entity.CreatedBy = logInfo.ChangedBy;
            // TODO: Add entity logging here
            return await _repository.AddAsync(entity);
        }

        public async Task<Category> UpdateAsync(Category entity, EntityLogInfo logInfo, Category? oldEntity = null)
        {
            var exists = await _repository.ExistsAsync(entity.Id);
            if (!exists)
                throw new KeyNotFoundException($"Category with id {entity.Id} not found");

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

        public async Task<IEnumerable<Category>> GetActiveAsync()
        {
            return await _repository.GetActiveAsync();
        }
    }
}
