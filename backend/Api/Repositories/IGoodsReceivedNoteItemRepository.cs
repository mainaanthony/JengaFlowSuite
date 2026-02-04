using Api.Models.GoodsReceivedNoteItem;
using Api.Core.Models;

namespace Api.Repositories
{
    public interface IGoodsReceivedNoteItemRepository : IRepository<GoodsReceivedNoteItem>
    {
        Task<IEnumerable<GoodsReceivedNoteItem>> GetByGoodsReceivedNoteIdAsync(int goodsReceivedNoteId);
    }
}
