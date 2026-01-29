using Microsoft.EntityFrameworkCore;
using Api.Models;

namespace Api.Data.Seeding
{
    public static class BranchSeeding
    {
        public static void AddBranchSeeding(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Branch>().HasData(
                new Branch
                {
                    Id = 1,
                    Name = "Head Office",
                    Code = "HQ001",
                    Address = "123 Main Street",
                    City = "Nairobi",
                    Phone = "+254700000001",
                    Email = "headoffice@jengaflow.com",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Branch
                {
                    Id = 2,
                    Name = "Westlands Branch",
                    Code = "WL001",
                    Address = "456 Westlands Avenue",
                    City = "Nairobi",
                    Phone = "+254700000002",
                    Email = "westlands@jengaflow.com",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            );
        }
    }
}
