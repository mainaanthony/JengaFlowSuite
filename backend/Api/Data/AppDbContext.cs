using Microsoft.EntityFrameworkCore;
using Api.Models;
using Api.Data.Seeding;

namespace Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}
        public DbSet<Product> Products => Set<Product>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var isDockerEnv = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development" 
                     && Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true";
    
         if (!isDockerEnv)
         {
        modelBuilder.HasDefaultSchema("jengaFlow");
         }
         modelBuilder.ApplyConfiguration(new Configurations.ProductConfiguration());

         DataSeeding.AddProductSeeding(modelBuilder);
        }
    }
}
