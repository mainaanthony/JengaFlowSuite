using System.Text.Json.Serialization;

namespace Api.Models
{
    public class Branch
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        [JsonIgnore]
        public virtual ICollection<User> Users { get; set; } = new List<User>();
        [JsonIgnore]
        public virtual ICollection<Inventory> InventoryRecords { get; set; } = new List<Inventory>();
        [JsonIgnore]
        public virtual ICollection<Sale> Sales { get; set; } = new List<Sale>();
        [JsonIgnore]
        public virtual ICollection<StockTransfer> StockTransfersFrom { get; set; } = new List<StockTransfer>();
        [JsonIgnore]
        public virtual ICollection<StockTransfer> StockTransfersTo { get; set; } = new List<StockTransfer>();
    }
}
