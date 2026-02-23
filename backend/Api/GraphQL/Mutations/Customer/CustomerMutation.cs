using Api.Services;
using Api.Core;
using Api.Core.Models;
using Api.Models;
using Api.Helpers;
using HotChocolate;
using HotChocolate.Types;
using System.Text.Json;

namespace Api.GraphQL.Mutations
{
    [ExtendObjectType("Mutation")]
    public static class CustomerMutation
    {
        public static async Task<Customer> AddCustomerAsync(
            CustomerMutationInput input,
            [Service] ICustomerService service,
            [Service] IHttpContextAccessor httpContextAccessor
        )
        {
            var logInfo = EntityLogInfoHelper.GetLogInfo(httpContextAccessor);

            input.Name.CheckRequired(nameof(input.Name));
            input.CustomerType.CheckRequired(nameof(input.CustomerType));

            var entity = new Customer
            {
                Name = input.Name.Value!,
                CustomerType = input.CustomerType.Value!,
                Email = input.Email.CheckForValue(null),
                Phone = input.Phone.CheckForValue(null),
                Address = input.Address.CheckForValue(null),
                IsActive = input.IsActive.CheckForValue(true)
            };

            entity = await service.AddAsync(entity, logInfo);
            return entity;
        }

        public static async Task<Customer> UpdateCustomerAsync(
            CustomerMutationInput input,
            [Service] ICustomerService service,
            [Service] IHttpContextAccessor httpContextAccessor
        )
        {
            var logInfo = EntityLogInfoHelper.GetLogInfo(httpContextAccessor);

            input.Id.CheckRequired(nameof(input.Id));

            var entity = await service.GetByIdAsync(input.Id.Value)
                ?? throw new GraphQLException(new Error($"Customer with ID {input.Id.Value} not found"));

            var oldEntity = JsonSerializer.Deserialize<Customer>(JsonSerializer.Serialize(entity));

            entity.Name = input.Name.CheckForValue(entity.Name);
            entity.CustomerType = input.CustomerType.CheckForValue(entity.CustomerType);
            entity.Email = input.Email.CheckForValue(entity.Email);
            entity.Phone = input.Phone.CheckForValue(entity.Phone);
            entity.Address = input.Address.CheckForValue(entity.Address);
            entity.IsActive = input.IsActive.CheckForValue(entity.IsActive);

            entity = await service.UpdateAsync(entity, logInfo, oldEntity);
            return entity;
        }

        public static async Task<bool> DeleteCustomerAsync(
            int id,
            [Service] ICustomerService service,
            [Service] IHttpContextAccessor httpContextAccessor
        )
        {
            var logInfo = EntityLogInfoHelper.GetLogInfo(httpContextAccessor);

            var result = await service.DeleteAsync(id, logInfo);
            if (!result)
                throw new GraphQLException(new Error($"Customer with ID {id} not found"));
            return result;
        }
    }
}
