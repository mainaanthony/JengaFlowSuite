using Api.Models.GoodsReceivedNoteItem;
using Api.Core.Models;

namespace Api.Services
{
    public interface IGoodsReceivedNoteItemService
    {
        Task<GoodsReceivedNoteItem?> GetByIdAsync(int id);
        Task<IEnumerable<GoodsReceivedNoteItem>> GetAllAsync();
        IQueryable<GoodsReceivedNoteItem> GetQueryable();
        Task<GoodsReceivedNoteItem> AddAsync(GoodsReceivedNoteItem entity, EntityLogInfo logInfo);
        Task<GoodsReceivedNoteItem> UpdateAsync(GoodsReceivedNoteItem entity, EntityLogInfo logInfo, GoodsReceivedNoteItem? oldEntity = null);
        Task<bool> DeleteAsync(int id, EntityLogInfo logInfo);
        Task<bool> ExistsAsync(int id);
        Task<IEnumerable<GoodsReceivedNoteItem>> GetByGoodsReceivedNoteIdAsync(int goodsReceivedNoteId);
    }
}
