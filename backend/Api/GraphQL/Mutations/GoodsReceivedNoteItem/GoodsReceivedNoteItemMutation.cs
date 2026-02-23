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
    public static class GoodsReceivedNoteItemMutation
    {
        public static async Task<GoodsReceivedNoteItem> AddGoodsReceivedNoteItemAsync(
            GoodsReceivedNoteItemMutationInput input,
            [Service] IGoodsReceivedNoteItemService service,
            [Service] IHttpContextAccessor httpContextAccessor
        )
        {
            var logInfo = EntityLogInfoHelper.GetLogInfo(httpContextAccessor);

            input.GoodsReceivedNoteId.CheckRequired(nameof(input.GoodsReceivedNoteId));
            input.ProductId.CheckRequired(nameof(input.ProductId));
            input.QuantityOrdered.CheckRequired(nameof(input.QuantityOrdered));
            input.QuantityReceived.CheckRequired(nameof(input.QuantityReceived));

            var entity = new GoodsReceivedNoteItem
            {
                GoodsReceivedNoteId = input.GoodsReceivedNoteId.Value,
                ProductId = input.ProductId.Value,
                QuantityOrdered = input.QuantityOrdered.Value,
                QuantityReceived = input.QuantityReceived.Value,
                Remarks = input.Remarks.CheckForValue(null)
            };

            entity = await service.AddAsync(entity, logInfo);
            return entity;
        }

        public static async Task<GoodsReceivedNoteItem> UpdateGoodsReceivedNoteItemAsync(
            GoodsReceivedNoteItemMutationInput input,
            [Service] IGoodsReceivedNoteItemService service,
            [Service] IHttpContextAccessor httpContextAccessor
        )
        {
            var logInfo = EntityLogInfoHelper.GetLogInfo(httpContextAccessor);

            input.Id.CheckRequired(nameof(input.Id));

            var entity = await service.GetByIdAsync(input.Id.Value)
                ?? throw new GraphQLException(new Error($"GoodsReceivedNoteItem with ID {input.Id.Value} not found"));

            var oldEntity = JsonSerializer.Deserialize<GoodsReceivedNoteItem>(JsonSerializer.Serialize(entity));

            entity.GoodsReceivedNoteId = input.GoodsReceivedNoteId.CheckForValue(entity.GoodsReceivedNoteId);
            entity.ProductId = input.ProductId.CheckForValue(entity.ProductId);
            entity.QuantityOrdered = input.QuantityOrdered.CheckForValue(entity.QuantityOrdered);
            entity.QuantityReceived = input.QuantityReceived.CheckForValue(entity.QuantityReceived);
            entity.Remarks = input.Remarks.CheckForValue(entity.Remarks);

            entity = await service.UpdateAsync(entity, logInfo, oldEntity);
            return entity;
        }

        public static async Task<bool> DeleteGoodsReceivedNoteItemAsync(
            int id,
            [Service] IGoodsReceivedNoteItemService service,
            [Service] IHttpContextAccessor httpContextAccessor
        )
        {
            var logInfo = EntityLogInfoHelper.GetLogInfo(httpContextAccessor);

            var result = await service.DeleteAsync(id, logInfo);
            if (!result)
                throw new GraphQLException(new Error($"GoodsReceivedNoteItem with ID {id} not found"));
            return result;
        }
    }
}
