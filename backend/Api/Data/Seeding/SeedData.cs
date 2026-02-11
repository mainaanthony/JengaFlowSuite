using Microsoft.EntityFrameworkCore;

namespace Api.Data.Seeding;

/// <summary>
/// Handles database seeding operations for development and initial setup
/// </summary>
public static class SeedData
{
    /// <summary>
    /// Initialize and seed the database with default data
    /// Call this after migrations in Program.cs if needed
    /// </summary>
    public static async Task Initialize(IServiceProvider serviceProvider)
    {
        using var context = new AppDbContext(
            serviceProvider.GetRequiredService<DbContextOptions<AppDbContext>>());

        var logger = serviceProvider.GetRequiredService<ILogger<Program>>();

        try
        {
            // Check if database already has data
            if (await context.Branches.AnyAsync())
            {
                logger.LogInformation("Database already contains data. Skipping seed");
                return;
            }

            logger.LogInformation("Seeding database with initial data...");

            // Example: Seed default branches
            // await SeedBranches(context, logger);

            // Example: Seed default roles
            // await SeedRoles(context, logger);

            // Example: Seed default categories
            // await SeedCategories(context, logger);

            await context.SaveChangesAsync();
            logger.LogInformation("Database seeding completed successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while seeding the database");
            throw;
        }
    }

    // Example seeding method
    // private static async Task SeedBranches(AppDbContext context, ILogger logger)
    // {
    //     logger.LogInformation("Seeding branches...");
    //     
    //     var branches = new[]
    //     {
    //         new Branch { Id = Guid.NewGuid(), Name = "Main Branch", Location = "HQ" },
    //         new Branch { Id = Guid.NewGuid(), Name = "Branch 2", Location = "Downtown" }
    //     };
    //     
    //     await context.Branches.AddRangeAsync(branches);
    //     logger.LogInformation("Seeded {Count} branches", branches.Length);
    // }
}
