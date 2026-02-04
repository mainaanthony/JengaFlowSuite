using Api.Models.PurchaseOrder;
using Api.Services;
using Api.Core;
using Api.Core.Models;
using HotChocolate;
using HotChocolate.Types;
using System.Text.Json;

namespace Api.GraphQL.Mutations.PurchaseOrder
{
    [MutationType]
    public static class PurchaseOrderMutation
    {
        public static async Task<Models.PurchaseOrder.PurchaseOrder> AddPurchaseOrderAsync(
            PurchaseOrderMutationInput input,
            EntityLogInfo logInfo,
            [Service] IPurchaseOrderService service
        )
        {
            input.PONumber.CheckRequired(nameof(input.PONumber));
            input.SupplierId.CheckRequired(nameof(input.SupplierId));
            input.CreatedByUserId.CheckRequired(nameof(input.CreatedByUserId));

            var entity = new Models.PurchaseOrder.PurchaseOrder
            {
                PONumber = input.PONumber.Value!,
                SupplierId = input.SupplierId.Value,
                CreatedByUserId = input.CreatedByUserId.Value,
                ApprovedByUserId = input.ApprovedByUserId.CheckForValue(null),
                TotalAmount = input.TotalAmount.CheckForValue(0),
                Status = input.Status.CheckForValue(Enums.OrderStatus.Pending),
                ExpectedDeliveryDate = input.ExpectedDeliveryDate.Value ?? DateTime.UtcNow.AddDays(7),
                DeliveredDate = input.DeliveredDate.CheckForValue(null),
                Notes = input.Notes.CheckForValue(null)
            };

            entity = await service.AddAsync(entity, logInfo);
            return entity;
        }

        public static async Task<Models.PurchaseOrder.PurchaseOrder> UpdatePurchaseOrderAsync(
            PurchaseOrderMutationInput input,
            EntityLogInfo logInfo,
            [Service] IPurchaseOrderService service
        )
        {
            input.Id.CheckRequired(nameof(input.Id));

            var entity = await service.GetByIdAsync(input.Id.Value)
                ?? throw new GraphQLException(new Error($"PurchaseOrder with ID {input.Id.Value} not found"));

            var oldEntity = JsonSerializer.Deserialize<Models.PurchaseOrder.PurchaseOrder>(JsonSerializer.Serialize(entity));

            entity.PONumber = input.PONumber.CheckForValue(entity.PONumber);
            entity.SupplierId = input.SupplierId.CheckForValue(entity.SupplierId);
            entity.CreatedByUserId = input.CreatedByUserId.CheckForValue(entity.CreatedByUserId);
            entity.ApprovedByUserId = input.ApprovedByUserId.CheckForValue(entity.ApprovedByUserId);
            entity.TotalAmount = input.TotalAmount.CheckForValue(entity.TotalAmount);
            entity.Status = input.Status.CheckForValue(entity.Status);
            if (input.ExpectedDeliveryDate.HasValue)
                entity.ExpectedDeliveryDate = input.ExpectedDeliveryDate.Value ?? entity.ExpectedDeliveryDate;
            entity.DeliveredDate = input.DeliveredDate.CheckForValue(entity.DeliveredDate);
            entity.Notes = input.Notes.CheckForValue(entity.Notes);

            entity = await service.UpdateAsync(entity, logInfo, oldEntity);
            return entity;
        }

        public static async Task<bool> DeletePurchaseOrderAsync(
            int id,
            EntityLogInfo logInfo,
            [Service] IPurchaseOrderService service
        )
        {
            var result = await service.DeleteAsync(id, logInfo);
            if (!result)
                throw new GraphQLException(new Error($"PurchaseOrder with ID {id} not found"));
            return result;
        }
    }
}
