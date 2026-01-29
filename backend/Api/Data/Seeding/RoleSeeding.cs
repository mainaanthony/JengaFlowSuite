using Microsoft.EntityFrameworkCore;
using Api.Models;

namespace Api.Data.Seeding
{
    public static class RoleSeeding
    {
        public static void AddRoleSeeding(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Role>().HasData(
                new Role
                {
                    Id = 1,
                    Name = "Admin",
                    Description = "System administrator with full access",
                    CreatedAt = DateTime.UtcNow
                },
                new Role
                {
                    Id = 2,
                    Name = "Manager",
                    Description = "Branch manager with management access",
                    CreatedAt = DateTime.UtcNow
                },
                new Role
                {
                    Id = 3,
                    Name = "Sales",
                    Description = "Sales representative",
                    CreatedAt = DateTime.UtcNow
                },
                new Role
                {
                    Id = 4,
                    Name = "Inventory",
                    Description = "Inventory management staff",
                    CreatedAt = DateTime.UtcNow
                },
                new Role
                {
                    Id = 5,
                    Name = "Cashier",
                    Description = "Point of sale cashier",
                    CreatedAt = DateTime.UtcNow
                }
            );
        }
    }
}
