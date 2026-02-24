using Api.Models;
using Api.Repositories;
using Api.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Services.Implementations
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repository;

        public ProductService(IProductRepository repository)
        {
            _repository = repository;
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public IQueryable<Product> GetQueryable()
        {
            return _repository.GetQueryable();
        }

        public async Task<Product> AddAsync(Product entity, EntityLogInfo logInfo)
        {
            // Check for duplicate SKU
            var existingProduct = await GetBySKUAsync(entity.SKU);
            if (existingProduct != null)
            {
                throw new InvalidOperationException($"A product with SKU '{entity.SKU}' already exists.");
            }

            entity.CreatedAt = DateTime.UtcNow;
            entity.CreatedBy = logInfo.ChangedBy;
            return await _repository.AddAsync(entity);
        }

        public async Task<Product> UpdateAsync(Product entity, EntityLogInfo logInfo, Product? oldEntity = null)
        {
            var exists = await _repository.ExistsAsync(entity.Id);
            if (!exists)
                throw new KeyNotFoundException($"Product with id {entity.Id} not found");

            // Check for duplicate SKU (excluding the current product being updated)
            var existingProduct = await GetBySKUAsync(entity.SKU);
            if (existingProduct != null && existingProduct.Id != entity.Id)
            {
                throw new InvalidOperationException($"Another product with SKU '{entity.SKU}' already exists.");
            }

            entity.UpdatedAt = DateTime.UtcNow;
            entity.UpdatedBy = logInfo.ChangedBy;
            return await _repository.UpdateAsync(entity);
        }

        public async Task<bool> DeleteAsync(int id, EntityLogInfo logInfo)
        {
            return await _repository.DeleteAsync(id);
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _repository.ExistsAsync(id);
        }

        public async Task<Product?> GetBySKUAsync(string sku)
        {
            return await _repository.GetBySKUAsync(sku);
        }

        public async Task<IEnumerable<Product>> GetActiveAsync()
        {
            return await _repository.GetActivProductsAsync();
        }
    }
}
