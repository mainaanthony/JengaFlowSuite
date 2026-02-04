using Api.Models.GoodsReceivedNote;
using Api.Core.Models;

namespace Api.Services
{
    public interface IGoodsReceivedNoteService
    {
        Task<GoodsReceivedNote?> GetByIdAsync(int id);
        Task<IEnumerable<GoodsReceivedNote>> GetAllAsync();
        IQueryable<GoodsReceivedNote> GetQueryable();
        Task<GoodsReceivedNote> AddAsync(GoodsReceivedNote entity, EntityLogInfo logInfo);
        Task<GoodsReceivedNote> UpdateAsync(GoodsReceivedNote entity, EntityLogInfo logInfo, GoodsReceivedNote? oldEntity = null);
        Task<bool> DeleteAsync(int id, EntityLogInfo logInfo);
        Task<bool> ExistsAsync(int id);
        Task<GoodsReceivedNote?> GetByGRNNumberAsync(string grnNumber);
        Task<IEnumerable<GoodsReceivedNote>> GetByPurchaseOrderIdAsync(int purchaseOrderId);
    }
}
