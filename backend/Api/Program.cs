using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Api.Data;
using Api.Repositories;
using Api.Repositories.Implementations;
using Api.Services;
using Api.Services.Implementations;
using Api.GraphQL;
using HotChocolate.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

var conn = Environment.GetEnvironmentVariable("ConnectionStrings__Default")
          ?? builder.Configuration.GetConnectionString("Default");

builder.Services.AddDbContext<AppDbContext>(opt => opt.UseSqlServer(conn));

// Register HttpContextAccessor for audit logging
builder.Services.AddHttpContextAccessor();

// Register Generic Repository
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

// Register Specific Repositories
builder.Services.AddScoped<IBranchRepository, BranchRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<ISupplierRepository, SupplierRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IDriverRepository, DriverRepository>();
builder.Services.AddScoped<IInventoryRepository, InventoryRepository>();
builder.Services.AddScoped<ISaleRepository, SaleRepository>();
builder.Services.AddScoped<ISaleItemRepository, SaleItemRepository>();
builder.Services.AddScoped<IPurchaseOrderRepository, PurchaseOrderRepository>();
builder.Services.AddScoped<IPurchaseOrderItemRepository, PurchaseOrderItemRepository>();
builder.Services.AddScoped<IStockTransferRepository, StockTransferRepository>();
builder.Services.AddScoped<IStockTransferItemRepository, StockTransferItemRepository>();
builder.Services.AddScoped<IDeliveryRepository, DeliveryRepository>();
builder.Services.AddScoped<IDeliveryItemRepository, DeliveryItemRepository>();
builder.Services.AddScoped<IGoodsReceivedNoteRepository, GoodsReceivedNoteRepository>();
builder.Services.AddScoped<IGoodsReceivedNoteItemRepository, GoodsReceivedNoteItemRepository>();
builder.Services.AddScoped<ITaxReturnRepository, TaxReturnRepository>();

// Register Specific Services
builder.Services.AddScoped<IBranchService, BranchService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<ISupplierService, SupplierService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserProvisioningService, UserProvisioningService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<IDriverService, DriverService>();
builder.Services.AddScoped<IInventoryService, InventoryService>();
builder.Services.AddScoped<ISaleService, SaleService>();
builder.Services.AddScoped<ISaleItemService, SaleItemService>();
builder.Services.AddScoped<IPurchaseOrderService, PurchaseOrderService>();
builder.Services.AddScoped<IPurchaseOrderItemService, PurchaseOrderItemService>();
builder.Services.AddScoped<IStockTransferService, StockTransferService>();
builder.Services.AddScoped<IStockTransferItemService, StockTransferItemService>();
builder.Services.AddScoped<IDeliveryService, DeliveryService>();
builder.Services.AddScoped<IDeliveryItemService, DeliveryItemService>();
builder.Services.AddScoped<IGoodsReceivedNoteService, GoodsReceivedNoteService>();
builder.Services.AddScoped<IGoodsReceivedNoteItemService, GoodsReceivedNoteItemService>();
builder.Services.AddScoped<ITaxReturnService, TaxReturnService>();

// Add Authentication with Keycloak JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // For Docker: use internal URL for metadata, but accept external issuer in tokens
        var metadataAddress = Environment.GetEnvironmentVariable("Keycloak__MetadataAddress")
            ?? builder.Configuration["Keycloak:MetadataAddress"]
            ?? $"{builder.Configuration["Keycloak:Authority"]}/.well-known/openid-configuration";

        var validIssuer = Environment.GetEnvironmentVariable("Keycloak__ValidIssuer")
            ?? builder.Configuration["Keycloak:ValidIssuer"]
            ?? builder.Configuration["Keycloak:Authority"];

        options.MetadataAddress = metadataAddress;
        options.RequireHttpsMetadata = false; // For development with HTTP

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = validIssuer,
            ValidateAudience = false, // Keycloak audiences can vary; disable for dev
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ClockSkew = TimeSpan.FromMinutes(1)
        };

        // Log JWT validation events for debugging
        options.Events = new Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"JWT Authentication failed: {context.Exception.Message}");
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine($"JWT Token validated for: {context.Principal?.Identity?.Name}");
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Register GraphQL
builder.Services.AddGraphQLConfig(builder.Environment);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Api", Version = "v1" });
});

var app = builder.Build();

// Apply pending migrations automatically on startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();

    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        var pendingMigrations = context.Database.GetPendingMigrations().ToList();

        if (pendingMigrations.Any())
        {
            logger.LogInformation("Found {Count} pending migration(s). Applying migrations...", pendingMigrations.Count);
            foreach (var migration in pendingMigrations)
            {
                logger.LogInformation("  - {Migration}", migration);
            }

            context.Database.Migrate();
            logger.LogInformation("Successfully applied all pending migrations");
        }
        else
        {
            logger.LogInformation("Database is up to date. No pending migrations");
        }

        // Optionally seed data here
        // await SeedData.Initialize(services);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while migrating the database");
        throw; // Re-throw to prevent app from starting with incorrect schema
    }
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowFrontend");

// Enable JWT authentication and authorization middleware
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapGraphQL("/graphql").WithOptions(new GraphQLServerOptions
{
    Tool = { Enable = true }
});

app.Run();
