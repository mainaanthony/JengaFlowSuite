using Api.Models.Branch;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries.Branch
{
    [QueryType]
    public static class BranchQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<Models.Branch.Branch> GetBranches([Service] IBranchService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<Models.Branch.Branch?> GetBranch(int id, [Service] IBranchService service)
            => await service.GetByIdAsync(id);

        [UseProjection]
        public static async Task<Models.Branch.Branch?> GetBranchByCode(string code, [Service] IBranchService service)
            => await service.GetByCodeAsync(code);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<Models.Branch.Branch>> GetActiveBranches([Service] IBranchService service)
            => await service.GetActiveAsync();
    }
}
