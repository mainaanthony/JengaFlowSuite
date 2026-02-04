using Api.Models.StockTransfer;
using Api.Services;
using Api.Core;
using Api.Core.Models;
using HotChocolate;
using HotChocolate.Types;
using System.Text.Json;

namespace Api.GraphQL.Mutations.StockTransfer
{
    [MutationType]
    public static class StockTransferMutation
    {
        public static async Task<Models.StockTransfer.StockTransfer> AddStockTransferAsync(
            StockTransferMutationInput input,
            EntityLogInfo logInfo,
            [Service] IStockTransferService service
        )
        {
            input.TransferNumber.CheckRequired(nameof(input.TransferNumber));
            input.FromBranchId.CheckRequired(nameof(input.FromBranchId));
            input.ToBranchId.CheckRequired(nameof(input.ToBranchId));
            input.RequestedByUserId.CheckRequired(nameof(input.RequestedByUserId));

            var entity = new Models.StockTransfer.StockTransfer
            {
                TransferNumber = input.TransferNumber.Value!,
                FromBranchId = input.FromBranchId.Value,
                ToBranchId = input.ToBranchId.Value,
                RequestedByUserId = input.RequestedByUserId.Value,
                ApprovedByUserId = input.ApprovedByUserId.CheckForValue(null),
                Status = input.Status.CheckForValue(Enums.StockTransferStatus.Pending),
                RequestedDate = DateTime.UtcNow,
                CompletedDate = input.CompletedDate.CheckForValue(null),
                Notes = input.Notes.CheckForValue(null)
            };

            entity = await service.AddAsync(entity, logInfo);
            return entity;
        }

        public static async Task<Models.StockTransfer.StockTransfer> UpdateStockTransferAsync(
            StockTransferMutationInput input,
            EntityLogInfo logInfo,
            [Service] IStockTransferService service
        )
        {
            input.Id.CheckRequired(nameof(input.Id));

            var entity = await service.GetByIdAsync(input.Id.Value)
                ?? throw new GraphQLException(new Error($"StockTransfer with ID {input.Id.Value} not found"));

            var oldEntity = JsonSerializer.Deserialize<Models.StockTransfer.StockTransfer>(JsonSerializer.Serialize(entity));

            entity.TransferNumber = input.TransferNumber.CheckForValue(entity.TransferNumber);
            entity.FromBranchId = input.FromBranchId.CheckForValue(entity.FromBranchId);
            entity.ToBranchId = input.ToBranchId.CheckForValue(entity.ToBranchId);
            entity.RequestedByUserId = input.RequestedByUserId.CheckForValue(entity.RequestedByUserId);
            entity.ApprovedByUserId = input.ApprovedByUserId.CheckForValue(entity.ApprovedByUserId);
            entity.Status = input.Status.CheckForValue(entity.Status);
            entity.CompletedDate = input.CompletedDate.CheckForValue(entity.CompletedDate);
            entity.Notes = input.Notes.CheckForValue(entity.Notes);

            entity = await service.UpdateAsync(entity, logInfo, oldEntity);
            return entity;
        }

        public static async Task<bool> DeleteStockTransferAsync(
            int id,
            EntityLogInfo logInfo,
            [Service] IStockTransferService service
        )
        {
            var result = await service.DeleteAsync(id, logInfo);
            if (!result)
                throw new GraphQLException(new Error($"StockTransfer with ID {id} not found"));
            return result;
        }
    }
}
