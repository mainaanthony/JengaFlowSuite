using Api.Models.Category;
using Api.Core.Models;

namespace Api.Repositories
{
    public interface ICategoryRepository : IRepository<Category>
    {
        Task<IEnumerable<Category>> GetActiveAsync();
    }
}
