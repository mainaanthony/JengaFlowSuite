using Api.Models;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries
{
    [ExtendObjectType("Query")]
    public static class TaxReturnQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<TaxReturn> GetTaxReturns([Service] ITaxReturnService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<TaxReturn?> GetTaxReturn(int id, [Service] ITaxReturnService service)
            => await service.GetByIdAsync(id);

        [UseProjection]
        public static async Task<TaxReturn?> GetTaxReturnByPeriod(string period, [Service] ITaxReturnService service)
            => await service.GetByPeriodAsync(period);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<TaxReturn>> GetTaxReturnsByStatus(Enums.TaxReturnStatus status, [Service] ITaxReturnService service)
            => await service.GetByStatusAsync(status);
    }
}
