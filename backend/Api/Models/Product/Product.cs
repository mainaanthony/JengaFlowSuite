using System.Text.Json.Serialization;
using Api.Core.Models;

namespace Api.Models.Product
{
    public class Product : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string SKU { get; set; } = string.Empty;
        public string? Brand { get; set; }
        public int? CategoryId { get; set; }
        public decimal Price { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation properties
        public virtual Category.Category? Category { get; set; }

        [JsonIgnore]
        public virtual ICollection<Inventory.Inventory> InventoryRecords { get; set; } = new List<Inventory.Inventory>();
        [JsonIgnore]
        public virtual ICollection<SaleItem.SaleItem> SaleItems { get; set; } = new List<SaleItem.SaleItem>();
        [JsonIgnore]
        public virtual ICollection<PurchaseOrderItem.PurchaseOrderItem> PurchaseOrderItems { get; set; } = new List<PurchaseOrderItem.PurchaseOrderItem>();
    }
}
