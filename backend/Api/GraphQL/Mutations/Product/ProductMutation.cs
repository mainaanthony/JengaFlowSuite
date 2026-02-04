using Api.Models.Product;
using Api.Services;
using Api.Core;
using Api.Core.Models;
using HotChocolate;
using HotChocolate.Types;
using System.Text.Json;

namespace Api.GraphQL.Mutations.Product
{
    [MutationType]
    public static class ProductMutation
    {
        public static async Task<Models.Product.Product> AddProductAsync(
            ProductMutationInput input,
            EntityLogInfo logInfo,
            [Service] IProductService service
        )
        {
            input.Name.CheckRequired(nameof(input.Name));
            input.SKU.CheckRequired(nameof(input.SKU));

            var entity = new Models.Product.Product
            {
                Name = input.Name.Value!,
                SKU = input.SKU.Value!,
                Brand = input.Brand.CheckForValue(null),
                CategoryId = input.CategoryId.CheckForValue(null),
                Price = input.Price.CheckForValue(0),
                Description = input.Description.CheckForValue(null),
                IsActive = input.IsActive.CheckForValue(true)
            };

            entity = await service.AddAsync(entity, logInfo);
            return entity;
        }

        public static async Task<Models.Product.Product> UpdateProductAsync(
            ProductMutationInput input,
            EntityLogInfo logInfo,
            [Service] IProductService service
        )
        {
            input.Id.CheckRequired(nameof(input.Id));

            var entity = await service.GetByIdAsync(input.Id.Value)
                ?? throw new GraphQLException(new Error($"Product with ID {input.Id.Value} not found"));

            var oldEntity = JsonSerializer.Deserialize<Models.Product.Product>(JsonSerializer.Serialize(entity));

            entity.Name = input.Name.CheckForValue(entity.Name);
            entity.SKU = input.SKU.CheckForValue(entity.SKU);
            entity.Brand = input.Brand.CheckForValue(entity.Brand);
            entity.CategoryId = input.CategoryId.CheckForValue(entity.CategoryId);
            entity.Price = input.Price.CheckForValue(entity.Price);
            entity.Description = input.Description.CheckForValue(entity.Description);
            entity.IsActive = input.IsActive.CheckForValue(entity.IsActive);

            entity = await service.UpdateAsync(entity, logInfo, oldEntity);
            return entity;
        }

        public static async Task<bool> DeleteProductAsync(
            int id,
            EntityLogInfo logInfo,
            [Service] IProductService service
        )
        {
            var result = await service.DeleteAsync(id, logInfo);
            if (!result)
                throw new GraphQLException(new Error($"Product with ID {id} not found"));
            return result;
        }
    }
}
