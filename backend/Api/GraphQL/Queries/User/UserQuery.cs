using Api.Models;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;
using System.Security.Claims;

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

        /// <summary>
        /// Gets the current authenticated user from JWT token.
        /// Automatically provisions the user if they don't exist in the database.
        /// </summary>
        [UseProjection]
        public static async Task<User?> GetCurrentUser(
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IUserProvisioningService provisioningService)
        {
            var claimsPrincipal = httpContextAccessor.HttpContext?.User;

            if (claimsPrincipal == null)
            {
                throw new UnauthorizedAccessException("No user context available");
            }

            // Extract claims from JWT token
            var keycloakId = claimsPrincipal.FindFirst("sub")?.Value ??
                            claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(keycloakId))
            {
                throw new UnauthorizedAccessException("No user identifier found in token");
            }

            var username = claimsPrincipal.FindFirst("preferred_username")?.Value ??
                          claimsPrincipal.FindFirst(ClaimTypes.Name)?.Value ??
                          "unknown";

            var email = claimsPrincipal.FindFirst("email")?.Value ??
                       claimsPrincipal.FindFirst(ClaimTypes.Email)?.Value ??
                       $"{username}@jengaflow.com";

            var firstName = claimsPrincipal.FindFirst("given_name")?.Value ??
                           claimsPrincipal.FindFirst(ClaimTypes.GivenName)?.Value;

            var lastName = claimsPrincipal.FindFirst("family_name")?.Value ??
                          claimsPrincipal.FindFirst(ClaimTypes.Surname)?.Value;

            // Get or create user with auto-provisioning
            return await provisioningService.GetOrCreateUserFromTokenAsync(
                keycloakId, username, email, firstName, lastName);
        }
    }
}
