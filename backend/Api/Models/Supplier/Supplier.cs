using System.Text.Json.Serialization;
using Api.Core.Models;

namespace Api.Models;

public class Supplier : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? ContactPerson { get; set; }
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? Category { get; set; }
    public decimal Rating { get; set; } = 0;
    public bool IsActive { get; set; } = true;

    // Navigation properties
    [JsonIgnore]
    public virtual ICollection<PurchaseOrder> PurchaseOrders { get; set; } = new List<PurchaseOrder>();
}
