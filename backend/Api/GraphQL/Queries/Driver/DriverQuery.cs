using Api.Models;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries
{
    [QueryType]
    public static class DriverQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<Driver> GetDrivers([Service] IDriverService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<Driver?> GetDriver(int id, [Service] IDriverService service)
            => await service.GetByIdAsync(id);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<Driver>> GetActiveDrivers([Service] IDriverService service)
            => await service.GetActiveAsync();

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<Driver>> GetAvailableDrivers([Service] IDriverService service)
            => await service.GetAvailableAsync();
    }
}
