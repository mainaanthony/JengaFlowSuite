using Api.Models;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries
{
    [QueryType]
    public static class BranchQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<Branch> GetBranches([Service] IBranchService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<Branch?> GetBranch(int id, [Service] IBranchService service)
            => await service.GetByIdAsync(id);

        [UseProjection]
        public static async Task<Branch?> GetBranchByCode(string code, [Service] IBranchService service)
            => await service.GetByCodeAsync(code);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<Branch>> GetActiveBranches([Service] IBranchService service)
            => await service.GetActiveAsync();
    }
}
