using System.Text.Json.Serialization;
using Api.Core.Models;
using Api.Enums;

namespace Api.Models;

public class StockTransfer : BaseEntity
{
    public string TransferNumber { get; set; } = string.Empty;
    public int FromBranchId { get; set; }
    public int ToBranchId { get; set; }
    public int RequestedByUserId { get; set; }
    public int? ApprovedByUserId { get; set; }
    public StockTransferStatus Status { get; set; } = StockTransferStatus.Pending;
    public DateTime RequestedDate { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedDate { get; set; }
    public string? Notes { get; set; }

    // Navigation properties
    public virtual Branch FromBranch { get; set; } = null!;
    public virtual Branch ToBranch { get; set; } = null!;
    public virtual User RequestedByUser { get; set; } = null!;
    public virtual User? ApprovedByUser { get; set; }

    [JsonIgnore]
    public virtual ICollection<StockTransferItem> Items { get; set; } = new List<StockTransferItem>();
}
