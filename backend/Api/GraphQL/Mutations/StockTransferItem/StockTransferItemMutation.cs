using Api.Models.StockTransferItem;
using Api.Services;
using Api.Core;
using Api.Core.Models;
using HotChocolate;
using HotChocolate.Types;
using System.Text.Json;

namespace Api.GraphQL.Mutations.StockTransferItem
{
    [MutationType]
    public static class StockTransferItemMutation
    {
        public static async Task<Models.StockTransferItem.StockTransferItem> AddStockTransferItemAsync(
            StockTransferItemMutationInput input,
            EntityLogInfo logInfo,
            [Service] IStockTransferItemService service
        )
        {
            input.StockTransferId.CheckRequired(nameof(input.StockTransferId));
            input.ProductId.CheckRequired(nameof(input.ProductId));
            input.QuantityRequested.CheckRequired(nameof(input.QuantityRequested));

            var entity = new Models.StockTransferItem.StockTransferItem
            {
                StockTransferId = input.StockTransferId.Value,
                ProductId = input.ProductId.Value,
                QuantityRequested = input.QuantityRequested.Value,
                QuantityTransferred = input.QuantityTransferred.CheckForValue(null)
            };

            entity = await service.AddAsync(entity, logInfo);
            return entity;
        }

        public static async Task<Models.StockTransferItem.StockTransferItem> UpdateStockTransferItemAsync(
            StockTransferItemMutationInput input,
            EntityLogInfo logInfo,
            [Service] IStockTransferItemService service
        )
        {
            input.Id.CheckRequired(nameof(input.Id));

            var entity = await service.GetByIdAsync(input.Id.Value)
                ?? throw new GraphQLException(new Error($"StockTransferItem with ID {input.Id.Value} not found"));

            var oldEntity = JsonSerializer.Deserialize<Models.StockTransferItem.StockTransferItem>(JsonSerializer.Serialize(entity));

            entity.StockTransferId = input.StockTransferId.CheckForValue(entity.StockTransferId);
            entity.ProductId = input.ProductId.CheckForValue(entity.ProductId);
            entity.QuantityRequested = input.QuantityRequested.CheckForValue(entity.QuantityRequested);
            entity.QuantityTransferred = input.QuantityTransferred.CheckForValue(entity.QuantityTransferred);

            entity = await service.UpdateAsync(entity, logInfo, oldEntity);
            return entity;
        }

        public static async Task<bool> DeleteStockTransferItemAsync(
            int id,
            EntityLogInfo logInfo,
            [Service] IStockTransferItemService service
        )
        {
            var result = await service.DeleteAsync(id, logInfo);
            if (!result)
                throw new GraphQLException(new Error($"StockTransferItem with ID {id} not found"));
            return result;
        }
    }
}
