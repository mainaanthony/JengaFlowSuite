using Api.Models.GoodsReceivedNote;
using Api.Core.Models;

namespace Api.Repositories
{
    public interface IGoodsReceivedNoteRepository : IRepository<GoodsReceivedNote>
    {
        Task<GoodsReceivedNote?> GetByGRNNumberAsync(string grnNumber);
        Task<IEnumerable<GoodsReceivedNote>> GetByPurchaseOrderIdAsync(int purchaseOrderId);
    }
}
