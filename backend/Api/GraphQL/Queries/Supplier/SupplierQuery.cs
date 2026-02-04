using Api.Models.Supplier;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries.Supplier
{
    [QueryType]
    public static class SupplierQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<Models.Supplier.Supplier> GetSuppliers([Service] ISupplierService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<Models.Supplier.Supplier?> GetSupplier(int id, [Service] ISupplierService service)
            => await service.GetByIdAsync(id);

        [UseProjection]
        public static async Task<Models.Supplier.Supplier?> GetSupplierByEmail(string email, [Service] ISupplierService service)
            => await service.GetByEmailAsync(email);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<Models.Supplier.Supplier>> GetActiveSuppliers([Service] ISupplierService service)
            => await service.GetActiveAsync();
    }
}
