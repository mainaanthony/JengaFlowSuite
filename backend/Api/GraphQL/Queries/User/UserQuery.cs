using Api.Models.User;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries.User
{
    [QueryType]
    public static class UserQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<Models.User.User> GetUsers([Service] IUserService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<Models.User.User?> GetUser(int id, [Service] IUserService service)
            => await service.GetByIdAsync(id);

        [UseProjection]
        public static async Task<Models.User.User?> GetUserByKeycloakId(string keycloakId, [Service] IUserService service)
            => await service.GetByKeycloakIdAsync(keycloakId);

        [UseProjection]
        public static async Task<Models.User.User?> GetUserByEmail(string email, [Service] IUserService service)
            => await service.GetByEmailAsync(email);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<Models.User.User>> GetActiveUsers([Service] IUserService service)
            => await service.GetActiveAsync();
    }
}
