using Api.Services;
using Api.Core;
using Api.Core.Models;
using Api.Helpers;
using HotChocolate;
using HotChocolate.Types;
using System.Text.Json;
using Api.Models;

namespace Api.GraphQL.Mutations
{
    [ExtendObjectType("Mutation")]
    public static class UserMutation
    {
        public static async Task<User> AddUserAsync(
            UserMutationInput input,
            [Service] IUserService service,
            [Service] IHttpContextAccessor httpContextAccessor
        )
        {
            var logInfo = EntityLogInfoHelper.GetLogInfo(httpContextAccessor);

            input.Email.CheckRequired(nameof(input.Email));
            input.FirstName.CheckRequired(nameof(input.FirstName));
            input.LastName.CheckRequired(nameof(input.LastName));
            input.BranchId.CheckRequired(nameof(input.BranchId));
            input.RoleId.CheckRequired(nameof(input.RoleId));

            var email = input.Email.Value!;

            // Auto-generate username from email if not provided
            var username = input.Username.HasValue && !string.IsNullOrWhiteSpace(input.Username.Value)
                ? input.Username.Value!
                : email.Split('@')[0];

            // Auto-generate a placeholder KeycloakId if not provided
            // This will be updated when the user first logs in via Keycloak
            var keycloakId = input.KeycloakId.HasValue && !string.IsNullOrWhiteSpace(input.KeycloakId.Value)
                ? input.KeycloakId.Value!
                : $"pending-{Guid.NewGuid()}";

            var entity = new User
            {
                KeycloakId = keycloakId,
                Username = username,
                Email = email,
                FirstName = input.FirstName.Value!,
                LastName = input.LastName.Value!,
                Phone = input.Phone.CheckForValue(null),
                IsActive = input.IsActive.CheckForValue(true),
                BranchId = input.BranchId.Value,
                RoleId = input.RoleId.Value
            };

            entity = await service.AddAsync(entity, logInfo);
            return entity;
        }

        public static async Task<User> UpdateUserAsync(
            UserMutationInput input,
            [Service] IUserService service,
            [Service] IHttpContextAccessor httpContextAccessor
        )
        {
            var logInfo = EntityLogInfoHelper.GetLogInfo(httpContextAccessor);

            input.Id.CheckRequired(nameof(input.Id));

            var entity = await service.GetByIdAsync(input.Id.Value)
                ?? throw new GraphQLException(new Error($"User with ID {input.Id.Value} not found"));

            var oldEntity = JsonSerializer.Deserialize<User>(JsonSerializer.Serialize(entity));

            entity.KeycloakId = input.KeycloakId.CheckForValue(entity.KeycloakId);
            entity.Username = input.Username.CheckForValue(entity.Username);
            entity.Email = input.Email.CheckForValue(entity.Email);
            entity.FirstName = input.FirstName.CheckForValue(entity.FirstName);
            entity.LastName = input.LastName.CheckForValue(entity.LastName);
            entity.Phone = input.Phone.CheckForValue(entity.Phone);
            entity.IsActive = input.IsActive.CheckForValue(entity.IsActive);
            entity.BranchId = input.BranchId.CheckForValue(entity.BranchId);
            entity.RoleId = input.RoleId.CheckForValue(entity.RoleId);

            entity = await service.UpdateAsync(entity, logInfo, oldEntity);
            return entity;
        }

        public static async Task<bool> DeleteUserAsync(
            int id,
            [Service] IUserService service,
            [Service] IHttpContextAccessor httpContextAccessor
        )
        {
            var logInfo = EntityLogInfoHelper.GetLogInfo(httpContextAccessor);

            var result = await service.DeleteAsync(id, logInfo);
            if (!result)
                throw new GraphQLException(new Error($"User with ID {id} not found"));
            return result;
        }

        public static async Task<User> UpdateLastLoginAsync(
            int id,
            [Service] IUserService service
        )
        {
            var entity = await service.UpdateLastLoginAsync(id);
            return entity;
        }
    }
}
