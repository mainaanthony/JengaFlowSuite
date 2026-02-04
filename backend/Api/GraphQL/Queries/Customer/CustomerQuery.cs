using Api.Models.Customer;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries.Customer
{
    [QueryType]
    public static class CustomerQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<Models.Customer.Customer> GetCustomers([Service] ICustomerService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<Models.Customer.Customer?> GetCustomer(int id, [Service] ICustomerService service)
            => await service.GetByIdAsync(id);

        [UseProjection]
        public static async Task<Models.Customer.Customer?> GetCustomerByEmail(string email, [Service] ICustomerService service)
            => await service.GetByEmailAsync(email);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<Models.Customer.Customer>> GetActiveCustomers([Service] ICustomerService service)
            => await service.GetActiveAsync();
    }
}
