using Api.Models;
using Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories.Implementations
{
    public class GoodsReceivedNoteRepository : Repository<GoodsReceivedNote>, IGoodsReceivedNoteRepository
    {
        public GoodsReceivedNoteRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<GoodsReceivedNote?> GetByGRNNumberAsync(string grnNumber)
        {
            return await _dbSet.FirstOrDefaultAsync(grn => grn.GRNNumber == grnNumber);
        }

        public async Task<IEnumerable<GoodsReceivedNote>> GetByPurchaseOrderIdAsync(int purchaseOrderId)
        {
            return await _dbSet.Where(grn => grn.PurchaseOrderId == purchaseOrderId).ToListAsync();
        }
    }
}
