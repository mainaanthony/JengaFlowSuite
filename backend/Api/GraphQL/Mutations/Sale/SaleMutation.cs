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
    public static class SaleMutation
    {
        public static async Task<Sale> AddSaleAsync(
            SaleMutationInput input,
            EntityLogInfo logInfo,
            [Service] ISaleService service
        )
        {
            input.SaleNumber.CheckRequired(nameof(input.SaleNumber));
            input.CustomerId.CheckRequired(nameof(input.CustomerId));
            input.BranchId.CheckRequired(nameof(input.BranchId));
            input.AttendantUserId.CheckRequired(nameof(input.AttendantUserId));

            var entity = new Sale
            {
                SaleNumber = input.SaleNumber.Value!,
                CustomerId = input.CustomerId.Value,
                BranchId = input.BranchId.Value,
                AttendantUserId = input.AttendantUserId.Value,
                TotalAmount = input.TotalAmount.CheckForValue(0),
                PaymentMethod = input.PaymentMethod.CheckForValue(Enums.PaymentMethod.Cash),
                Status = input.Status.CheckForValue(Enums.OrderStatus.Completed),
                SaleDate = DateTime.UtcNow
            };

            entity = await service.AddAsync(entity, logInfo);
            return entity;
        }

        public static async Task<Sale> UpdateSaleAsync(
            SaleMutationInput input,
            EntityLogInfo logInfo,
            [Service] ISaleService service
        )
        {
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
            EntityLogInfo logInfo,
            [Service] ISaleService service
        )
        {
            var result = await service.DeleteAsync(id, logInfo);
            if (!result)
                throw new GraphQLException(new Error($"Sale with ID {id} not found"));
            return result;
        }
    }
}
