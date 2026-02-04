using System.Text.Json.Serialization;
using Api.Core.Models;

namespace Api.Models.Branch
{
    public class Branch : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation properties
        [JsonIgnore]
        public virtual ICollection<User.User> Users { get; set; } = new List<User.User>();
        [JsonIgnore]
        public virtual ICollection<Inventory.Inventory> InventoryRecords { get; set; } = new List<Inventory.Inventory>();
        [JsonIgnore]
        public virtual ICollection<Sale.Sale> Sales { get; set; } = new List<Sale.Sale>();
        [JsonIgnore]
        public virtual ICollection<StockTransfer.StockTransfer> StockTransfersFrom { get; set; } = new List<StockTransfer.StockTransfer>();
        [JsonIgnore]
        public virtual ICollection<StockTransfer.StockTransfer> StockTransfersTo { get; set; } = new List<StockTransfer.StockTransfer>();
    }
}
