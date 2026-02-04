using Api.Data;
using Api.Models;
using HotChocolate;
using HotChocolate.Data;

namespace Api.GraphQL
{
    public class Query
    {
        // Products
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Product> GetProducts([Service] AppDbContext db)
            => db.Products.AsQueryable();

        [UseProjection]
        public IQueryable<Product> GetProduct(int id, [Service] AppDbContext db)
            => db.Products.Where(p => p.Id == id);

        // Categories
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Category> GetCategories([Service] AppDbContext db)
            => db.Categories.AsQueryable();

        [UseProjection]
        public IQueryable<Category> GetCategory(int id, [Service] AppDbContext db)
            => db.Categories.Where(c => c.Id == id);

        // Customers
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Customer> GetCustomers([Service] AppDbContext db)
            => db.Customers.AsQueryable();

        [UseProjection]
        public IQueryable<Customer> GetCustomer(int id, [Service] AppDbContext db)
            => db.Customers.Where(c => c.Id == id);

        // Suppliers
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Supplier> GetSuppliers([Service] AppDbContext db)
            => db.Suppliers.AsQueryable();

        [UseProjection]
        public IQueryable<Supplier> GetSupplier(int id, [Service] AppDbContext db)
            => db.Suppliers.Where(s => s.Id == id);

        // Branches
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Branch> GetBranches([Service] AppDbContext db)
            => db.Branches.AsQueryable();

        [UseProjection]
        public IQueryable<Branch> GetBranch(int id, [Service] AppDbContext db)
            => db.Branches.Where(b => b.Id == id);

        // Users
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<User> GetUsers([Service] AppDbContext db)
            => db.Users.AsQueryable();

        [UseProjection]
        public IQueryable<User> GetUser(int id, [Service] AppDbContext db)
            => db.Users.Where(u => u.Id == id);

        // Roles
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Role> GetRoles([Service] AppDbContext db)
            => db.Roles.AsQueryable();

        [UseProjection]
        public IQueryable<Role> GetRole(int id, [Service] AppDbContext db)
            => db.Roles.Where(r => r.Id == id);

        // Sales
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Sale> GetSales([Service] AppDbContext db)
            => db.Sales.AsQueryable();

        [UseProjection]
        public IQueryable<Sale> GetSale(int id, [Service] AppDbContext db)
            => db.Sales.Where(s => s.Id == id);

        // Purchase Orders
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<PurchaseOrder> GetPurchaseOrders([Service] AppDbContext db)
            => db.PurchaseOrders.AsQueryable();

        [UseProjection]
        public IQueryable<PurchaseOrder> GetPurchaseOrder(int id, [Service] AppDbContext db)
            => db.PurchaseOrders.Where(po => po.Id == id);

        // Inventory
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Inventory> GetInventory([Service] AppDbContext db)
            => db.Inventory.AsQueryable();

        [UseProjection]
        public IQueryable<Inventory> GetInventoryItem(int id, [Service] AppDbContext db)
            => db.Inventory.Where(i => i.Id == id);

        // Drivers
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Driver> GetDrivers([Service] AppDbContext db)
            => db.Drivers.AsQueryable();

        [UseProjection]
        public IQueryable<Driver> GetDriver(int id, [Service] AppDbContext db)
            => db.Drivers.Where(d => d.Id == id);

        // Deliveries
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Delivery> GetDeliveries([Service] AppDbContext db)
            => db.Deliveries.AsQueryable();

        [UseProjection]
        public IQueryable<Delivery> GetDelivery(int id, [Service] AppDbContext db)
            => db.Deliveries.Where(d => d.Id == id);

        // Stock Transfers
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<StockTransfer> GetStockTransfers([Service] AppDbContext db)
            => db.StockTransfers.AsQueryable();

        [UseProjection]
        public IQueryable<StockTransfer> GetStockTransfer(int id, [Service] AppDbContext db)
            => db.StockTransfers.Where(st => st.Id == id);

        // Goods Received Notes
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<GoodsReceivedNote> GetGoodsReceivedNotes([Service] AppDbContext db)
            => db.GoodsReceivedNotes.AsQueryable();

        [UseProjection]
        public IQueryable<GoodsReceivedNote> GetGoodsReceivedNote(int id, [Service] AppDbContext db)
            => db.GoodsReceivedNotes.Where(grn => grn.Id == id);

        // Tax Returns
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<TaxReturn> GetTaxReturns([Service] AppDbContext db)
            => db.TaxReturns.AsQueryable();

        [UseProjection]
        public IQueryable<TaxReturn> GetTaxReturn(int id, [Service] AppDbContext db)
            => db.TaxReturns.Where(tr => tr.Id == id);
    }
}
