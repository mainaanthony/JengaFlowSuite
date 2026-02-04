using System.Text.Json.Serialization;
using Api.Core.Models;
using Api.Enums;

namespace Api.Models.GoodsReceivedNote
{
    public class GoodsReceivedNote : BaseEntity
    {
        public string GRNNumber { get; set; } = string.Empty;
        public int PurchaseOrderId { get; set; }
        public int ReceivedByUserId { get; set; }
        public DateTime ReceivedDate { get; set; }
        public string? Notes { get; set; }
        public GoodsReceivedNoteStatus Status { get; set; } = GoodsReceivedNoteStatus.FullyReceived;

        // Navigation properties
        [JsonIgnore]
        public virtual PurchaseOrder.PurchaseOrder PurchaseOrder { get; set; } = null!;
        public virtual User.User ReceivedByUser { get; set; } = null!;

        [JsonIgnore]
        public virtual ICollection<GoodsReceivedNoteItem.GoodsReceivedNoteItem> Items { get; set; } = new List<GoodsReceivedNoteItem.GoodsReceivedNoteItem>();
    }
}
