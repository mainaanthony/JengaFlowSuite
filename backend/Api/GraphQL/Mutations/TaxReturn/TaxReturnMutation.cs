using Api.Models.TaxReturn;
using Api.Services;
using Api.Core;
using Api.Core.Models;
using HotChocolate;
using HotChocolate.Types;
using System.Text.Json;

namespace Api.GraphQL.Mutations.TaxReturn
{
    [MutationType]
    public static class TaxReturnMutation
    {
        public static async Task<Models.TaxReturn.TaxReturn> AddTaxReturnAsync(
            TaxReturnMutationInput input,
            EntityLogInfo logInfo,
            [Service] ITaxReturnService service
        )
        {
            input.Period.CheckRequired(nameof(input.Period));

            var entity = new Models.TaxReturn.TaxReturn
            {
                Period = input.Period.Value!,
                TaxType = input.TaxType.CheckForValue(Enums.TaxType.VAT),
                Amount = input.Amount.CheckForValue(0),
                Status = input.Status.CheckForValue(Enums.TaxReturnStatus.Draft),
                DueDate = input.DueDate.Value ?? DateTime.UtcNow.AddDays(30),
                SubmittedDate = input.SubmittedDate.CheckForValue(null),
                SubmittedByUserId = input.SubmittedByUserId.CheckForValue(null),
                ReferenceNumber = input.ReferenceNumber.CheckForValue(null)
            };

            entity = await service.AddAsync(entity, logInfo);
            return entity;
        }

        public static async Task<Models.TaxReturn.TaxReturn> UpdateTaxReturnAsync(
            TaxReturnMutationInput input,
            EntityLogInfo logInfo,
            [Service] ITaxReturnService service
        )
        {
            input.Id.CheckRequired(nameof(input.Id));

            var entity = await service.GetByIdAsync(input.Id.Value)
                ?? throw new GraphQLException(new Error($"TaxReturn with ID {input.Id.Value} not found"));

            var oldEntity = JsonSerializer.Deserialize<Models.TaxReturn.TaxReturn>(JsonSerializer.Serialize(entity));

            entity.Period = input.Period.CheckForValue(entity.Period);
            entity.TaxType = input.TaxType.CheckForValue(entity.TaxType);
            entity.Amount = input.Amount.CheckForValue(entity.Amount);
            entity.Status = input.Status.CheckForValue(entity.Status);
            if (input.DueDate.HasValue)
                entity.DueDate = input.DueDate.Value ?? entity.DueDate;
            entity.SubmittedDate = input.SubmittedDate.CheckForValue(entity.SubmittedDate);
            entity.SubmittedByUserId = input.SubmittedByUserId.CheckForValue(entity.SubmittedByUserId);
            entity.ReferenceNumber = input.ReferenceNumber.CheckForValue(entity.ReferenceNumber);

            entity = await service.UpdateAsync(entity, logInfo, oldEntity);
            return entity;
        }

        public static async Task<bool> DeleteTaxReturnAsync(
            int id,
            EntityLogInfo logInfo,
            [Service] ITaxReturnService service
        )
        {
            var result = await service.DeleteAsync(id, logInfo);
            if (!result)
                throw new GraphQLException(new Error($"TaxReturn with ID {id} not found"));
            return result;
        }
    }
}
