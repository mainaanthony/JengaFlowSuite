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
    public static class SaleMutation
    {
        public static async Task<Sale> AddSaleAsync(
            SaleMutationInput input,
            [Service] ISaleService service,
            [Service] IHttpContextAccessor httpContextAccessor
        )
        {
            var logInfo = EntityLogInfoHelper.GetLogInfo(httpContextAccessor);

            // Validate required fields
            input.CustomerId.CheckRequired(nameof(input.CustomerId));
            input.BranchId.CheckRequired(nameof(input.BranchId));
            input.AttendantUserId.CheckRequired(nameof(input.AttendantUserId));

            if (!input.Items.HasValue || input.Items.Value == null || !input.Items.Value.Any())
                throw new GraphQLException(new Error("At least one sale item is required"));

            // Generate sale number
            var saleNumber = $"SALE-{DateTime.UtcNow:yyyyMMddHHmmss}";

            // Create sale entity
            var entity = new Sale
            {
                SaleNumber = saleNumber,
                CustomerId = input.CustomerId.Value,
                BranchId = input.BranchId.Value,
                AttendantUserId = input.AttendantUserId.Value,
                PaymentMethod = input.PaymentMethod.CheckForValue(Enums.PaymentMethod.Cash),
                Status = Enums.OrderStatus.Completed,
                SaleDate = DateTime.UtcNow,
                TotalAmount = 0 // Will be calculated below
            };

            // Create sale items and calculate total
            decimal totalAmount = 0;
            foreach (var itemInput in input.Items.Value)
            {
                if (itemInput.ProductId <= 0)
                    throw new GraphQLException(new Error("ProductId is required for all items"));
                if (itemInput.Quantity <= 0)
                    throw new GraphQLException(new Error("Quantity must be greater than zero"));
                if (itemInput.UnitPrice < 0)
                    throw new GraphQLException(new Error("UnitPrice cannot be negative"));

                var itemTotal = (itemInput.Quantity * itemInput.UnitPrice) - (itemInput.Discount ?? 0);
                var saleItem = new SaleItem
                {
                    ProductId = itemInput.ProductId,
                    Quantity = itemInput.Quantity,
                    UnitPrice = itemInput.UnitPrice,
                    Discount = itemInput.Discount,
                    TotalPrice = itemTotal
                };

                entity.Items.Add(saleItem);
                totalAmount += itemTotal;
            }

            // Set the calculated total
            entity.TotalAmount = totalAmount;

            // Save to database
            entity = await service.AddAsync(entity, logInfo);
            return entity;
        }

        public static async Task<Sale> UpdateSaleAsync(
            SaleMutationInput input,
            [Service] ISaleService service,
            [Service] IHttpContextAccessor httpContextAccessor
        )
        {
            var logInfo = EntityLogInfoHelper.GetLogInfo(httpContextAccessor);

            input.Id.CheckRequired(nameof(input.Id));

            var entity = await service.GetByIdAsync(input.Id.Value)
                ?? throw new GraphQLException(new Error($"Sale with ID {input.Id.Value} not found"));

            var oldEntity = JsonSerializer.Deserialize<Sale>(JsonSerializer.Serialize(entity));

            entity.SaleNumber = input.SaleNumber.CheckForValue(entity.SaleNumber);
            entity.CustomerId = input.CustomerId.CheckForValue(entity.CustomerId);
            entity.BranchId = input.BranchId.CheckForValue(entity.BranchId);
            entity.AttendantUserId = input.AttendantUserId.CheckForValue(entity.AttendantUserId);
            entity.TotalAmount = input.TotalAmount.CheckForValue(entity.TotalAmount);
            entity.PaymentMethod = input.PaymentMethod.CheckForValue(entity.PaymentMethod);
            entity.Status = input.Status.CheckForValue(entity.Status);

            entity = await service.UpdateAsync(entity, logInfo, oldEntity);
            return entity;
        }

        public static async Task<bool> DeleteSaleAsync(
            int id,
            [Service] ISaleService service,
            [Service] IHttpContextAccessor httpContextAccessor
        )
        {
            var logInfo = EntityLogInfoHelper.GetLogInfo(httpContextAccessor);

            var result = await service.DeleteAsync(id, logInfo);
            if (!result)
                throw new GraphQLException(new Error($"Sale with ID {id} not found"));
            return result;
        }
    }
}
