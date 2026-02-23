using Api.Models;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries
{
    [ExtendObjectType("Query")]
    public static class RoleQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<Role> GetRoles([Service] IRoleService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<Role?> GetRole(int id, [Service] IRoleService service)
            => await service.GetByIdAsync(id);

        [UseProjection]
        public static async Task<Role?> GetRoleByName(string name, [Service] IRoleService service)
            => await service.GetByNameAsync(name);
    }
}
