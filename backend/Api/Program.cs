using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Api.Data;
using Api.Repositories;
using Api.Repositories.Implementations;
using Api.Services;
using Api.Services.Implementations;

var builder = WebApplication.CreateBuilder(args);

var conn = Environment.GetEnvironmentVariable("ConnectionStrings__Default")
          ?? builder.Configuration.GetConnectionString("Default");

builder.Services.AddDbContext<AppDbContext>(opt => opt.UseSqlServer(conn));

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

// Register GraphQL
builder.Services
    .AddGraphQLServer()
    .AddProjections()
    .AddFiltering()
    .AddSorting()
    .ModifyRequestOptions(o => o.IncludeExceptionDetails = true);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Api", Version = "v1" });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (context.Database.GetPendingMigrations().Any())
    {
        context.Database.Migrate();
    }
}

app.UseSwagger();
app.UseSwaggerUI();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapGraphQL("/graphql");

app.Run();
