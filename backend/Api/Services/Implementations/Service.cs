using System.Linq.Expressions;
using Api.Repositories;

namespace Api.Services.Implementations
{
    public class Service<T> : IService<T> where T : class
    {
        protected readonly IRepository<T> _repository;

        public Service(IRepository<T> repository)
        {
            _repository = repository;
        }

        public virtual async Task<T?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public virtual IQueryable<T> GetQueryable()
        {
            return _repository.GetQueryable();
        }

        public virtual async Task<T> CreateAsync(T entity)
        {
            return await _repository.AddAsync(entity);
        }

        public virtual async Task<T> UpdateAsync(int id, T entity)
        {
            var exists = await _repository.ExistsAsync(id);
            if (!exists)
                throw new KeyNotFoundException($"Entity with id {id} not found");

            return await _repository.UpdateAsync(entity);
        }

        public virtual async Task<bool> DeleteAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }

        public virtual async Task<bool> ExistsAsync(int id)
        {
            return await _repository.ExistsAsync(id);
        }

        public virtual async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            return await _repository.FindAsync(predicate);
        }
    }
}
