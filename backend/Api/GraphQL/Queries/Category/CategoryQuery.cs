using Api.Models.Category;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries.Category
{
    [QueryType]
    public static class CategoryQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<Models.Category.Category> GetCategories([Service] ICategoryService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<Models.Category.Category?> GetCategory(int id, [Service] ICategoryService service)
            => await service.GetByIdAsync(id);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<Models.Category.Category>> GetActiveCategories([Service] ICategoryService service)
            => await service.GetActiveAsync();
    }
}
