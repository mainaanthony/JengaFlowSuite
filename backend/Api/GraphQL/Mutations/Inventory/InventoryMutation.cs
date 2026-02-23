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
    public static class InventoryMutation
    {
        public static async Task<Inventory> AddInventoryAsync(
            InventoryMutationInput input,
            [Service] IInventoryService service,
            [Service] IHttpContextAccessor httpContextAccessor
        )
        {
            var logInfo = EntityLogInfoHelper.GetLogInfo(httpContextAccessor);

            input.ProductId.CheckRequired(nameof(input.ProductId));
            input.BranchId.CheckRequired(nameof(input.BranchId));

            var entity = new Inventory
            {
                ProductId = input.ProductId.Value,
                BranchId = input.BranchId.Value,
                Quantity = input.Quantity.CheckForValue(0),
                ReorderLevel = input.ReorderLevel.CheckForValue(10),
                MaxStockLevel = input.MaxStockLevel.CheckForValue(100),
                LastRestocked = DateTime.UtcNow
            };

            entity = await service.AddAsync(entity, logInfo);
            return entity;
        }

        public static async Task<Inventory> UpdateInventoryAsync(
            InventoryMutationInput input,
            [Service] IInventoryService service,
            [Service] IHttpContextAccessor httpContextAccessor
        )
        {
            var logInfo = EntityLogInfoHelper.GetLogInfo(httpContextAccessor);

            input.Id.CheckRequired(nameof(input.Id));

            var entity = await service.GetByIdAsync(input.Id.Value)
                ?? throw new GraphQLException(new Error($"Inventory with ID {input.Id.Value} not found"));

            var oldEntity = JsonSerializer.Deserialize<Inventory>(JsonSerializer.Serialize(entity));

            // Check if quantity is being increased to update LastRestocked
            bool quantityIncreased = input.Quantity.HasValue && input.Quantity.Value > entity.Quantity;

            entity.ProductId = input.ProductId.CheckForValue(entity.ProductId);
            entity.BranchId = input.BranchId.CheckForValue(entity.BranchId);
            entity.Quantity = input.Quantity.CheckForValue(entity.Quantity);
            entity.ReorderLevel = input.ReorderLevel.CheckForValue(entity.ReorderLevel);
            entity.MaxStockLevel = input.MaxStockLevel.CheckForValue(entity.MaxStockLevel);

            if (quantityIncreased)
                entity.LastRestocked = DateTime.UtcNow;

            entity = await service.UpdateAsync(entity, logInfo, oldEntity);
            return entity;
        }

        public static async Task<bool> DeleteInventoryAsync(
            int id,
            [Service] IInventoryService service,
            [Service] IHttpContextAccessor httpContextAccessor
        )
        {
            var logInfo = EntityLogInfoHelper.GetLogInfo(httpContextAccessor);

            var result = await service.DeleteAsync(id, logInfo);
            if (!result)
                throw new GraphQLException(new Error($"Inventory with ID {id} not found"));
            return result;
        }
    }
}
