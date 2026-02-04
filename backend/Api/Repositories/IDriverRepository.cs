using Api.Models.Driver;
using Api.Core.Models;

namespace Api.Repositories
{
    public interface IDriverRepository : IRepository<Driver>
    {
        Task<Driver?> GetByLicenseNumberAsync(string licenseNumber);
        Task<IEnumerable<Driver>> GetActiveAsync();
        Task<IEnumerable<Driver>> GetAvailableAsync(); // Uses Status field ("Available")
    }
}
