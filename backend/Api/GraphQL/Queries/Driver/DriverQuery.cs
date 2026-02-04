using Api.Models.Driver;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries.Driver
{
    [QueryType]
    public static class DriverQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<Models.Driver.Driver> GetDrivers([Service] IDriverService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<Models.Driver.Driver?> GetDriver(int id, [Service] IDriverService service)
            => await service.GetByIdAsync(id);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<Models.Driver.Driver>> GetActiveDrivers([Service] IDriverService service)
            => await service.GetActiveAsync();

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<Models.Driver.Driver>> GetAvailableDrivers([Service] IDriverService service)
            => await service.GetAvailableAsync();
    }
}
