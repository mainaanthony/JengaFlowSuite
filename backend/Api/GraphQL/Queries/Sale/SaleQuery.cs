using Api.Models;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries
{
    [ExtendObjectType("Query")]
    public static class SaleQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<Sale> GetSales([Service] ISaleService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<Sale?> GetSale(int id, [Service] ISaleService service)
            => await service.GetByIdAsync(id);

        [UseProjection]
        public static async Task<Sale?> GetSaleBySaleNumber(string saleNumber, [Service] ISaleService service)
            => await service.GetBySaleNumberAsync(saleNumber);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<Sale>> GetSalesByCustomer(int customerId, [Service] ISaleService service)
            => await service.GetByCustomerIdAsync(customerId);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<Sale>> GetSalesByBranch(int branchId, [Service] ISaleService service)
            => await service.GetByBranchIdAsync(branchId);
    }
}
