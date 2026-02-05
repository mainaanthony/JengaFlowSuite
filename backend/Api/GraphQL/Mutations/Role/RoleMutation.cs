using Api.Models;
using Api.Services;
using Api.Core;
using Api.Core.Models;
using HotChocolate;
using HotChocolate.Types;
using System.Text.Json;

namespace Api.GraphQL.Mutations
{
    [MutationType]
    public static class RoleMutation
    {
        public static async Task<Role> AddRoleAsync(
            RoleMutationInput input,
            EntityLogInfo logInfo,
            [Service] IRoleService service
        )
        {
            input.Name.CheckRequired(nameof(input.Name));

            var entity = new Role
            {
                Name = input.Name.Value!,
                Description = input.Description.CheckForValue(null)
            };

            entity = await service.AddAsync(entity, logInfo);
            return entity;
        }

        public static async Task<Role> UpdateRoleAsync(
            RoleMutationInput input,
            EntityLogInfo logInfo,
            [Service] IRoleService service
        )
        {
            input.Id.CheckRequired(nameof(input.Id));

            var entity = await service.GetByIdAsync(input.Id.Value)
                ?? throw new GraphQLException(new Error($"Role with ID {input.Id.Value} not found"));

            var oldEntity = JsonSerializer.Deserialize<Role>(JsonSerializer.Serialize(entity));

            entity.Name = input.Name.CheckForValue(entity.Name);
            entity.Description = input.Description.CheckForValue(entity.Description);

            entity = await service.UpdateAsync(entity, logInfo, oldEntity);
            return entity;
        }

        public static async Task<bool> DeleteRoleAsync(
            int id,
            EntityLogInfo logInfo,
            [Service] IRoleService service
        )
        {
            var result = await service.DeleteAsync(id, logInfo);
            if (!result)
                throw new GraphQLException(new Error($"Role with ID {id} not found"));
            return result;
        }
    }
}
