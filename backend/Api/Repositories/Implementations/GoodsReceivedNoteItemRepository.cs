using Api.Models;
using Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories.Implementations
{
    public class GoodsReceivedNoteItemRepository : Repository<GoodsReceivedNoteItem>, IGoodsReceivedNoteItemRepository
    {
        public GoodsReceivedNoteItemRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<GoodsReceivedNoteItem>> GetByGoodsReceivedNoteIdAsync(int goodsReceivedNoteId)
        {
            return await _dbSet.Where(grni => grni.GoodsReceivedNoteId == goodsReceivedNoteId).ToListAsync();
        }
    }
}
