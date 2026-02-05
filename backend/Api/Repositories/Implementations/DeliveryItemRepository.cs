using Api.Models;
using Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories.Implementations
{
    public class DeliveryItemRepository : Repository<DeliveryItem>, IDeliveryItemRepository
    {
        public DeliveryItemRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<DeliveryItem>> GetByDeliveryIdAsync(int deliveryId)
        {
            return await _dbSet.Where(di => di.DeliveryId == deliveryId).ToListAsync();
        }
    }
}
