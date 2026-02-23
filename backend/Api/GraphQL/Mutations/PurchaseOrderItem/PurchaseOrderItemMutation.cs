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
    public static class PurchaseOrderItemMutation
    {
        public static async Task<PurchaseOrderItem> AddPurchaseOrderItemAsync(
            PurchaseOrderItemMutationInput input,
            [Service] IPurchaseOrderItemService service,
            [Service] IHttpContextAccessor httpContextAccessor
        )
        {
            var logInfo = EntityLogInfoHelper.GetLogInfo(httpContextAccessor);

            input.PurchaseOrderId.CheckRequired(nameof(input.PurchaseOrderId));
            input.ProductId.CheckRequired(nameof(input.ProductId));
            input.Quantity.CheckRequired(nameof(input.Quantity));
            input.UnitPrice.CheckRequired(nameof(input.UnitPrice));

            var entity = new PurchaseOrderItem
            {
                PurchaseOrderId = input.PurchaseOrderId.Value,
                ProductId = input.ProductId.Value,
                Quantity = input.Quantity.Value,
                UnitPrice = input.UnitPrice.Value,
                TotalPrice = input.TotalPrice.CheckForValue(input.Quantity.Value * input.UnitPrice.Value)
            };

            entity = await service.AddAsync(entity, logInfo);
            return entity;
        }

        public static async Task<PurchaseOrderItem> UpdatePurchaseOrderItemAsync(
            PurchaseOrderItemMutationInput input,
            [Service] IPurchaseOrderItemService service,
            [Service] IHttpContextAccessor httpContextAccessor
        )
        {
            var logInfo = EntityLogInfoHelper.GetLogInfo(httpContextAccessor);

            input.Id.CheckRequired(nameof(input.Id));

            var entity = await service.GetByIdAsync(input.Id.Value)
                ?? throw new GraphQLException(new Error($"PurchaseOrderItem with ID {input.Id.Value} not found"));

            var oldEntity = JsonSerializer.Deserialize<PurchaseOrderItem>(JsonSerializer.Serialize(entity));

            entity.PurchaseOrderId = input.PurchaseOrderId.CheckForValue(entity.PurchaseOrderId);
            entity.ProductId = input.ProductId.CheckForValue(entity.ProductId);
            entity.Quantity = input.Quantity.CheckForValue(entity.Quantity);
            entity.UnitPrice = input.UnitPrice.CheckForValue(entity.UnitPrice);
            entity.TotalPrice = input.TotalPrice.CheckForValue(entity.TotalPrice);

            entity = await service.UpdateAsync(entity, logInfo, oldEntity);
            return entity;
        }

        public static async Task<bool> DeletePurchaseOrderItemAsync(
            int id,
            [Service] IPurchaseOrderItemService service,
            [Service] IHttpContextAccessor httpContextAccessor
        )
        {
            var logInfo = EntityLogInfoHelper.GetLogInfo(httpContextAccessor);

            var result = await service.DeleteAsync(id, logInfo);
            if (!result)
                throw new GraphQLException(new Error($"PurchaseOrderItem with ID {id} not found"));
            return result;
        }
    }
}
