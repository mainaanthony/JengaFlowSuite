using Api.Data;
using Api.Models;
using HotChocolate;
using HotChocolate.Data;

namespace Api.GraphQL
{
    public class Query
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Product> GetProducts([Service] AppDbContext db)
            => db.Products.AsQueryable();
    }
}
