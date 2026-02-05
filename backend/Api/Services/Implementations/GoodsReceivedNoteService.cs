using Api.Models;
using Api.Repositories;
using Api.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Services.Implementations
{
    public class GoodsReceivedNoteService : IGoodsReceivedNoteService
    {
        private readonly IGoodsReceivedNoteRepository _repository;

        public GoodsReceivedNoteService(IGoodsReceivedNoteRepository repository)
        {
            _repository = repository;
        }

        public async Task<GoodsReceivedNote?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<GoodsReceivedNote>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public IQueryable<GoodsReceivedNote> GetQueryable()
        {
            return _repository.GetQueryable();
        }

        public async Task<GoodsReceivedNote> AddAsync(GoodsReceivedNote entity, EntityLogInfo logInfo)
        {
            entity.CreatedAt = DateTime.UtcNow;
            // TODO: Add entity logging here
            return await _repository.AddAsync(entity);
        }

        public async Task<GoodsReceivedNote> UpdateAsync(GoodsReceivedNote entity, EntityLogInfo logInfo, GoodsReceivedNote? oldEntity = null)
        {
            var exists = await _repository.ExistsAsync(entity.Id);
            if (!exists)
                throw new KeyNotFoundException($"GoodsReceivedNote with id {entity.Id} not found");

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

        public async Task<GoodsReceivedNote?> GetByGRNNumberAsync(string grnNumber)
        {
            return await _repository.GetByGRNNumberAsync(grnNumber);
        }

        public async Task<IEnumerable<GoodsReceivedNote>> GetByPurchaseOrderIdAsync(int purchaseOrderId)
        {
            return await _repository.GetByPurchaseOrderIdAsync(purchaseOrderId);
        }
    }
}
