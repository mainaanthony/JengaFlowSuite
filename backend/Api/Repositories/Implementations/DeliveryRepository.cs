using Api.Models.Delivery;
using Api.Data;
using Api.Enums;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories.Implementations
{
    public class DeliveryRepository : Repository<Delivery>, IDeliveryRepository
    {
        public DeliveryRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<Delivery?> GetByDeliveryNumberAsync(string deliveryNumber)
        {
            return await _dbSet.FirstOrDefaultAsync(d => d.DeliveryNumber == deliveryNumber);
        }

        public async Task<IEnumerable<Delivery>> GetByDriverIdAsync(int driverId)
        {
            return await _dbSet.Where(d => d.DriverId == driverId).ToListAsync();
        }

        public async Task<IEnumerable<Delivery>> GetScheduledDeliveriesAsync()
        {
            return await _dbSet.Where(d => d.Status == DeliveryStatus.Scheduled).ToListAsync();
        }
    }
}
