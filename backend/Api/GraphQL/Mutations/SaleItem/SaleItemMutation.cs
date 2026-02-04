using Api.Models.SaleItem;
using Api.Services;
using Api.Core;
using Api.Core.Models;
using HotChocolate;
using HotChocolate.Types;
using System.Text.Json;

namespace Api.GraphQL.Mutations.SaleItem
{
    [MutationType]
    public static class SaleItemMutation
    {
        public static async Task<Models.SaleItem.SaleItem> AddSaleItemAsync(
            SaleItemMutationInput input,
            EntityLogInfo logInfo,
            [Service] ISaleItemService service
        )
        {
            input.SaleId.CheckRequired(nameof(input.SaleId));
            input.ProductId.CheckRequired(nameof(input.ProductId));
            input.Quantity.CheckRequired(nameof(input.Quantity));
            input.UnitPrice.CheckRequired(nameof(input.UnitPrice));

            var entity = new Models.SaleItem.SaleItem
            {
                SaleId = input.SaleId.Value,
                ProductId = input.ProductId.Value,
                Quantity = input.Quantity.Value,
                UnitPrice = input.UnitPrice.Value,
                TotalPrice = input.TotalPrice.CheckForValue(input.Quantity.Value * input.UnitPrice.Value),
                Discount = input.Discount.CheckForValue(null)
            };

            entity = await service.AddAsync(entity, logInfo);
            return entity;
        }

        public static async Task<Models.SaleItem.SaleItem> UpdateSaleItemAsync(
            SaleItemMutationInput input,
            EntityLogInfo logInfo,
            [Service] ISaleItemService service
        )
        {
            input.Id.CheckRequired(nameof(input.Id));

            var entity = await service.GetByIdAsync(input.Id.Value)
                ?? throw new GraphQLException(new Error($"SaleItem with ID {input.Id.Value} not found"));

            var oldEntity = JsonSerializer.Deserialize<Models.SaleItem.SaleItem>(JsonSerializer.Serialize(entity));

            entity.SaleId = input.SaleId.CheckForValue(entity.SaleId);
            entity.ProductId = input.ProductId.CheckForValue(entity.ProductId);
            entity.Quantity = input.Quantity.CheckForValue(entity.Quantity);
            entity.UnitPrice = input.UnitPrice.CheckForValue(entity.UnitPrice);
            entity.TotalPrice = input.TotalPrice.CheckForValue(entity.TotalPrice);
            entity.Discount = input.Discount.CheckForValue(entity.Discount);

            entity = await service.UpdateAsync(entity, logInfo, oldEntity);
            return entity;
        }

        public static async Task<bool> DeleteSaleItemAsync(
            int id,
            EntityLogInfo logInfo,
            [Service] ISaleItemService service
        )
        {
            var result = await service.DeleteAsync(id, logInfo);
            if (!result)
                throw new GraphQLException(new Error($"SaleItem with ID {id} not found"));
            return result;
        }
    }
}
