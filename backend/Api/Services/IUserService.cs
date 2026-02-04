using Api.Models.User;
using Api.Core.Models;

namespace Api.Services
{
    public interface IUserService
    {
        Task<User?> GetByIdAsync(int id);
        Task<IEnumerable<User>> GetAllAsync();
        IQueryable<User> GetQueryable();
        Task<User> AddAsync(User entity, EntityLogInfo logInfo);
        Task<User> UpdateAsync(User entity, EntityLogInfo logInfo, User? oldEntity = null);
        Task<bool> DeleteAsync(int id, EntityLogInfo logInfo);
        Task<bool> ExistsAsync(int id);
        Task<User?> GetByKeycloakIdAsync(string keycloakId);
        Task<User?> GetByEmailAsync(string email);
        Task<IEnumerable<User>> GetActiveAsync();
        Task<User> UpdateLastLoginAsync(int id);
    }
}
