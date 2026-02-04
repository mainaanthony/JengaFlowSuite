using Api.Models.User;
using Api.Services;
using Api.Core;
using Api.Core.Models;
using HotChocolate;
using HotChocolate.Types;
using System.Text.Json;

namespace Api.GraphQL.Mutations.User
{
    [MutationType]
    public static class UserMutation
    {
        public static async Task<Models.User.User> AddUserAsync(
            UserMutationInput input,
            EntityLogInfo logInfo,
            [Service] IUserService service
        )
        {
            input.KeycloakId.CheckRequired(nameof(input.KeycloakId));
            input.Username.CheckRequired(nameof(input.Username));
            input.Email.CheckRequired(nameof(input.Email));
            input.FirstName.CheckRequired(nameof(input.FirstName));
            input.LastName.CheckRequired(nameof(input.LastName));
            input.BranchId.CheckRequired(nameof(input.BranchId));
            input.RoleId.CheckRequired(nameof(input.RoleId));

            var entity = new Models.User.User
            {
                KeycloakId = input.KeycloakId.Value!,
                Username = input.Username.Value!,
                Email = input.Email.Value!,
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

        public static async Task<Models.User.User> UpdateUserAsync(
            UserMutationInput input,
            EntityLogInfo logInfo,
            [Service] IUserService service
        )
        {
            input.Id.CheckRequired(nameof(input.Id));

            var entity = await service.GetByIdAsync(input.Id.Value)
                ?? throw new GraphQLException(new Error($"User with ID {input.Id.Value} not found"));

            var oldEntity = JsonSerializer.Deserialize<Models.User.User>(JsonSerializer.Serialize(entity));

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
            EntityLogInfo logInfo,
            [Service] IUserService service
        )
        {
            var result = await service.DeleteAsync(id, logInfo);
            if (!result)
                throw new GraphQLException(new Error($"User with ID {id} not found"));
            return result;
        }

        public static async Task<Models.User.User> UpdateLastLoginAsync(
            int id,
            [Service] IUserService service
        )
        {
            var entity = await service.UpdateLastLoginAsync(id);
            return entity;
        }
    }
}
