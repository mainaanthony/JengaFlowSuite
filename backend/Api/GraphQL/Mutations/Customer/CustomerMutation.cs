using Api.Models.Customer;
using Api.Services;
using Api.Core;
using Api.Core.Models;
using HotChocolate;
using HotChocolate.Types;
using System.Text.Json;

namespace Api.GraphQL.Mutations.Customer
{
    [MutationType]
    public static class CustomerMutation
    {
        public static async Task<Models.Customer.Customer> AddCustomerAsync(
            CustomerMutationInput input,
            EntityLogInfo logInfo,
            [Service] ICustomerService service
        )
        {
            input.Name.CheckRequired(nameof(input.Name));
            input.CustomerType.CheckRequired(nameof(input.CustomerType));

            var entity = new Models.Customer.Customer
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

        public static async Task<Models.Customer.Customer> UpdateCustomerAsync(
            CustomerMutationInput input,
            EntityLogInfo logInfo,
            [Service] ICustomerService service
        )
        {
            input.Id.CheckRequired(nameof(input.Id));

            var entity = await service.GetByIdAsync(input.Id.Value)
                ?? throw new GraphQLException(new Error($"Customer with ID {input.Id.Value} not found"));

            var oldEntity = JsonSerializer.Deserialize<Models.Customer.Customer>(JsonSerializer.Serialize(entity));

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
            EntityLogInfo logInfo,
            [Service] ICustomerService service
        )
        {
            var result = await service.DeleteAsync(id, logInfo);
            if (!result)
                throw new GraphQLException(new Error($"Customer with ID {id} not found"));
            return result;
        }
    }
}
