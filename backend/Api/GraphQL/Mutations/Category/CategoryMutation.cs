using Api.Models.Category;
using Api.Services;
using Api.Core;
using Api.Core.Models;
using HotChocolate;
using HotChocolate.Types;
using System.Text.Json;

namespace Api.GraphQL.Mutations.Category
{
    [MutationType]
    public static class CategoryMutation
    {
        public static async Task<Models.Category.Category> AddCategoryAsync(
            CategoryMutationInput input,
            EntityLogInfo logInfo,
            [Service] ICategoryService service
        )
        {
            input.Name.CheckRequired(nameof(input.Name));

            var entity = new Models.Category.Category
            {
                Name = input.Name.Value!,
                Description = input.Description.CheckForValue(null),
                IsActive = input.IsActive.CheckForValue(true)
            };

            entity = await service.AddAsync(entity, logInfo);
            return entity;
        }

        public static async Task<Models.Category.Category> UpdateCategoryAsync(
            CategoryMutationInput input,
            EntityLogInfo logInfo,
            [Service] ICategoryService service
        )
        {
            input.Id.CheckRequired(nameof(input.Id));

            var entity = await service.GetByIdAsync(input.Id.Value)
                ?? throw new GraphQLException(new Error($"Category with ID {input.Id.Value} not found"));

            var oldEntity = JsonSerializer.Deserialize<Models.Category.Category>(JsonSerializer.Serialize(entity));

            entity.Name = input.Name.CheckForValue(entity.Name);
            entity.Description = input.Description.CheckForValue(entity.Description);
            entity.IsActive = input.IsActive.CheckForValue(entity.IsActive);

            entity = await service.UpdateAsync(entity, logInfo, oldEntity);
            return entity;
        }

        public static async Task<bool> DeleteCategoryAsync(
            int id,
            EntityLogInfo logInfo,
            [Service] ICategoryService service
        )
        {
            var result = await service.DeleteAsync(id, logInfo);
            if (!result)
                throw new GraphQLException(new Error($"Category with ID {id} not found"));
            return result;
        }
    }
}
