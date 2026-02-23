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
    public static class DeliveryItemMutation
    {
        public static async Task<DeliveryItem> AddDeliveryItemAsync(
            DeliveryItemMutationInput input,
            [Service] IDeliveryItemService service,
            [Service] IHttpContextAccessor httpContextAccessor
        )
        {
            var logInfo = EntityLogInfoHelper.GetLogInfo(httpContextAccessor);

            input.DeliveryId.CheckRequired(nameof(input.DeliveryId));
            input.ProductId.CheckRequired(nameof(input.ProductId));
            input.Quantity.CheckRequired(nameof(input.Quantity));

            var entity = new DeliveryItem
            {
                DeliveryId = input.DeliveryId.Value,
                ProductId = input.ProductId.Value,
                Quantity = input.Quantity.Value
            };

            entity = await service.AddAsync(entity, logInfo);
            return entity;
        }

        public static async Task<DeliveryItem> UpdateDeliveryItemAsync(
            DeliveryItemMutationInput input,
            [Service] IDeliveryItemService service,
            [Service] IHttpContextAccessor httpContextAccessor
        )
        {
            var logInfo = EntityLogInfoHelper.GetLogInfo(httpContextAccessor);

            input.Id.CheckRequired(nameof(input.Id));

            var entity = await service.GetByIdAsync(input.Id.Value)
                ?? throw new GraphQLException(new Error($"DeliveryItem with ID {input.Id.Value} not found"));

            var oldEntity = JsonSerializer.Deserialize<DeliveryItem>(JsonSerializer.Serialize(entity));

            entity.DeliveryId = input.DeliveryId.CheckForValue(entity.DeliveryId);
            entity.ProductId = input.ProductId.CheckForValue(entity.ProductId);
            entity.Quantity = input.Quantity.CheckForValue(entity.Quantity);

            entity = await service.UpdateAsync(entity, logInfo, oldEntity);
            return entity;
        }

        public static async Task<bool> DeleteDeliveryItemAsync(
            int id,
            [Service] IDeliveryItemService service,
            [Service] IHttpContextAccessor httpContextAccessor
        )
        {
            var logInfo = EntityLogInfoHelper.GetLogInfo(httpContextAccessor);

            var result = await service.DeleteAsync(id, logInfo);
            if (!result)
                throw new GraphQLException(new Error($"DeliveryItem with ID {id} not found"));
            return result;
        }
    }
}
