using Api.Models;
using Api.Repositories;
using Api.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repository;

        public UserService(IUserRepository repository)
        {
            _repository = repository;
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public IQueryable<User> GetQueryable()
        {
            return _repository.GetQueryable();
        }

        public async Task<User> AddAsync(User entity, EntityLogInfo logInfo)
        {
            entity.CreatedAt = DateTime.UtcNow;
            entity.CreatedBy = logInfo.ChangedBy;
            // TODO: Add entity logging here
            return await _repository.AddAsync(entity);
        }

        public async Task<User> UpdateAsync(User entity, EntityLogInfo logInfo, User? oldEntity = null)
        {
            var exists = await _repository.ExistsAsync(entity.Id);
            if (!exists)
                throw new KeyNotFoundException($"User with id {entity.Id} not found");

            entity.UpdatedAt = DateTime.UtcNow;
            entity.UpdatedBy = logInfo.ChangedBy;
            // TODO: Add entity logging here with oldEntity comparison
            return await _repository.UpdateAsync(entity);
        }

        public async Task<bool> DeleteAsync(int id, EntityLogInfo logInfo)
        {
            // TODO: Add entity logging here
            return await _repository.DeleteAsync(id);
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _repository.ExistsAsync(id);
        }

        public async Task<User?> GetByKeycloakIdAsync(string keycloakId)
        {
            var users = await _repository.FindAsync(u => u.KeycloakId == keycloakId);
            return users.FirstOrDefault();
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _repository.GetByEmailAsync(email);
        }

        public async Task<IEnumerable<User>> GetActiveAsync()
        {
            return await _repository.GetActiveAsync();
        }

        public async Task<User> UpdateLastLoginAsync(int id)
        {
            var user = await _repository.GetByIdAsync(id);
            if (user == null)
                throw new KeyNotFoundException($"User with id {id} not found");

            user.LastLoginAt = DateTime.UtcNow;
            return await _repository.UpdateAsync(user);
        }
    }
}
