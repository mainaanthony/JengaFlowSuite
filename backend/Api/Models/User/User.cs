using System.Text.Json.Serialization;
using Api.Core.Models;

namespace Api.Models;

public class User : BaseEntity
{
    public string KeycloakId { get; set; } = string.Empty; // Link to Keycloak user
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? LastLoginAt { get; set; }

    // Foreign keys
    public int BranchId { get; set; }
    public int RoleId { get; set; }

    // Navigation properties
    public virtual Branch Branch { get; set; } = null!;
    public virtual Role Role { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<Sale> SalesAttended { get; set; } = new List<Sale>();
    [JsonIgnore]
    public virtual ICollection<PurchaseOrder> PurchaseOrdersCreated { get; set; } = new List<PurchaseOrder>();
    [JsonIgnore]
    public virtual ICollection<PurchaseOrder> PurchaseOrdersApproved { get; set; } = new List<PurchaseOrder>();
    [JsonIgnore]
    public virtual ICollection<StockTransfer> StockTransfersRequested { get; set; } = new List<StockTransfer>();
    [JsonIgnore]
    public virtual ICollection<StockTransfer> StockTransfersApproved { get; set; } = new List<StockTransfer>();
}
