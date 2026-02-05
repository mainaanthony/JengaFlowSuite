using Api.Models;
using Api.Services;
using Api.Core;
using Api.Core.Models;
using HotChocolate;
using HotChocolate.Types;
using System.Text.Json;

namespace Api.GraphQL.Mutations
{
    [MutationType]
    public static class GoodsReceivedNoteMutation
    {
        public static async Task<GoodsReceivedNote> AddGoodsReceivedNoteAsync(
            GoodsReceivedNoteMutationInput input,
            EntityLogInfo logInfo,
            [Service] IGoodsReceivedNoteService service
        )
        {
            input.GRNNumber.CheckRequired(nameof(input.GRNNumber));
            input.PurchaseOrderId.CheckRequired(nameof(input.PurchaseOrderId));
            input.ReceivedByUserId.CheckRequired(nameof(input.ReceivedByUserId));

            var entity = new GoodsReceivedNote
            {
                GRNNumber = input.GRNNumber.Value!,
                PurchaseOrderId = input.PurchaseOrderId.Value,
                ReceivedByUserId = input.ReceivedByUserId.Value,
                ReceivedDate = input.ReceivedDate.Value ?? DateTime.UtcNow,
                Notes = input.Notes.CheckForValue(null),
                Status = input.Status.CheckForValue(Enums.GoodsReceivedNoteStatus.FullyReceived)
            };

            entity = await service.AddAsync(entity, logInfo);
            return entity;
        }

        public static async Task<GoodsReceivedNote> UpdateGoodsReceivedNoteAsync(
            GoodsReceivedNoteMutationInput input,
            EntityLogInfo logInfo,
            [Service] IGoodsReceivedNoteService service
        )
        {
            input.Id.CheckRequired(nameof(input.Id));

            var entity = await service.GetByIdAsync(input.Id.Value)
                ?? throw new GraphQLException(new Error($"GoodsReceivedNote with ID {input.Id.Value} not found"));

            var oldEntity = JsonSerializer.Deserialize<GoodsReceivedNote>(JsonSerializer.Serialize(entity));

            entity.GRNNumber = input.GRNNumber.CheckForValue(entity.GRNNumber);
            entity.PurchaseOrderId = input.PurchaseOrderId.CheckForValue(entity.PurchaseOrderId);
            entity.ReceivedByUserId = input.ReceivedByUserId.CheckForValue(entity.ReceivedByUserId);
            if (input.ReceivedDate.HasValue)
                entity.ReceivedDate = input.ReceivedDate.Value ?? entity.ReceivedDate;
            entity.Notes = input.Notes.CheckForValue(entity.Notes);
            entity.Status = input.Status.CheckForValue(entity.Status);

            entity = await service.UpdateAsync(entity, logInfo, oldEntity);
            return entity;
        }

        public static async Task<bool> DeleteGoodsReceivedNoteAsync(
            int id,
            EntityLogInfo logInfo,
            [Service] IGoodsReceivedNoteService service
        )
        {
            var result = await service.DeleteAsync(id, logInfo);
            if (!result)
                throw new GraphQLException(new Error($"GoodsReceivedNote with ID {id} not found"));
            return result;
        }
    }
}
