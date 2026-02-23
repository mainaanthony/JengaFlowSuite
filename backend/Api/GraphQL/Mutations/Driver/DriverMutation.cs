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
    public static class DriverMutation
    {
        public static async Task<Driver> AddDriverAsync(
            DriverMutationInput input,
            [Service] IDriverService service,
            [Service] IHttpContextAccessor httpContextAccessor
        )
        {
            var logInfo = EntityLogInfoHelper.GetLogInfo(httpContextAccessor);

            input.Name.CheckRequired(nameof(input.Name));
            input.Phone.CheckRequired(nameof(input.Phone));
            input.Vehicle.CheckRequired(nameof(input.Vehicle));

            var entity = new Driver
            {
                Name = input.Name.Value!,
                Phone = input.Phone.Value!,
                Vehicle = input.Vehicle.Value!,
                LicenseNumber = input.LicenseNumber.CheckForValue(null),
                VehicleRegistration = input.VehicleRegistration.CheckForValue(null),
                Status = input.Status.CheckForValue("Available"),
                Rating = input.Rating.CheckForValue(0),
                IsActive = input.IsActive.CheckForValue(true)
            };

            entity = await service.AddAsync(entity, logInfo);
            return entity;
        }

        public static async Task<Driver> UpdateDriverAsync(
            DriverMutationInput input,
            [Service] IDriverService service,
            [Service] IHttpContextAccessor httpContextAccessor
        )
        {
            var logInfo = EntityLogInfoHelper.GetLogInfo(httpContextAccessor);

            input.Id.CheckRequired(nameof(input.Id));

            var entity = await service.GetByIdAsync(input.Id.Value)
                ?? throw new GraphQLException(new Error($"Driver with ID {input.Id.Value} not found"));

            var oldEntity = JsonSerializer.Deserialize<Driver>(JsonSerializer.Serialize(entity));

            entity.Name = input.Name.CheckForValue(entity.Name);
            entity.Phone = input.Phone.CheckForValue(entity.Phone);
            entity.Vehicle = input.Vehicle.CheckForValue(entity.Vehicle);
            entity.LicenseNumber = input.LicenseNumber.CheckForValue(entity.LicenseNumber);
            entity.VehicleRegistration = input.VehicleRegistration.CheckForValue(entity.VehicleRegistration);
            entity.Status = input.Status.CheckForValue(entity.Status);
            entity.Rating = input.Rating.CheckForValue(entity.Rating);
            entity.IsActive = input.IsActive.CheckForValue(entity.IsActive);

            entity = await service.UpdateAsync(entity, logInfo, oldEntity);
            return entity;
        }

        public static async Task<bool> DeleteDriverAsync(
            int id,
            [Service] IDriverService service,
            [Service] IHttpContextAccessor httpContextAccessor
        )
        {
            var logInfo = EntityLogInfoHelper.GetLogInfo(httpContextAccessor);

            var result = await service.DeleteAsync(id, logInfo);
            if (!result)
                throw new GraphQLException(new Error($"Driver with ID {id} not found"));
            return result;
        }
    }
}
