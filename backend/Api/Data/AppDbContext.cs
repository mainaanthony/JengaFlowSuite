using Microsoft.EntityFrameworkCore;
using Api.Models;
using Api.Data.Seeding;

namespace Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // DbSets
        public DbSet<Product> Products => Set<Product>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Branch> Branches => Set<Branch>();
        public DbSet<Role> Roles => Set<Role>();
        public DbSet<User> Users => Set<User>();
        public DbSet<Customer> Customers => Set<Customer>();
        public DbSet<Supplier> Suppliers => Set<Supplier>();
        public DbSet<Driver> Drivers => Set<Driver>();
        public DbSet<Sale> Sales => Set<Sale>();
        public DbSet<SaleItem> SaleItems => Set<SaleItem>();
        public DbSet<PurchaseOrder> PurchaseOrders => Set<PurchaseOrder>();
        public DbSet<PurchaseOrderItem> PurchaseOrderItems => Set<PurchaseOrderItem>();
        public DbSet<GoodsReceivedNote> GoodsReceivedNotes => Set<GoodsReceivedNote>();
        public DbSet<GoodsReceivedNoteItem> GoodsReceivedNoteItems => Set<GoodsReceivedNoteItem>();
        public DbSet<Inventory> Inventory => Set<Inventory>();
        public DbSet<StockTransfer> StockTransfers => Set<StockTransfer>();
        public DbSet<StockTransferItem> StockTransferItems => Set<StockTransferItem>();
        public DbSet<Delivery> Deliveries => Set<Delivery>();
        public DbSet<DeliveryItem> DeliveryItems => Set<DeliveryItem>();
        public DbSet<TaxReturn> TaxReturns => Set<TaxReturn>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var isDockerEnv = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development"
                     && Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true";

            if (!isDockerEnv)
            {
                modelBuilder.HasDefaultSchema("jengaFlow");
            }

            // Apply configurations
            modelBuilder.ApplyConfiguration(new Configurations.ProductConfiguration());
            modelBuilder.ApplyConfiguration(new Configurations.CategoryConfiguration());
            modelBuilder.ApplyConfiguration(new Configurations.BranchConfiguration());
            modelBuilder.ApplyConfiguration(new Configurations.RoleConfiguration());
            modelBuilder.ApplyConfiguration(new Configurations.UserConfiguration());
            modelBuilder.ApplyConfiguration(new Configurations.CustomerConfiguration());
            modelBuilder.ApplyConfiguration(new Configurations.SupplierConfiguration());
            modelBuilder.ApplyConfiguration(new Configurations.DriverConfiguration());
            modelBuilder.ApplyConfiguration(new Configurations.SaleConfiguration());
            modelBuilder.ApplyConfiguration(new Configurations.SaleItemConfiguration());
            modelBuilder.ApplyConfiguration(new Configurations.PurchaseOrderConfiguration());
            modelBuilder.ApplyConfiguration(new Configurations.PurchaseOrderItemConfiguration());
            modelBuilder.ApplyConfiguration(new Configurations.GoodsReceivedNoteConfiguration());
            modelBuilder.ApplyConfiguration(new Configurations.GoodsReceivedNoteItemConfiguration());
            modelBuilder.ApplyConfiguration(new Configurations.InventoryConfiguration());
            modelBuilder.ApplyConfiguration(new Configurations.StockTransferConfiguration());
            modelBuilder.ApplyConfiguration(new Configurations.StockTransferItemConfiguration());
            modelBuilder.ApplyConfiguration(new Configurations.DeliveryConfiguration());
            modelBuilder.ApplyConfiguration(new Configurations.DeliveryItemConfiguration());
            modelBuilder.ApplyConfiguration(new Configurations.TaxReturnConfiguration());

            // Seed data
            DataSeeding.AddProductSeeding(modelBuilder);
            BranchSeeding.AddBranchSeeding(modelBuilder);
            RoleSeeding.AddRoleSeeding(modelBuilder);
        }
    }
}
