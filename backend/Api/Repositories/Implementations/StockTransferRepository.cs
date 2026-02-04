using Api.Models.StockTransfer;
using Api.Data;
using Api.Enums;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories.Implementations
{
    public class StockTransferRepository : Repository<StockTransfer>, IStockTransferRepository
    {
        public StockTransferRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<StockTransfer?> GetByTransferNumberAsync(string transferNumber)
        {
            return await _dbSet.FirstOrDefaultAsync(st => st.TransferNumber == transferNumber);
        }

        public async Task<IEnumerable<StockTransfer>> GetByBranchIdAsync(int branchId)
        {
            return await _dbSet.Where(st => st.FromBranchId == branchId || st.ToBranchId == branchId).ToListAsync();
        }

        public async Task<IEnumerable<StockTransfer>> GetPendingTransfersAsync()
        {
            return await _dbSet.Where(st => st.Status == StockTransferStatus.Pending).ToListAsync();
        }
    }
}
