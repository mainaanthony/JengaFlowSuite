using Api.Models;
using Api.Repositories;
using Api.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Services.Implementations
{
    public class GoodsReceivedNoteItemService : IGoodsReceivedNoteItemService
    {
        private readonly IGoodsReceivedNoteItemRepository _repository;

        public GoodsReceivedNoteItemService(IGoodsReceivedNoteItemRepository repository)
        {
            _repository = repository;
        }

        public async Task<GoodsReceivedNoteItem?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<GoodsReceivedNoteItem>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public IQueryable<GoodsReceivedNoteItem> GetQueryable()
        {
            return _repository.GetQueryable();
        }

        public async Task<GoodsReceivedNoteItem> AddAsync(GoodsReceivedNoteItem entity, EntityLogInfo logInfo)
        {
            entity.CreatedAt = DateTime.UtcNow;
            // TODO: Add entity logging here
            return await _repository.AddAsync(entity);
        }

        public async Task<GoodsReceivedNoteItem> UpdateAsync(GoodsReceivedNoteItem entity, EntityLogInfo logInfo, GoodsReceivedNoteItem? oldEntity = null)
        {
            var exists = await _repository.ExistsAsync(entity.Id);
            if (!exists)
                throw new KeyNotFoundException($"GoodsReceivedNoteItem with id {entity.Id} not found");

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

        public async Task<IEnumerable<GoodsReceivedNoteItem>> GetByGoodsReceivedNoteIdAsync(int goodsReceivedNoteId)
        {
            return await _repository.GetByGoodsReceivedNoteIdAsync(goodsReceivedNoteId);
        }
    }
}
