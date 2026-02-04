using System.Text.Json.Serialization;
using Api.Core.Models;
using Api.Enums;

namespace Api.Models.StockTransfer
{
    public class StockTransfer : AuditableEntity
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
        public virtual Branch.Branch FromBranch { get; set; } = null!;
        public virtual Branch.Branch ToBranch { get; set; } = null!;
        public virtual User.User RequestedByUser { get; set; } = null!;
        public virtual User.User? ApprovedByUser { get; set; }

        [JsonIgnore]
        public virtual ICollection<StockTransferItem.StockTransferItem> Items { get; set; } = new List<StockTransferItem.StockTransferItem>();
    }
}
