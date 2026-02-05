using Api.Models;
using Api.Core.Models;
using Api.Enums;

namespace Api.Repositories
{
    public interface ICustomerRepository : IRepository<Customer>
    {
        Task<IEnumerable<Customer>> GetActiveAsync();
        Task<IEnumerable<Customer>> GetByTypeAsync(CustomerType customerType);
    }
}
