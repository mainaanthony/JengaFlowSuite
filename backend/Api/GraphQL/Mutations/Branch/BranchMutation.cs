using Api.Models.Branch;
using Api.Services;
using Api.Core;
using Api.Core.Models;
using HotChocolate;
using HotChocolate.Types;
using System.Text.Json;

namespace Api.GraphQL.Mutations.Branch
{
    [MutationType]
    public static class BranchMutation
    {
        public static async Task<Models.Branch.Branch> AddBranchAsync(
            BranchMutationInput input,
            EntityLogInfo logInfo,
            [Service] IBranchService service
        )
        {
            input.Name.CheckRequired(nameof(input.Name));
            input.Code.CheckRequired(nameof(input.Code));

            var entity = new Models.Branch.Branch
            {
                Name = input.Name.Value!,
                Code = input.Code.Value!,
                Address = input.Address.CheckForValue(null),
                City = input.City.CheckForValue(null),
                Phone = input.Phone.CheckForValue(null),
                Email = input.Email.CheckForValue(null),
                IsActive = input.IsActive.CheckForValue(true)
            };

            entity = await service.AddAsync(entity, logInfo);
            return entity;
        }

        public static async Task<Models.Branch.Branch> UpdateBranchAsync(
            BranchMutationInput input,
            EntityLogInfo logInfo,
            [Service] IBranchService service
        )
        {
            input.Id.CheckRequired(nameof(input.Id));

            var entity = await service.GetByIdAsync(input.Id.Value)
                ?? throw new GraphQLException(new Error($"Branch with ID {input.Id.Value} not found"));

            var oldEntity = JsonSerializer.Deserialize<Models.Branch.Branch>(JsonSerializer.Serialize(entity));

            entity.Name = input.Name.CheckForValue(entity.Name);
            entity.Code = input.Code.CheckForValue(entity.Code);
            entity.Address = input.Address.CheckForValue(entity.Address);
            entity.City = input.City.CheckForValue(entity.City);
            entity.Phone = input.Phone.CheckForValue(entity.Phone);
            entity.Email = input.Email.CheckForValue(entity.Email);
            entity.IsActive = input.IsActive.CheckForValue(entity.IsActive);

            entity = await service.UpdateAsync(entity, logInfo, oldEntity);
            return entity;
        }

        public static async Task<bool> DeleteBranchAsync(
            int id,
            EntityLogInfo logInfo,
            [Service] IBranchService service
        )
        {
            var result = await service.DeleteAsync(id, logInfo);
            if (!result)
                throw new GraphQLException(new Error($"Branch with ID {id} not found"));
            return result;
        }
    }
}
