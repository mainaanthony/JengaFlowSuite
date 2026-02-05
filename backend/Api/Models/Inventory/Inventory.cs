using System.Text.Json.Serialization;
using Api.Core.Models;

namespace Api.Models;

public class Inventory : BaseEntity
{
    public int ProductId { get; set; }
    public int BranchId { get; set; }
    public int Quantity { get; set; }
    public int ReorderLevel { get; set; } = 10;
    public int MaxStockLevel { get; set; } = 100;
    public DateTime LastRestocked { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Product Product { get; set; } = null!;
    public virtual Branch Branch { get; set; } = null!;
}
