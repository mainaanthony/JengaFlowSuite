using Api.Models.Role;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries.Role
{
    [QueryType]
    public static class RoleQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<Models.Role.Role> GetRoles([Service] IRoleService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<Models.Role.Role?> GetRole(int id, [Service] IRoleService service)
            => await service.GetByIdAsync(id);

        [UseProjection]
        public static async Task<Models.Role.Role?> GetRoleByName(string name, [Service] IRoleService service)
            => await service.GetByNameAsync(name);
    }
}
