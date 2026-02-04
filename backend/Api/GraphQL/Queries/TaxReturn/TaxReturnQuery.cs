using Api.Models.TaxReturn;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries.TaxReturn
{
    [QueryType]
    public static class TaxReturnQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<Models.TaxReturn.TaxReturn> GetTaxReturns([Service] ITaxReturnService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<Models.TaxReturn.TaxReturn?> GetTaxReturn(int id, [Service] ITaxReturnService service)
            => await service.GetByIdAsync(id);

        [UseProjection]
        public static async Task<Models.TaxReturn.TaxReturn?> GetTaxReturnByPeriod(string period, [Service] ITaxReturnService service)
            => await service.GetByPeriodAsync(period);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<Models.TaxReturn.TaxReturn>> GetTaxReturnsByStatus(Enums.TaxReturnStatus status, [Service] ITaxReturnService service)
            => await service.GetByStatusAsync(status);
    }
}
