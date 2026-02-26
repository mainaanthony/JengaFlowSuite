using Microsoft.EntityFrameworkCore;
using Api.Models;

namespace Api.Data.Seeding;

public static class SupplierSeeding
{
    public static void AddSupplierSeeding(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Supplier>().HasData(
            new Supplier
            {
                Id = 1,
                Name = "Kenya Building Supplies Ltd",
                ContactPerson = "John Kamau",
                Phone = "+254711000001",
                Email = "sales@kenyabuilding.co.ke",
                Address = "Industrial Area, Nairobi",
                Category = "Building Materials",
                Rating = 4.5m,
                IsActive = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Supplier
            {
                Id = 2,
                Name = "East Africa Hardware Co.",
                ContactPerson = "Amina Hassan",
                Phone = "+254722000002",
                Email = "info@eahardware.co.ke",
                Address = "Mombasa Road, Nairobi",
                Category = "Hardware",
                Rating = 4.2m,
                IsActive = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Supplier
            {
                Id = 3,
                Name = "Mabati Rolling Mills",
                ContactPerson = "Peter Ochieng",
                Phone = "+254733000003",
                Email = "orders@mabati.com",
                Address = "Athi River, Machakos",
                Category = "Building Materials",
                Rating = 4.8m,
                IsActive = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Supplier
            {
                Id = 4,
                Name = "Crown Paints Kenya",
                ContactPerson = "Grace Wanjiku",
                Phone = "+254744000004",
                Email = "supply@crownpaints.co.ke",
                Address = "Likoni Road, Industrial Area, Nairobi",
                Category = "Paint & Finishes",
                Rating = 4.6m,
                IsActive = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );
    }
}
