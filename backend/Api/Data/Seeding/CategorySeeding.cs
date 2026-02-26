using Microsoft.EntityFrameworkCore;
using Api.Models;

namespace Api.Data.Seeding;

public static class CategorySeeding
{
    public static void AddCategorySeeding(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>().HasData(
            new Category
            {
                Id = 1,
                Name = "Building Materials",
                Description = "Cement, steel, timber, and other construction materials",
                IsActive = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Category
            {
                Id = 2,
                Name = "Hardware",
                Description = "Nails, screws, bolts, and general hardware supplies",
                IsActive = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Category
            {
                Id = 3,
                Name = "Plumbing",
                Description = "Pipes, fittings, taps, and plumbing accessories",
                IsActive = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Category
            {
                Id = 4,
                Name = "Electrical",
                Description = "Cables, switches, sockets, and electrical components",
                IsActive = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Category
            {
                Id = 5,
                Name = "Paint & Finishes",
                Description = "Interior and exterior paints, varnishes, and coatings",
                IsActive = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Category
            {
                Id = 6,
                Name = "Tools & Equipment",
                Description = "Hand tools, power tools, and construction equipment",
                IsActive = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );
    }
}
