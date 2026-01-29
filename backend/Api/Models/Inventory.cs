using System.Text.Json.Serialization;

namespace Api.Models
{
    public class Inventory
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int BranchId { get; set; }
        public int Quantity { get; set; }
        public int ReorderLevel { get; set; } = 10;
        public int MaxStockLevel { get; set; } = 100;
        public DateTime LastRestocked { get; set; } = DateTime.UtcNow;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public virtual Product Product { get; set; } = null!;
        public virtual Branch Branch { get; set; } = null!;
    }
}
