using Api.Models;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries
{
    [QueryType]
    public static class SupplierQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<Supplier> GetSuppliers([Service] ISupplierService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<Supplier?> GetSupplier(int id, [Service] ISupplierService service)
            => await service.GetByIdAsync(id);

        [UseProjection]
        public static async Task<Supplier?> GetSupplierByEmail(string email, [Service] ISupplierService service)
            => await service.GetByEmailAsync(email);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<Supplier>> GetActiveSuppliers([Service] ISupplierService service)
            => await service.GetActiveAsync();
    }
}
