using Api.Models;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries
{
    [QueryType]
    public static class CategoryQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<Category> GetCategories([Service] ICategoryService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<Category?> GetCategory(int id, [Service] ICategoryService service)
            => await service.GetByIdAsync(id);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<Category>> GetActiveCategories([Service] ICategoryService service)
            => await service.GetActiveAsync();
    }
}
