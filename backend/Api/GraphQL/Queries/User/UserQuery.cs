using Api.Models;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries
{
    [ExtendObjectType("Query")]
    public static class UserQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<User> GetUsers([Service] IUserService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<User?> GetUser(int id, [Service] IUserService service)
            => await service.GetByIdAsync(id);

        [UseProjection]
        public static async Task<User?> GetUserByKeycloakId(string keycloakId, [Service] IUserService service)
            => await service.GetByKeycloakIdAsync(keycloakId);

        [UseProjection]
        public static async Task<User?> GetUserByEmail(string email, [Service] IUserService service)
            => await service.GetByEmailAsync(email);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<User>> GetActiveUsers([Service] IUserService service)
            => await service.GetActiveAsync();
    }
}
