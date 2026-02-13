using Microsoft.EntityFrameworkCore;
using Api.Models;

namespace Api.Data.Seeding;

public static partial class DataSeeding
{
    public static void AddProductSeeding(ModelBuilder builder)
    {
        builder.Entity<Product>().HasData(
          new Product
          {
              Id = 1,
              Name = "Keyboard",
              SKU = "KB-001",
              Price = 35.50m,
              CreatedAt = DateTime.UtcNow
          },
          new Product
          {
              Id = 2,
              Name = "Mouse",
              SKU = "MS-001",
              Price = 15.00m,
              CreatedAt = DateTime.UtcNow
          }
        );
    }
}