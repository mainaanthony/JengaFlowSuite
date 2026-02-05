using Api.Models;
using Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories.Implementations
{
    public class DriverRepository : Repository<Driver>, IDriverRepository
    {
        public DriverRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<Driver?> GetByLicenseNumberAsync(string licenseNumber)
        {
            return await _dbSet.FirstOrDefaultAsync(d => d.LicenseNumber == licenseNumber);
        }

        public async Task<IEnumerable<Driver>> GetActiveAsync()
        {
            return await _dbSet.Where(d => d.IsActive).ToListAsync();
        }

        public async Task<IEnumerable<Driver>> GetAvailableAsync()
        {
            return await _dbSet.Where(d => d.IsActive && d.Status == "Available").ToListAsync();
        }
    }
}
