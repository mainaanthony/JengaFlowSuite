using Api.Models;
using Api.Repositories;
using Api.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Services.Implementations
{
    public class PurchaseOrderService : IPurchaseOrderService
    {
        private readonly IPurchaseOrderRepository _repository;

        public PurchaseOrderService(IPurchaseOrderRepository repository)
        {
            _repository = repository;
        }

        public async Task<PurchaseOrder?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<PurchaseOrder>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public IQueryable<PurchaseOrder> GetQueryable()
        {
            return _repository.GetQueryable();
        }

        public async Task<PurchaseOrder> AddAsync(PurchaseOrder entity, EntityLogInfo logInfo)
        {
            entity.CreatedAt = DateTime.UtcNow;
            entity.CreatedBy = logInfo.ChangedBy;
            // TODO: Add entity logging here
            return await _repository.AddAsync(entity);
        }

        public async Task<PurchaseOrder> UpdateAsync(PurchaseOrder entity, EntityLogInfo logInfo, PurchaseOrder? oldEntity = null)
        {
            var exists = await _repository.ExistsAsync(entity.Id);
            if (!exists)
                throw new KeyNotFoundException($"PurchaseOrder with id {entity.Id} not found");

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

        public async Task<PurchaseOrder?> GetByPONumberAsync(string poNumber)
        {
            return await _repository.GetByPONumberAsync(poNumber);
        }

        public async Task<IEnumerable<PurchaseOrder>> GetBySupplierIdAsync(int supplierId)
        {
            return await _repository.GetBySupplierIdAsync(supplierId);
        }
    }
}
