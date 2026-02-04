using Api.Models.Customer;
using Api.Data;
using Api.Enums;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories.Implementations
{
    public class CustomerRepository : Repository<Customer>, ICustomerRepository
    {
        public CustomerRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Customer>> GetActiveAsync()
        {
            return await _dbSet.Where(c => c.IsActive).ToListAsync();
        }

        public async Task<IEnumerable<Customer>> GetByTypeAsync(CustomerType customerType)
        {
            return await _dbSet.Where(c => c.CustomerType == customerType).ToListAsync();
        }
    }
}
