using Api.Models;
using Api.Services;
using Api.Core;
using Api.Core.Models;
using Api.Helpers;
using HotChocolate;
using HotChocolate.Types;
using System.Text.Json;

namespace Api.GraphQL.Mutations
{
    [ExtendObjectType("Mutation")]
    public static class DeliveryMutation
    {
        public static async Task<Delivery> AddDeliveryAsync(
            DeliveryMutationInput input,
            [Service] IDeliveryService service,
            [Service] IHttpContextAccessor httpContextAccessor
        )
        {
            var logInfo = EntityLogInfoHelper.GetLogInfo(httpContextAccessor);

            input.DeliveryNumber.CheckRequired(nameof(input.DeliveryNumber));
            input.CustomerId.CheckRequired(nameof(input.CustomerId));
            input.DriverId.CheckRequired(nameof(input.DriverId));
            input.DeliveryAddress.CheckRequired(nameof(input.DeliveryAddress));

            var entity = new Delivery
            {
                DeliveryNumber = input.DeliveryNumber.Value!,
                SaleId = input.SaleId.CheckForValue(null),
                CustomerId = input.CustomerId.Value,
                DriverId = input.DriverId.Value,
                DeliveryAddress = input.DeliveryAddress.Value!,
                ContactPhone = input.ContactPhone.CheckForValue(null),
                Status = input.Status.CheckForValue(Enums.DeliveryStatus.Scheduled),
                Priority = input.Priority.CheckForValue(Enums.Priority.Normal),
                ScheduledDate = input.ScheduledDate.Value ?? DateTime.UtcNow,
                DeliveredDate = input.DeliveredDate.CheckForValue(null),
                Notes = input.Notes.CheckForValue(null)
            };

            entity = await service.AddAsync(entity, logInfo);
            return entity;
        }

        public static async Task<Delivery> UpdateDeliveryAsync(
            DeliveryMutationInput input,
            [Service] IDeliveryService service,
            [Service] IHttpContextAccessor httpContextAccessor
        )
        {
            var logInfo = EntityLogInfoHelper.GetLogInfo(httpContextAccessor);

            input.Id.CheckRequired(nameof(input.Id));

            var entity = await service.GetByIdAsync(input.Id.Value)
                ?? throw new GraphQLException(new Error($"Delivery with ID {input.Id.Value} not found"));

            var oldEntity = JsonSerializer.Deserialize<Delivery>(JsonSerializer.Serialize(entity));

            entity.DeliveryNumber = input.DeliveryNumber.CheckForValue(entity.DeliveryNumber);
            entity.SaleId = input.SaleId.CheckForValue(entity.SaleId);
            entity.CustomerId = input.CustomerId.CheckForValue(entity.CustomerId);
            entity.DriverId = input.DriverId.CheckForValue(entity.DriverId);
            entity.DeliveryAddress = input.DeliveryAddress.CheckForValue(entity.DeliveryAddress);
            entity.ContactPhone = input.ContactPhone.CheckForValue(entity.ContactPhone);
            entity.Status = input.Status.CheckForValue(entity.Status);
            entity.Priority = input.Priority.CheckForValue(entity.Priority);
            if (input.ScheduledDate.HasValue)
                entity.ScheduledDate = input.ScheduledDate.Value ?? entity.ScheduledDate;
            entity.DeliveredDate = input.DeliveredDate.CheckForValue(entity.DeliveredDate);
            entity.Notes = input.Notes.CheckForValue(entity.Notes);

            entity = await service.UpdateAsync(entity, logInfo, oldEntity);
            return entity;
        }

        public static async Task<bool> DeleteDeliveryAsync(
            int id,
            [Service] IDeliveryService service,
            [Service] IHttpContextAccessor httpContextAccessor
        )
        {
            var logInfo = EntityLogInfoHelper.GetLogInfo(httpContextAccessor);

            var result = await service.DeleteAsync(id, logInfo);
            if (!result)
                throw new GraphQLException(new Error($"Delivery with ID {id} not found"));
            return result;
        }
    }
}
