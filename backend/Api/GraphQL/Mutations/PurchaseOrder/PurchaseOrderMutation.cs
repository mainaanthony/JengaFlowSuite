using PurchaseOrder = Api.Models.PurchaseOrder;
using Api.Services;
using Api.Core;
using Api.Core.Models;
using Api.Models;
using HotChocolate;
using HotChocolate.Types;
using System.Text.Json;

namespace Api.GraphQL.Mutations
{
    [MutationType]
    public static class PurchaseOrderMutation
    {
        public static async Task<PurchaseOrder> AddPurchaseOrderAsync(
            PurchaseOrderMutationInput input,
            EntityLogInfo logInfo,
            [Service] IPurchaseOrderService service
        )
        {
            // Validate required fields
            input.SupplierId.CheckRequired(nameof(input.SupplierId));
            input.CreatedByUserId.CheckRequired(nameof(input.CreatedByUserId));

            if (!input.Items.HasValue || input.Items.Value == null || !input.Items.Value.Any())
                throw new GraphQLException(new Error("At least one purchase order item is required"));

            // Generate PO number
            var poNumber = $"PO-{DateTime.UtcNow:yyyyMMddHHmmss}";

            // Create purchase order entity
            var entity = new PurchaseOrder
            {
                PONumber = poNumber,
                SupplierId = input.SupplierId.Value,
                CreatedByUserId = input.CreatedByUserId.Value,
                Status = Enums.OrderStatus.Pending,
                ExpectedDeliveryDate = input.ExpectedDeliveryDate.Value ?? DateTime.UtcNow.AddDays(7),
                Notes = input.Notes.CheckForValue(null),
                TotalAmount = 0 // Will be calculated below
            };

            // Create purchase order items and calculate total
            decimal totalAmount = 0;
            foreach (var itemInput in input.Items.Value)
            {
                if (itemInput.ProductId <= 0)
                    throw new GraphQLException(new Error("ProductId is required for all items"));
                if (itemInput.Quantity <= 0)
                    throw new GraphQLException(new Error("Quantity must be greater than zero"));
                if (itemInput.UnitPrice < 0)
                    throw new GraphQLException(new Error("UnitPrice cannot be negative"));

                var itemTotal = itemInput.Quantity * itemInput.UnitPrice;
                var poItem = new PurchaseOrderItem
                {
                    ProductId = itemInput.ProductId,
                    Quantity = itemInput.Quantity,
                    UnitPrice = itemInput.UnitPrice,
                    TotalPrice = itemTotal
                };

                entity.Items.Add(poItem);
                totalAmount += itemTotal;
            }

            // Set the calculated total
            entity.TotalAmount = totalAmount;

            // Save to database
            entity = await service.AddAsync(entity, logInfo);
            return entity;
        }

        public static async Task<PurchaseOrder> UpdatePurchaseOrderAsync(
            PurchaseOrderMutationInput input,
            EntityLogInfo logInfo,
            [Service] IPurchaseOrderService service
        )
        {
            input.Id.CheckRequired(nameof(input.Id));

            var entity = await service.GetByIdAsync(input.Id.Value)
                ?? throw new GraphQLException(new Error($"PurchaseOrder with ID {input.Id.Value} not found"));

            var oldEntity = JsonSerializer.Deserialize<PurchaseOrder>(JsonSerializer.Serialize(entity));

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
