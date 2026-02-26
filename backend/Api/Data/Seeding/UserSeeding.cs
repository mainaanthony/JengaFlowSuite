using Microsoft.EntityFrameworkCore;
using Api.Models;

namespace Api.Data.Seeding
{
    public static class UserSeeding
    {
        public static void AddUserSeeding(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    KeycloakId = "417af088-4a66-4664-b850-c628e5866415", // Matches Keycloak dev user
                    Username = "devuser",
                    Email = "dev@jengaflow.com",
                    FirstName = "Dev",
                    LastName = "User",
                    Phone = "+254700000000",
                    IsActive = true,
                    BranchId = 1, // Head Office
                    RoleId = 1,   // Admin role
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                }
            );
        }
    }
}
