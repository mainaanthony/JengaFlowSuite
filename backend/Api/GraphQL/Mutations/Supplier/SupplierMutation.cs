using Api.Models.Supplier;
using Api.Services;
using Api.Core;
using Api.Core.Models;
using HotChocolate;
using HotChocolate.Types;
using System.Text.Json;

namespace Api.GraphQL.Mutations.Supplier
{
    [MutationType]
    public static class SupplierMutation
    {
        public static async Task<Models.Supplier.Supplier> AddSupplierAsync(
            SupplierMutationInput input,
            EntityLogInfo logInfo,
            [Service] ISupplierService service
        )
        {
            input.Name.CheckRequired(nameof(input.Name));

            var entity = new Models.Supplier.Supplier
            {
                Name = input.Name.Value!,
                Email = input.Email.Value!,
                Phone = input.Phone.Value!,
                Address = input.Address.CheckForValue(null),
                ContactPerson = input.ContactPerson.CheckForValue(null),
                Category = input.Category.CheckForValue(null),
                Rating = input.Rating.CheckForValue(0),
                IsActive = input.IsActive.CheckForValue(true)
            };

            entity = await service.AddAsync(entity, logInfo);
            return entity;
        }

        public static async Task<Models.Supplier.Supplier> UpdateSupplierAsync(
            SupplierMutationInput input,
            EntityLogInfo logInfo,
            [Service] ISupplierService service
        )
        {
            input.Id.CheckRequired(nameof(input.Id));

            var entity = await service.GetByIdAsync(input.Id.Value)
                ?? throw new GraphQLException(new Error($"Supplier with ID {input.Id.Value} not found"));

            var oldEntity = JsonSerializer.Deserialize<Models.Supplier.Supplier>(JsonSerializer.Serialize(entity));

            entity.Name = input.Name.CheckForValue(entity.Name);
            entity.Email = input.Email.CheckForValue(entity.Email);
            entity.Phone = input.Phone.CheckForValue(entity.Phone);
            entity.Address = input.Address.CheckForValue(entity.Address);
            entity.ContactPerson = input.ContactPerson.CheckForValue(entity.ContactPerson);
            entity.Category = input.Category.CheckForValue(entity.Category);
            entity.Rating = input.Rating.CheckForValue(entity.Rating);
            entity.IsActive = input.IsActive.CheckForValue(entity.IsActive);

            entity = await service.UpdateAsync(entity, logInfo, oldEntity);
            return entity;
        }

        public static async Task<bool> DeleteSupplierAsync(
            int id,
            EntityLogInfo logInfo,
            [Service] ISupplierService service
        )
        {
            var result = await service.DeleteAsync(id, logInfo);
            if (!result)
                throw new GraphQLException(new Error($"Supplier with ID {id} not found"));
            return result;
        }
    }
}
