using Api.Models;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries
{
    [ExtendObjectType("Query")]
    public static class CustomerQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<Customer> GetCustomers([Service] ICustomerService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<Customer?> GetCustomer(int id, [Service] ICustomerService service)
            => await service.GetByIdAsync(id);

        [UseProjection]
        public static async Task<Customer?> GetCustomerByEmail(string email, [Service] ICustomerService service)
            => await service.GetByEmailAsync(email);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<Customer>> GetActiveCustomers([Service] ICustomerService service)
            => await service.GetActiveAsync();
    }
}
